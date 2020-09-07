#! /bin/bash

BACK=1;
FRONT=2;
ALL=3;
EXIT=4;

PRODUCTION=1;
STAGING=2;
DEVELOPMENT=3;

BACK_FOLDER='api-nodejs';
FRONT_FOLDER='site-nodejs';

function output {
    echo -e "\e[1;32m${1}\e[0m"
}

function errorOutput {
    echo -e "\e[1;31m${1}\e[0m"
}

function build_back {
    output 'Webserver: Getting updates on gitlab...'
    if [ $env = "production" ] || [ $env = "staging" ]; then
        git checkout .
    fi
    git pull origin $branch
    echo ''
    
    output 'Webserver: Installing new dependencies...'
    npm install
    npm audit fix
    echo ''
    
    output 'Webserver: Running new migrations...'
    NODE_ENV=$env node_modules/.bin/sequelize db:migrate --env $env
    echo ''
    
    echo
    output 'Deseja rodar os seeds? [Y/N]'
    read seeds
    echo
    
    if [ $seeds = "Y" ] || [ $seeds = "y" ] || [ $seeds = 'YES' ] || [ $seeds = 'yes' ]; then
        output 'Webserver: Running seeds...'
        NODE_ENV=$env node_modules/.bin/sequelize db:seed:all --env $env
    fi
}

function build_front {
    output 'Creating public folder if not exist on webserver...'
    mkdir -p public
    echo ''
    
    output 'Erasing public folder on webserver...'
    rm -rf public/*
    echo ''
    
    cd "../$FRONT_FOLDER"
    
    output 'Front: Getting updates on gitlab...'
    if [ $env = "production" ] || [ $env = "staging" ]; then
        git checkout .
    fi
    git pull origin $branch
    echo ''
    
    output 'Front: Installing new dependencies...'
    npm install
    npm audit fix
    echo ''
    
    output 'Front: Building...'
    ng build $build
    echo ''
    
    output 'Front: Copying file from front to back...'
    cp -R dist/* "../$BACK_FOLDER/public/"
    echo ''
    
    output 'Front: Moving index from public to view folder...'
    mv "../$BACK_FOLDER/public/index.html" "../$BACK_FOLDER/views/index.ejs"
    echo ''

    output 'Front: Replace version in html...'
    sed -i "s/<title>\(.*\)<\/title>/<title>\1 $version<\/title>/g" "../$BACK_FOLDER/views/index.ejs"
    echo ''
}

function build_all {
    build_back;
    build_front;
}

function menu {
    
}

#MAIN MENU PROJECTS
echo
output '[ 1 ] - Production'
output '[ 2 ] - Staging'
output '[ 3 ] - Development'
echo
output 'Para qual ambiente deseja fazer o build?'
read env
echo

echo
output 'Em qual branch deseja fazer o build?'
read branch
echo

echo
output '[ 1 ] - YARN'
output '[ 2 ] - NPM'
output 'Utiliza qual gerenciador de pacotes?'
read package
echo

case $env in
    $PRODUCTION) env='production'
        build='--prod'
    ;;
    
    $STAGING) env='staging'
        build=''
    ;;
    
    $DEVELOPMENT) env='development'
        build=''
    ;;
    
    *) errorOutput "Error: This option isn't valid, please type a valid option."; exit;;
esac;

echo
output '[ 1 ] - Back-end'
output '[ 2 ] - Front-end'
output '[ 3 ] - Todos'
output '[ 4 ] - Sair'
echo

output 'Qual projeto deseja buildar?'
read project
echo

output 'Qual a versão do build?'
read version
echo

case $project in
    $BACK) build_back;;
    $FRONT) build_front;;
    $ALL) build_all;;
    $EXIT) exit;;
    *) errorOutput "This option isn't valid, please type a valid option."; exit;;
esac;

if [ $env = "production" ] || [ $env = "staging" ]; then
    output 'Webserver: Restarting PM2...'
    echo
    sudo pm2 restart all && sudo pm2 save && sudo pm2 logs
fi