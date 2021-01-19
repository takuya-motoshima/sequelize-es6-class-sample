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
    this.write('DEBUG', message);
  }

  /**
   * Write error log.
   * format: ERROR - <YYYY-MM-DD HH:mm:ss> --> #<PID> <Message>
   */
  static error(message) {
    this.write('ERROR', message instanceof Error ? `${message.message} ${message.stack}` : message);
  }

  /**
   * Write a log to a file.
   */
  static write(level, message) {
    logStream.write(`${level} - ${moment().format('YYYY-MM-DD HH:mm:ss')} --> #${process.pid} ${message}\n`);
  }
}