import Model from '../shared/Model';

export default (class extends Model {

  /**
   * Returns the table name.
   */
  static get table() {
    return 'office';
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
      city: this.DataTypes.STRING,
      created: this.DataTypes.DATE,
      modified: this.DataTypes.DATE
    };
  }
}).attach();