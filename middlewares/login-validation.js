const {interface, auth} = require('config');
const models = require(`../interfaces/${interface}/models`);
const jwt = require("jsonwebtoken");

let checkUserIsLogged = (req, res, next) => {
    if (auth.bypass_login) {
        console.info(`Usuário (bypass@boticario.com.br) com login de bypass. Vai para próxima etapa de verifição.`);
        req.user = {
            name_id: 'bypass@boticario.com.br'
        };
        return next();
    } else if (req.user) {
        console.info(`Revendedor (${req.user.name_id}) com login válido. Vai para próxima etapa de verifição.`);
        return next();
    }

    console.info(`Revendedor com sessão inválida.`);
    let err = new Error('Reseller with invalid session');
    err.name = 'InvalidUser';
    return next(err);
}

let checkUserInPlatform = (req, res, next) => {
    if(auth.bypass_login || auth.bypass_platform){
        return next();
    }

    models.Resellers.findOne({
        attributes: ['id', 'name', 'email'],
        where: {
            email: req.user_id
        }
    }).then((user) => {
        if (!user) {
            console.error(`Revendedor não registrado/permitido na plataforma.`);
            let err = new Error('Revendedor não registrado/permitido na plataforma.');
            err.name = 'InvalidUserDb';
            return next(err);
        }

        req.user = user;
        req.user.name_id = user.email;
        return next();
    });
}

let checkUserJWT = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    let tokenProcessed = token && token.split(' ')[1];
    if (!tokenProcessed) {
        console.info(`Usuário sem token.`);
        let err = new Error('Usuário sem token.');
        err.name = 'InvalidUser';
        return next(err);
    }
    
    jwt.verify(tokenProcessed, auth.jwt_secret, function(err, decoded) {
        if (err) {
            console.info(`Usuário com token inválido.`);
            let err = new Error('Usuário com token inválido.');
            err.name = 'InvalidUser';
            return next(err);
        }
        
        // se tudo estiver ok, salva no request para uso posterior
        req.user_id = decoded.user;
        next();
    });
}

module.exports.validate = () => {
    let middlewares = [];

    middlewares.push(checkUserJWT);
    middlewares.push(checkUserInPlatform);
    middlewares.push(checkUserIsLogged);

    return middlewares;
}