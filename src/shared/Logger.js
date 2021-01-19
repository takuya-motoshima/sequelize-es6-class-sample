import fs from 'fs';
import moment from 'moment';

// Log file write stream.
const logStream = fs.createWriteStream('./debug.log', {'flags': 'a'});

/**
 * Log file output class.
 */
export default class {

  /**
   * Write debug log.
   * format: DEBUG - <YYYY-MM-DD HH:mm:ss> --> #<PID> <Message>
   */
  static debug(message) {
    message = `DEBUG - ${moment().format('YYYY-MM-DD HH:mm:ss')} --> #${process.pid} ${message}`;
    logStream.write(`${message}\n`)
  }

  /**
   * Write error log.
   * format: ERROR - <YYYY-MM-DD HH:mm:ss> --> #<PID> <Message>
   */
  static error(message) {
    if (message instanceof Error) message = `ERROR - ${moment().format('YYYY-MM-DD HH:mm:ss')} --> #${process.pid} ${message.message} ${message.stack}`;
    else message = `ERROR - ${moment().format('YYYY-MM-DD HH:mm:ss')} --> #${process.pid} ${message}`;
    logStream.write(`${message}\n`)
  }
}