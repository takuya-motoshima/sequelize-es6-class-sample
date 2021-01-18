import EmployeeModel from './model/EmployeeModel';
import OfficeModel from './model/OfficeModel';
import { exec } from 'child_process';
import program from 'commander';
import Logger from './shared/Logger';

// Command arguments
const args = program
  .option('-m, --mode <mode>', 'Execution mode.', /^(parent|child)$/i, 'parent')
  .parse(process.argv)
  .opts();

// Parent thread processing
function parent() {
  // Execute child threads..
  exec('npx babel-node src/causeDeadlock --mode child', (err, stdout, stderr) => {
    if (err) Logger.error(stderr);
  });
  exec('npx babel-node src/causeDeadlock --mode child', (err, stdout, stderr) => {
    if (err) Logger.error(stderr);
  });
}

// Child thread processing
async function child() {
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
    throw e;
  }
}

// Processing for each mode.
if (args.mode === 'parent') parent();
else if (args.mode === 'child') child();
else throw new Error('The mode is invalid.');