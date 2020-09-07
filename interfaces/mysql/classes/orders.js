const models = require(`../models`);
const Base = require('./base');
const orderSchema = require('../../validations/order.validations');

const UtilClass = require('../../../helpers/util');
const Util = new UtilClass();
const config = require('config');
const moment = require("moment");
const currency = require("currency.js");
const Op = models.Sequelize.Op;
const bcrypt = require('bcryptjs');


class Order extends Base{

    //Class constructor;
    constructor() {
        super();
    }
   
    //Save order in database;
    async save(order) {
        let data = {
            reseller_id: order.id,
            price: order.price,
            dataCompra: order.data,
            cpf: order.cpf,
            status: order.cpf === config.auth.cpf ? 'approved' : 'not approved'
        };
        const errors = this._validateFields(data, orderSchema);
        // format date
        data.dataCompra = moment(data.dataCompra,"DD/MM/YYYY").format("YYYY-MM-DD");
        data.cashback = this.cashback(order.price);
        if (!errors.length) {
            return await models.Orders.create(data);
        } else {
            throw errors[0];
        }
    }

    //Update reseller in database;
    async update(updatedData, where) {
        try {
            let currentUser = await models.Users.find({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                include: [ { model: models.Profiles } ],
                where
            });

            if (currentUser) {

                let code = updatedData.code
                delete updatedData.code;

                let profile = await models.Profiles.find({ where: { code: currentUser.Profile.code }})
                updatedData.profileId = profile.id;

                if ( code === 'EXTERNAL') {
                    updatedData.salt = Util.generateGuid();
                    updatedData.password = this.encryptPassword(updatedData.salt, updatedData.password);
                }

                updatedData.updatedAt = new Date();
                let data = {
                    ...currentUser.dataValues,
                    ...updatedData
                };

                delete data.createdAt;

                let errors = this._validateFields(data,resellerSchema);

                if (!errors.length) {
                    return await models.Users.update(data, {
                        where
                    });
                } else {
                    throw errors[0];
                }
            } else {
                throw {
                    name: 'InvalidBody',
                    code: 400,
                    msg: 'Não foi encontrado o usuário para ser atualizado.',
                    value: null
                };
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    //Active reseller in database
    async validate(where) {
        try {
            let currentOrder = await models.Orders.findOne({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                where
            });

            if (currentOrder) {
                
                return await models.Orders.update({ active: 1}, {
                    where
                });
                
            } else {
                throw {
                    name: 'InvalidBody',
                    code: 400,
                    msg: 'Não foi encontrado o reseller para ser atualizado.',
                    value: null
                };
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    //Retrieve reseller from database;
    async get(filters = {}, attributes = false) {
        let promises = [];

        let query = {
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            where: {},
            include: []
        }

        if (attributes) {
            query.attributes = attributes.replace(/(^,|,$)/ig, '').split(',');
        }

        if (filters.recent){
            query.where.createdAt = {
                [Op.gte]: new Date(new Date() - 30*24*60*60*1000)
            }
        }

        let queryCount = Object.assign({}, query);
        queryCount.distinct = true;
        queryCount.attributes = [];

        try {
            promises.push(models.Orders.findAll(query));
            promises.push(models.Orders.count(queryCount));
            return await Promise.all(promises);
        } catch (err) {
            throw err;
        }
    }

    //Calc percentage cashback
    cashback(price) {
        let _cashback = 0;
        if (price <= 1000) {
            _cashback = parseFloat(((price / 100) * 10));
        } else if (price > 1000 && price < 1500) {
            _cashback = parseFloat(((price / 100) * 15));
        } else if (price > 1500) {
            _cashback = parseFloat(((price / 100) * 20));
        } 
        return currency(_cashback).add(parseFloat(price));
    }
}

module.exports = Order;