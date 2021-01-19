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
  .option('-i, --index <index>', 'Child process index.')
  .parse(process.argv)
  .opts();

// Start child process.
async function startChildProcess() {
  // Clear the employee table.
  await EmployeeModel.destroy({ truncate : true, cascade: false });

  // Execution time.
  const time = moment().add(2, 'seconds');
  const hour = time.hour();
  const minute = time.minute();
  const second = time.second();
  // Execute multiple DB update tasks after 2 second.
  for (let i=0; i<4; i++) {
    cron.schedule(`${second} ${minute} ${hour} * * *`, async () => {
      exec(`npx babel-node src/causeDeadlock --mode child --index ${i}`, (err, stdout, stderr) => {
        if (err) Logger.error(stderr);
      });
    });
  }
}

// Child process.
async function childProcess() {
  const trn = await EmployeeModel.begin();
  try {
    // Add office.
    const office = await OfficeModel.create({ city: `#{process.pid}` }, {
      transaction: trn
    });
    Logger.debug('Add office was successful.');

    // Add employee.
    let names = 'abcdefghijklmnopqrstuvwxyz'.split('');
    // if (args.index % 2 !== 0) names.reverse();
    const sets = names.map(name => ({ officeId: office.id, name }));
    await EmployeeModel.bulkCreate(sets, {
      transaction: trn,
      validate: true,
      returning: true,
      updateOnDuplicate: Object.keys(sets[0])
    });
    Logger.debug('Add employees was successful.');
    await trn.commit();
  } catch (e) {
    Logger.error(e);
    await trn.rollback();
    throw e;
  }
}

// Processing for each mode.
if (args.mode === 'parent') startChildProcess();
else if (args.mode === 'child') childProcess();
else throw new Error('The mode is invalid.');