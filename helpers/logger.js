const config = require("config");
const {createLogger,format,transports} = require('winston');
const {combine,timestamp,printf} = format;


const myFormat = printf(info => {
    return `${info.timestamp} - ${info.level.toUpperCase()}: ${info.message}`;
});

const logger = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console({
            level: config.logs.application.level,
        })
    ]
});

module.exports = logger