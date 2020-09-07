const config = require('config');

module.exports = (req, res, next) => {
    res.responser = (status, msg = '', data = {}, error = null, type = 'json') => {

        if (config.logs.active) {
            let urlsDontLog = ['/health', '/users/me']; 

            let Log = require(`../interfaces/${config.logs.interface}/classes/log`);
            Log = new Log(req, status, msg, urlsDontLog);
            Log.write();
        }

        if (error) {
            console.error(msg, error);
            console.log('Error details:', error);
        }

        return res.status(status).type(type).send({
            data,
            status,
            msg
        });
    }
    
    next();
}