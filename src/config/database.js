import Logger from '../shared/Logger';

// Returns DB connection information.
export default {
  host: 'localhost',
  username: 'root',
  password: null,
  database: 'sequelize-es6-class-sample',
  dialect: 'mariadb',
  dialectOptions: {
    useUTC: false,
    timezone: 'Etc/GMT-9'
  },
  timezone: 'Etc/GMT-9',
  // disable logging; default: console.log
  logging: message => Logger.debug(message)
}