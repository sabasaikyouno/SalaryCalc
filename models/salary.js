'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const salary = loader.database.define(
  'salaries',
  {
    time: {
      type: Sequelize.DATE,
      primaryKey: true,
      allowNull: false
    },
    daily_salary: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    working_hours: {
      type: Sequelize.DATE,
      allowNull: false
    },
    paid_holiday: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = salary;