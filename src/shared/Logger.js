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
   */
  static debug(message) {
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    logStream.write(`DEBUG - ${time} --> ${message}\n`)
  }
}