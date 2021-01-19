import EmployeeModel from './model/EmployeeModel';
import OfficeModel from './model/OfficeModel';
import { exec } from 'child_process';
import program from 'commander';
import Logger from './shared/Logger';
import cron from 'node-cron';
import moment from 'moment';
import { Op } from 'sequelize';

// Number of child processes.
const numberOfChildProcesses = 2

// True if truncate the employee before execution.
const isTruncateEmployees = false;

// Command arguments
const args = program
  .option('-m, --mode <mode>', 'Execution mode.', /^(parent|child)$/i, 'parent')
  .option('-i, --index <index>', 'Child process index.')
  .parse(process.argv)
  .opts();

// Start child process.
async function startChildProcess() {
  // Clear the employee table.
  if (isTruncateEmployees)
    await EmployeeModel.destroy({ truncate : true, cascade: false });

  // Execution time.
  const time = moment().add(2, 'seconds');
  const hour = time.hour();
  const minute = time.minute();
  const second = time.second();
  // Execute multiple DB update tasks after 2 second.
  for (let i=0; i<numberOfChildProcesses; i++) {
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
    Logger.debug(`Add office was successful. Added office: ${JSON.stringify(office.toJSON())}`);

    // Update office.
    await OfficeModel.update({
      city: `${office.city}_edited`
    }, {
      where: {
        id: office.id
      }
    });
    Logger.debug('Update office was successful.');

    // // Search employee.
    // const employees = await EmployeeModel.findAll({
    //   where: { id: { [Op.gte]: 1 } },
    //   raw: true
    // });
    // Logger.debug(`Search employees was successful. Count: ${employees.length}`);

    // Add employee.
    // let names = 'abcdefghijklmnopqrstuvwxyz'.split('');
    // if (args.index % 2 !== 0) names.reverse();
    // const sets = names.map(name => ({ officeId: office.id, name }));
    const sets = [...Array(10).keys()].map(i => ({
      officeId: office.id,
      name: `${office.id}_${i}`
    }));
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