import EmployeeModel from './model/EmployeeModel';
import OfficeModel from './model/OfficeModel';
import { exec } from 'child_process';
import program from 'commander';
import Logger from './shared/Logger';
import cron from 'node-cron';
import moment from 'moment';

// Command arguments
const args = program
  .option('-m, --mode <mode>', 'Execution mode.', /^(parent|child)$/i, 'parent')
  .parse(process.argv)
  .opts();

// Start child process.
function startChildProcess() {
  // Execution time.
  const time = moment().add(2, 'seconds');
  const hour = time.hour();
  const minute = time.minute();
  const second = time.second();

  // Execute multiple DB update tasks after 2 second.
  for (let i=0; i<10; i++) {
    cron.schedule(`${second} ${minute} ${hour} * * *`, async () => {
      exec('npx babel-node src/causeDeadlock --mode child', (err, stdout, stderr) => {
        if (err) Logger.error(stderr);
      });
    });
  }
}

// Child process.
async function childProcess() {
  try {
    // Add office.
    const office = await OfficeModel.create({
      city: `#{process.pid}`
    }, {
      validate: true,
      returning: true
    });
    Logger.debug('Add office was successful.');

    // Update office.
    await OfficeModel.update({
      city: `#{process.pid}`
    }, {
      where: { id: office.id },
    });
    Logger.debug('Update office was successful.'); 

    // Employee data to add.
    const sets = [...Array(10).keys()].map(i => ({
      officeId: office.id,
      seq: i,
      name: `#${process.pid}_${i}`
    }));

    // Add employee.
    await EmployeeModel.bulkCreate(sets, {
      validate: true,
      returning: true,
      updateOnDuplicate: Object.keys(sets[0])
    });
    Logger.debug('Add employees was successful.');
  } catch (e) {
    Logger.error(e.message);
    throw e;
  }
}

// Processing for each mode.
if (args.mode === 'parent') startChildProcess();
else if (args.mode === 'child') childProcess();
else throw new Error('The mode is invalid.');