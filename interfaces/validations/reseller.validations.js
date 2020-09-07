const joi = require('joi');
const joiMessages = require('../../config/joi-messages');

module.exports = joi.object({
    id: joi.number().integer().positive().label('id'),
    name: joi.string().min(3).max(128).required().label('name'),
    cpf: joi.string().min(11).max(11).required().label('cpf'),
    email: joi.string().email({minDomainSegments: 2}).required().label('email'),
    password: joi.string().min(3).max(256).required().label('password'),
    createdAt: joi.date().allow(null).optional().label('createdAt'),
    updatedAt: joi.date().allow(null).optional().label('updatedAt'),
}).messages(joiMessages);