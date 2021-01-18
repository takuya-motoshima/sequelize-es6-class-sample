import OfficeModel from './model/OfficeModel';

(async () => {
  // Search all offices.
  const offices = await OfficeModel.findAll({ raw: true });
  console.log(offices);
})();