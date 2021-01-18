import Sequelize from 'sequelize';
import config from '../config/database';

/**
 * DB connection class.
 */
class Database extends Sequelize {

  /**
   * constructor.
   * Create a DB connection instance of Sequelize.
   */
  constructor() {
    super(
      config.database,
      config.username,
      config.password,
      config
    );
  }

  /**
   * Returns true if the DB can be connected, false if the connection cannot be made..
   */
  async isConnect() {
    try {
      await this.authenticate();
      return true;
    } catch {
      return false;
    }
  }
}
export default new Database();