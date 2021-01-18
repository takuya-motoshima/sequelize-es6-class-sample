import EmployeeModel from './model/EmployeeModel';

(async () => {
  // Search all employees.
  const employees = await EmployeeModel.findAll({ raw: true });
  console.log(employees);
})();