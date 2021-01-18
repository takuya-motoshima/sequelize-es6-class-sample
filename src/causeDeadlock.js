import EmployeeModel from './model/EmployeeModel';
import { exec } from 'child_process';
import program from 'commander';

// Command arguments
const args = program
  .option('-m, --mode <mode>', 'Execution mode.', /^(parent|child)$/i, 'parent')
  .parse(process.argv)
  .opts();

// Parent thread processing
function parent() {
  // Execute child threads..
  exec('npx babel-node src/causeDeadlock --mode child', (err, stdout, stderr) => console.log(err ? stderr : stdout));
  exec('npx babel-node src/causeDeadlock --mode child', (err, stdout, stderr) => console.log(err ? stderr : stdout));
  exec('npx babel-node src/causeDeadlock --mode child', (err, stdout, stderr) => console.log(err ? stderr : stdout));
}

// Child thread processing
async function child() {
  try {
    // Employee data to add.
    const sets = [...Array(10).keys()].map(i => ({
      officeId: 1,
      name: `#${process.pid}_${i}`
    }));

    // Add employee record.
    await EmployeeModel.bulkCreate(sets, {
      validate: true,
      returning: false,
      updateOnDuplicate: Object.keys(sets[0])
    });
    console.log(`#${process.pid} Add employees was successful. `);
  } catch (e) {
    console.log(`#${process.pid} Add employees was failed. Message: ${e.message}`);
    throw e;
  }
}

// Processing for each mode.
if (args.mode === 'parent') parent();
else if (args.mode === 'child') child();
else throw new Error('The mode is invalid.');