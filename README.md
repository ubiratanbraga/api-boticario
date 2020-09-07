# APi Boticario
> API de Desafio do Boticario

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]

A API inicializa um banco MySQL, o PhpMyadmin na porta 8080

![](../header.png)

## Instalação

Criar uma pasta .dockerdata fora da pasta do projeto:

```sh
mkdir .dockerdata
```

Criando a seguinte estrutura:
.dockerdata/
api-boticario/

```sh
docker-compose up .
```

Sequelize Database e Migrations :

```sh
NODE_ENV=development npx sequelize db:create
NODE_ENV=development npx sequelize-cli db:migrate
```

Inicializa a API

```sh
npm run start
```

## Uso da APi


```sh

POST (Cadastro de Revendedores)
http://localhost:9000/resellers
{
    "name": "sonia",
    "cpf": "35763784876",
    "email": "sonia@gmail.com",
    "password": "abc123"
}
```

Login Revendedores

```sh
POST
http://localhost:9000/auth/login
{
    "login": "sonia@gmail.com",
    "password": "abc123"
}
```


Pedidos

```sh

POST (Cadastro de Pedido)
http://localhost:9000/resellers
{
    "id": 2,
    "price": "330.20",
    "data": "27/08/2020",
    "cpf": "15350946056"
}
```


Listagem de Pedidos

```sh

GET 
http://localhost:9000/order/
```


[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/seunome/seuprojeto/wiki