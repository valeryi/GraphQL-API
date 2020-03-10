import { createLogger, format, transports } from 'winston';
const { combine, colorize, timestamp, label, printf } = format;

const debugFormat = combine(
  colorize({
    all: true
  }),
  label({
    label: '[LOGGER]'
  }),
  timestamp({
    format: "YY-MM-DD HH:MM:SS"
  }),
  // printf(
  //   info => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
  // )
);

const productionFormat = combine(
  colorize({
    all: true
  }),
  label({
    label: '[LOGGER]'
  }),
  timestamp({
    format: "YY-MM-DD HH:MM:SS"
  }),
  printf(
    info => ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
  )
);

// TODO: Logging - setup transports and formats for different modes: production, development, ...
const transport = {
  console: new transports.Console({ level: 'info', format: combine(colorize(), debugFormat) }),
  file: new transports.File({ level: 'info', filename: 'api-combined.log', format: combine(colorize(), productionFormat) }),
  exceptions: new transports.Console({ level: 'info', format: combine(colorize(), debugFormat) }),
}

export const logger = createLogger({
  exceptionHandlers: transport.exceptions
});

if (process.env.NODE_ENV === 'production') {
  logger.add(transport.console);
  logger.add(transport.file);
} else {
  logger.add(transport.console);
}
