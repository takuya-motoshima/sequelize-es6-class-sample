# sequelize-es6-class-sample

This is the experimental code for the Sequelize ORM.

## Requirements

- Node.js
- NPM
- MariaDB (This sample application targets MariaDB.)

## Getting Started

### Create sample DB

1. Create DB.

    ```sql
    CREATE DATABASE IF NOT EXISTS `sequelize-es6-class-sample` DEFAULT CHARACTER SET utf8mb4;
    USE `sequelize-es6-class-sample`;
    ```

1. Create sample table.

    ```sql
    DROP TABLE IF EXISTS `office`;
    CREATE TABLE `office` (
      `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
      `city` varchar(50) NOT NULL,
      `created` datetime NOT NULL DEFAULT current_timestamp(),
      `modified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    INSERT  INTO `office`(`id`, `city`) VALUES
      (1, 'San Francisco'),
      (2, 'Boston'),
      (3, 'NYC'),
      (4, 'Paris'),
      (5, 'Tokyo'),
      (6, 'Sydney'),
      (7, 'London');

    DROP TABLE IF EXISTS `employee`;
    CREATE TABLE `employee` (
      `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
      `officeId` int(10) unsigned NOT NULL,
      `seq` int(10) unsigned NOT NULL,
      `name` varchar(50) NOT NULL,
      `created` datetime NOT NULL DEFAULT current_timestamp(),
      `modified` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (`id`),
      UNIQUE KEY `uk_employee_1` (`officeId`,`seq`),
      CONSTRAINT `fk_employee_1` FOREIGN KEY (`officeId`) REFERENCES `office` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    INSERT  INTO `employee`(`officeId`,`seq`,`name`) VALUES
      (1, 0, 'Diane'),
      (1, 1, 'Mary'),
      (2, 0, 'Julie'),
      (3, 0, 'Foon Yue'),
      (4, 0, 'Gerard'),
      (5, 0, 'Mami'),
      (6, 0, 'William'),
      (7, 0, 'Larry');
    ```

1. Check registration details.

    ```sql
    SELECT office.city, employee.name FROM employee join office on employee.officeId = office.id ORDER BY office.city;
    +---------------+----------+
    | city          | name     |
    +---------------+----------+
    | Boston        | Julie    |
    | London        | Larry    |
    | NYC           | Foon Yue |
    | Paris         | Gerard   |
    | San Francisco | Mary     |
    | San Francisco | Diane    |
    | Sydney        | William  |
    | Tokyo         | Mami     |
    +---------------+----------+
    ```

### Run the sample program.

The executed SQL is output to "./debug.log".  

#### Search all offices.

```sh
npx babel-node src/searchAllOffices;
# Search all offices: [
#   {
#     id: 1,
#     city: 'San Francisco',
#     created: 2021-01-18T02:39:30.000Z,
#     modified: 2021-01-18T02:39:30.000Z
#   },
#   {
#     id: 2,
#     city: 'Boston',
#     created: 2021-01-18T02:39:30.000Z,
#     modified: 2021-01-18T02:39:30.000Z
#   },
#   ...
# ]
```

#### Search all offices.

```sh
npx babel-node src/searchOffices;

# [
#   {
#     id: 1,
#     city: 'San Francisco',
#     created: 2021-01-18T02:39:30.000Z,
#     modified: 2021-01-18T02:39:30.000Z
#   },
#   {
#     id: 2,
#     city: 'Boston',
#     created: 2021-01-18T02:39:30.000Z,
#     modified: 2021-01-18T02:39:30.000Z
#   },
#   ...
# ]
```

#### Search all employees.

```sh
npx babel-node src/searchEmployees;

# [
#   {
#     id: 1,
#     officeId: 1,
#     name: 'Diane',
#     created: 2021-01-18T03:10:42.000Z,
#     modified: 2021-01-18T03:10:42.000Z
#   },
#   {
#     id: 2,
#     officeId: 1,
#     name: 'Mary',
#     created: 2021-01-18T03:10:42.000Z,
#     modified: 2021-01-18T03:10:42.000Z
#   },
# ]
```

#### Search by adding office information to employees.

```sh
npx babel-node src/searchEmployeesJoinOffice;

# Added an office with ID = 8
#   { name: 'Diane', office: { city: 'San Francisco' } },
#   { name: 'Mary', office: { city: 'San Francisco' } },
#   ...
# ]
```

#### Add office.

```sh
npx babel-node src/addOffices;
# Added an office with ID = 8
```

## Usage

### Directory structure

```sh
.
├── src                              # Sample program file
│   ├── shared                       # Common module
│   │   ├──Model.js                  # Model base class
│   │   └──Database.js               # DB connection class
│   ├── config                       # Configuration file.
│   │   └──database.js               # DB connection config
│   ├── model                        # Model subclass
│   │   ├──OfficeModel.js            # Office model
│   │   └──EmployeeModel.js          # Employee model
│   ├── searchOffices.js             # Office search sample code
│   ├── searchEmployees.js           # Employee search sample code
│   └── searchEmployeesJoinOffice.js # Model subclass
└── .babelrc                         # babel transpile option
```

### How to make a model class.

1. Add a new model class file to the 'src/model' directory.

    Here, we will add a sample model as an example.  
    Inherit the shared / Model class.  
    Define the table names that the model will access and the columns for that table.  
    You can now access the sample table from the sample model.  

    src/model/SampleModel.js:  

    ```js
    import Model from '../shared/Model';

    export default (class extends Model {

      /**
       * Returns the table name.
       */
      static get table() {
        return 'sample';
      }

      /**
       * Returns the columns of the table.
       */
      static get attributes() {
        return {
          id: {
            type: this.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          name: this.DataTypes.STRING,
          created: this.DataTypes.DATE,
          modified: this.DataTypes.DATE
        };
      }
    }).attach();
    ````

1. The following is an example of searching the sample table.

    ```js
    import SampleModel from './model/SampleModel';

    (async () => {
      // Search for sample records.
      const rows = await SampleModel.findAll({ raw: true });
    })();
    ```

## Reference

- [DeadLock investigation in MySQL (InnoDB) - Qiita](https://qiita.com/h-oikawa/items/91e2401fad5d93262f6f)
- [MySQL InnoDB Deadlock For 2 simple insert queries - Database Administrators Stack Exchange](https://dba.stackexchange.com/questions/86878/mysql-innodb-deadlock-for-2-simple-insert-queries)
- [MySQL :: MySQL 8.0 Reference Manual :: 15.7.1 InnoDB Locking](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html#innodb-next-key-locks)
- [Illustrate the mechanism and scope of next key lock in MySQL (InnoDB)](https://norikone.hatenablog.com/entry/2018/09/12/MySQL%28InnoDB%29%E3%81%AE%E3%83%8D%E3%82%AF%E3%82%B9%E3%83%88%E3%82%AD%E3%83%BC%E3%83%AD%E3%83%83%E3%82%AF%E3%81%AE%E4%BB%95%E7%B5%84%E3%81%BF%E3%81%A8%E7%AF%84%E5%9B%B2%E3%82%92%E5%9B%B3%E8%A7%A3)

## License

[MIT licensed](./LICENSE.txt)