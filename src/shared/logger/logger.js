require('dotenv').config();
const pino = require('pino');

const logger = pino({
    name: 'api-rh-pitch',
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() }
        },
    },

    timestamp: pino.stdTimeFunctions.isoTime,
    transport: process.env.NODE_ENV === 'development' ? {
        target : 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'mm-dd-yyyy HH:mm:ss',
            messageFormat: '{req.method} {req.url} = {msg}',
        }
    } : undefined, 
});

module.exports = logger;