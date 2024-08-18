//check the require fields is blank or not
const validation = async (requirefields, data) => {
  const missingFields = requirefields.filter((field) => !data[field]);
  return missingFields.length > 0 ? missingFields : null;
};

module.exports = {
  validation
};
