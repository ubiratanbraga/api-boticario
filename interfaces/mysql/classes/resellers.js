const models = require(`../models`);
const Base = require('./base');
const resellerSchema = require('../../validations/reseller.validations');

const UtilClass = require('../../../helpers/util');
const Util = new UtilClass();

const tokenClass = require('../../../helpers/token_generator')
const Token = new tokenClass();

const config = require('config');
const moment = require("moment");
const Op = models.Sequelize.Op;
const bcrypt = require('bcryptjs');


class Reseller extends Base{

    //Class constructor;
    constructor() {
        super();
    }
   
    encryptPassword(password) {
        return bcrypt.hash(password, 10);
    }

    checkPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

    checkEmailPassword(email, password) {
        let query = {
            include: [],
            limit: 1,
            where: { email: email }
        }

        return models.Resellers.findOne(query).then((user) => {
            if (user) {
                if (this.checkPassword(password, user.password)) {
                    return {
                        user,
                        checked: true
                    };
                } else {
                    return {
                        user,
                        checked: false
                    };
                }
                delete user.dataValues.salt;
                delete user.dataValues.password;
            } else {
                return false;
            }
        });
    }

    //Save reseller in database;
    async save(reseller) {
        const errors = this._validateFields(reseller, resellerSchema);
        reseller.password = await this.encryptPassword(reseller.password);
        if (!errors.length) {
            let currentData = await models.Resellers.create(reseller);
            let token = await Token.create(currentData.email, config.auth.jwt_secret);
            let data = {
                ...currentData.dataValues,
                token
            };
            return data;
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
            let currentReseller = await models.Resellers.findOne({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                where
            });

            if (currentReseller) {
                
                return await models.Resellers.update({ active: 1}, {
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

    //Retrieve users from database;
    async get(filters = {}, attributes = false) {
        let promises = [];

        let profiles = {
            model:models.Profiles,
            require:true,
            where: {}
        }

        let query = {
            attributes: {
                exclude: ['salt', 'password']
            },
            where: {},
            include: []
        }

        if (attributes) {
            query.attributes = attributes.replace(/(^,|,$)/ig, '').split(',');
        }

        let queryCount = Object.assign({}, query);
        queryCount.distinct = true;
        queryCount.attributes = [];

        if (filters.order) {
            query.order = filters.order.split(':');
        }

        if (filters.limit) {
            query.limit = parseInt(filters.limit);
        }

        if (filters.offset) {
            query.offset = parseInt(filters.offset);
        }

        try {
            promises.push(models.Resellers.findAll(query));
            promises.push(models.Resellers.count(queryCount));
            return await Promise.all(promises);
        } catch (err) {
            throw err;
        }
    }

    //Delete users from database;
    async delete(userIds) {
        let query = {
            where: {
                id: {
                    [Op.in]: userIds
                }
            }
        }

        try {
            return await models.Users.destroy(query);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Reseller;