import cron from 'node-cron';
import moment from 'moment';
import Logger from './shared/Logger';
import EmployeeModel from './model/EmployeeModel';
import OfficeModel from './model/OfficeModel';
import program from 'commander';

// Command arguments
const args = program
  .option('-t, --time <time>', 'Execution time.')
  .parse(process.argv)
  .opts();

// If there is no execution time of the parameter, an error is returned.
if (!args.time) throw new Error('Parameter execution time is required.');

// DB update time.
const executionTime = moment(args.time);
// const executionTime = moment().add(5, 'seconds');
const hour = executionTime.hour();
const minute = executionTime.minute();
const second = executionTime.second();
Logger.debug(`Hour: ${hour}`);
Logger.debug(`Minute: ${minute}`);
Logger.debug(`Second: ${second}`);

// Register the process to update DB in cron.
cron.schedule(`${second} ${minute} ${hour} * * *`, async () => {
  try {
    // Office ID to be processed.
    const officeId = 1;

    // Updated office name.
    await OfficeModel.update(
      { city: `#${process.pid}` },
      { where: { id: officeId } }
    );
    Logger.debug('Update office was successful.');

    // Employee data to add.
    const sets = [...Array(10).keys()].map(i => ({
      officeId,
      name: `#${process.pid}_${i}`
    }));

    // Add employee record.
    await EmployeeModel.bulkCreate(sets, {
      validate: true,
      returning: true,
      updateOnDuplicate: Object.keys(sets[0])
    });
    Logger.debug('Add employees was successful.');
  } catch (e) {
    Logger.error(`Child thread was failed. Message: ${e.message}`);
  }
});
