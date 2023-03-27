import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
        transports: [
            new winston.transports.DailyRotateFile({
                filename: 'logs/%DATE%/info.log',
                datePattern: 'DD-MMM-YYYY',
                level: 'info',
            }),
            new winston.transports.DailyRotateFile({
                filename: 'logs/%DATE%/errors.log',
                datePattern: 'DD-MMM-YYYY',
                level: 'error'
            }),
        ],
    }
);

export default logger;