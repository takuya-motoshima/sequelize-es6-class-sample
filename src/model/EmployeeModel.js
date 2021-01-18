import Model from '../shared/Model';
import OfficeModel from './OfficeModel';

export default (class extends Model {

  /**
   * Returns the table name.
   */
  static get table() {
    return 'employee';
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
      officeId: this.DataTypes.INTEGER,
      name: this.DataTypes.STRING,
      created: this.DataTypes.DATE,
      modified: this.DataTypes.DATE
    };
  }

  /**
   * Define table associations.
   */
  static association() {
    // Employee belongs to the office.
    this.belongsTo(OfficeModel, {
      foreignKey: 'officeId',
      targetKey: 'id'
    });
  }

  /**
   * Return the employee who joined the office.
   */
  static async findEmployeesJoinOffice(options = {}) {
    // Initialize options.
    options = Object.assign({
      nest: true
    }, options);

    // Returns employee information with office information added.
    return super.findAll({
      attributes: [
        'name',
      ],
      include: [
        {
          model: OfficeModel,
          attributes: [
            'city'
          ]
        }
      ],
      raw: true,
      nest: options.nest
    });
  }
}).attach();