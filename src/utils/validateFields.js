import validations from '../configs/validations';

const validateFields = (fields, values, formData, schema, currentPage) => {
  let allValid = true;
  let parentIndex;

  function validate(fields, values) {
    let errors = {};
    fields.forEach((element) => {
      if (element.type === 'multiplier') {
        if (!errors[element.name]) errors[element.name] = [];
        if (!values) {
          errors[element.name] = element.schema[0].fields.map((field) =>
            validate(element.schema[0].fields, values),
          );
        } else {
          const multiplierValues = values[element.name] ? values[element.name] : [];
          errors[element.name] = multiplierValues.map((values, index) => {
            parentIndex = index;
            return validate(element.schema[0].fields, values);
          });
        }
      } else {
        if (element.validations) {
          element.validations.forEach((validation) => {
            if (!errors[element.name]) {
              let validationResult = validations[validation]({
                formData,
                field: element,
                values: values || null,
                value: (values && values[element.name]) || null,
                schema,
                currentPage,
                parentIndex,
              });
              if (validationResult) {
                allValid = allValid && validationResult.valid;
                errors[element.name] = validationResult.error;
              }
            }
          });
        }
      }
    });
    return errors;
  }

  return { errors: validate(fields, values), allValid };
};

function allFalse(obj) {
  for (var i in obj) {
    if (obj[i] === true) return false;
  }
  return true;
}

export default validateFields;
