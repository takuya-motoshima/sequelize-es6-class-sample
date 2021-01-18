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

// PID.
const pid = process.pid;

// DB update time.
const executionTime = moment(args.time);
// const executionTime = moment().add(5, 'seconds');
const hour = executionTime.hour();
const minute = executionTime.minute();
const second = executionTime.second();
Logger.debug(`#${pid} Hour: ${hour}`);
Logger.debug(`#${pid} Minute: ${minute}`);
Logger.debug(`#${pid} Second: ${second}`);

// Register the process to update DB in cron.
cron.schedule(`${second} ${minute} ${hour} * * *`, async () => {
  try {
    // Office ID to be processed.
    const officeId = 1;

    // Updated office name.
    await OfficeModel.update(
      { city: `#${pid}` },
      { where: { id: officeId } }
    );
    Logger.debug(`#${pid} Update office was successful.`);

    // Employee data to add.
    const sets = [...Array(10).keys()].map(i => ({
      officeId,
      name: `#${pid}_${i}`
    }));

    // Add employee record.
    await EmployeeModel.bulkCreate(sets, {
      validate: true,
      returning: true,
      updateOnDuplicate: Object.keys(sets[0])
    });
    Logger.debug(`#${pid} Add employees was successful. `);
  } catch (e) {
    Logger.debug(`#${process.pid} Child thread was failed. Message: ${e.message}`);
  }
});
