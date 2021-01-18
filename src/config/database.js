import fs from 'fs';

// Output the executed SQL to a file.
const logStream = fs.createWriteStream('./sql.log', {'flags': 'a'});

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
  logging: message => logStream.write(`${message}\n`)
  // logging: console.log
}