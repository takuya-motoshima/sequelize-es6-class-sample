import OfficeModel from './model/OfficeModel';

(async () => {
  // Add offices.
  const result = await OfficeModel.create(
    {
      city: `#{process.pid}`
    },
    {
      validate: true,
      returning: true
    });
  console.log(`Added an office with ID = ${result.id}`);
})();