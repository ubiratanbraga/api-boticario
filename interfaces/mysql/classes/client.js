const models            = require(`../models`);
const UtilHelper        = require('../../../helpers/util');
const clientSchema     = require('../../validations/client.validations');
const Op                = models.Sequelize.Op;
const util              = new UtilHelper();

class Clients {

    //Class constructor;
    constructor() {}

    //Save client in database;
    async save(client) {
        try {
            const errors = this._validateFields(client, clientSchema);
            if (!errors.length) {
                return await models.clients.create(client);
            } else {
                throw errors[0];
            }
        } catch (errors) {
            throw errors[0];
        }
    }

    //Update client in database;
    async update(updatedData, where) {
        try {
            let currentClient = await models.Clients.find({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                where
            });

            if (currentClient) {
                let data = {
                    ...currentClient.dataValues,
                    ...updatedData
                };

                let errors = this._validateFields(data);

                if (!errors.length) {
                    return await models.Clients.update(data, {
                        where
                    });
                } else {
                    throw errors[0];
                }
            } else {
                throw {
                    name: 'InvalidBody',
                    code: 400,
                    msg: 'Não foi encontrado o cliente para ser atualizado.',
                    value: null
                };
            }
        } catch (err) {
            throw new Error(err);
        }
    }

    //Retrieve clients from database;
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

        if (filters.id) {
            query.where.id = filters.id;
        }

        if (filters.name) {
            query.where.name = filters.name;
        }

        if (filters.description) {
            query.where.description = filters.description;
        }

        if (filters.search) {
            query.where.name = {
                [Op.like]: `%${filters.search}%`
            }
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
            promises.push(models.Clients.findAll(query));
            promises.push(models.Clients.count(queryCount));
            return await Promise.all(promises);
        } catch (err) {
            throw err;
        }
    }

    //Delete clients from database;
    async delete(userIds) {
        let query = {
            where: {
                id: {
                    [Op.in]: userIds
                }
            }
        }

        try {
            return await models.Clients.destroy(query);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Clients;