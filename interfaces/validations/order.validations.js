const joiBase = require('joi');
const joiDate = require("@hapi/joi-date");
const joiMessages = require('../../config/joi-messages');

const joi = joiBase.extend(joiDate);

module.exports = joi.object({
    reseller_id: joi.number().integer().positive().label('id'),
    price: joi.number().required().label('price'),
    dataCompra: joi.date().format("DD/MM/YYYY").required().label('date'),
    cpf: joi.string().min(11).max(11).required().label('cpf'),
    status: joi.string().label('status')
}).messages(joiMessages);