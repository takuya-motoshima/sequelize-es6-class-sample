import EmployeeModel from './model/EmployeeModel';

(async () => {
  // Search by adding office information to employees.
  const employees = await EmployeeModel.findEmployeesJoinOffice({ nest: true });
  console.log(employees);
})();