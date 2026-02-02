const validator = (inputs) => {
  for (let value of inputs) {
    if (
      value === null || 
      value === undefined || 
      (typeof value === "string" && value.trim() === "") || 
      (typeof value === "number" && isNaN(value))
    ) {
      return false; // invalid case
    }
  }
  return true; // all passed
};

module.exports = validator;