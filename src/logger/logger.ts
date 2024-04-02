import { createLogger, format, transports } from 'winston';
const { printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), myFormat),
  transports: [new transports.Console()],
});

export default logger;
