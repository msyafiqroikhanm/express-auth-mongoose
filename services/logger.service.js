/* eslint-disable no-unused-vars */
const winston = require('winston');
const LokiTransport = require('winston-loki');
require('dotenv').config();

const { combine, timestamp, json, printf, label } = winston.format;
const dateFormat = () =>
    new Date(Date.now()).toLocaleTimeString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

const myFormatter = winston.format(info => {
    const { message } = info;

    return info;
})();

const errorFilter = winston.format((info, opts) =>
    info.level === 'error' ? info : false
);

const warnFilter = winston.format((info, opts) =>
    info.level === 'warn' ? info : false
);

const infoFilter = winston.format((info, opts) =>
    info.level === 'info' ? info : false
);

class LoggerService {
    constructor(route) {
        this.log_data = null;
        this.user_data = null;
        this.ip = null;
        this.route = route;

        const logger = winston.createLogger({
            transports: [
                // new LokiTransport({
                //   host: 'http://172.16.0.12:3100',
                //   labels: { app: `${process.env.NODE_ENV}-${process.env.APP_NAME}` },
                //   format: combine(myFormatter),
                //   replaceTimestamp: true,
                //   onConnectionError: (err) => console.error(err),
                // }),
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.printf(info => {
                            let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route} | ${
                                info.message
                            } | `;
                            message = info.obj
                                ? `${message}message:${JSON.stringify(info.obj)} | `
                                : message;
                            message = this.log_data
                                ? `${message}log_data:${JSON.stringify(this.log_data)} | `
                                : message;
                            message = this.ip
                                ? `${message}ip:${JSON.stringify(this.ip)} | `
                                : message;
                            message = this.user_data
                                ? `${message}user_data:${JSON.stringify(this.user_data)} | `
                                : message;
                            return message;
                        }),
                        winston.format.colorize({ all: true })
                    ),
                }),
                new winston.transports.File({
                    filename: 'logs/combined.log',
                }),
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                    format: combine(
                        errorFilter(),
                        printf(info => {
                            let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route} | ${
                                info.message
                            } | `;
                            message = info.obj
                                ? `${message}message:${JSON.stringify(info.obj)} | `
                                : message;
                            message = this.log_data
                                ? `${message}log_data:${JSON.stringify(this.log_data)} | `
                                : message;
                            message = this.ip
                                ? `${message}ip:${JSON.stringify(this.ip)} | `
                                : message;
                            message = this.user_data
                                ? `${message}user_data:${JSON.stringify(this.user_data)} | `
                                : message;
                            return message;
                        })
                    ),
                }),
                new winston.transports.File({
                    filename: 'logs/warning.log',
                    level: 'warn',
                    format: combine(
                        warnFilter(),
                        printf(info => {
                            let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route} | ${
                                info.message
                            } | `;
                            message = info.obj
                                ? `${message}message:${JSON.stringify(info.obj)} | `
                                : message;
                            message = this.log_data
                                ? `${message}log_data:${JSON.stringify(this.log_data)} | `
                                : message;
                            message = this.ip
                                ? `${message}ip:${JSON.stringify(this.ip)} | `
                                : message;
                            message = this.user_data
                                ? `${message}user_data:${JSON.stringify(this.user_data)} | `
                                : message;
                            return message;
                        })
                    ),
                }),
                new winston.transports.File({
                    filename: 'logs/access.log',
                    level: 'info',
                    format: combine(
                        infoFilter(),
                        printf(info => {
                            let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route} | ${
                                info.message
                            } | `;
                            message = info.obj
                                ? `${message}message:${JSON.stringify(info.obj)} | `
                                : message;
                            message = this.log_data
                                ? `${message}log_data:${JSON.stringify(this.log_data)} | `
                                : message;
                            message = this.ip
                                ? `${message}ip:${JSON.stringify(this.ip)} | `
                                : message;
                            message = this.user_data
                                ? `${message}user_data:${JSON.stringify(this.user_data)} | `
                                : message;
                            return message;
                        })
                    ),
                }),
            ],
            format: winston.format.combine(
                winston.format.printf(info => {
                    let message = `| ${info.level.toUpperCase()} | ${route} | ${info.message} | `;
                    message = info.obj
                        ? `${message}message:${JSON.stringify(info.obj)} | `
                        : message;
                    message = this.log_data
                        ? `${message}log_data:${JSON.stringify(this.log_data)} | `
                        : message;
                    message = this.ip
                        ? `${message}ip:${JSON.stringify(this.ip)} | `
                        : message;
                    message = this.user_data
                        ? `${message}user_data:${JSON.stringify(this.user_data)} | `
                        : message;
                    return message;
                })
            ),
        });
        this.logger = logger;
    }

    setLogData(log_data) {
        this.log_data = log_data;
    }

    setUserData(user_data) {
        this.user_data = user_data;
    }

    setIP(ip) {
        this.ip = ip;
    }

    async info(message, obj) {
        this.logger.log('info', message, {
            obj,
        });
    }

    async warn(message, obj) {
        this.logger.log('warn', message, {
            obj,
        });
    }

    async error(message, obj) {
        this.logger.log('error', message, {
            obj,
        });
    }
}
module.exports = LoggerService;
