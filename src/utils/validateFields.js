import validations from '../configs/validations';

const validateFields = ({ fields, values, formData, schema, currentPage, parentIndex }) => {
  let errors = {};
  let allValid = true;
  fields.forEach((element) => {
    if (element.type === 'multiplier') {
      if (!errors[element.name]) errors[element.name] = [];
      if (!values) {
        errors[element.name] = element.schema[0].fields.map((field) =>
          validateFields({
            fields: element.schema[0].fields,
            values,
            formData,
            schema,
            currentPage,
          }),
        );
      } else {
        const multiplierValues = values[element.name] ? values[element.name] : [];
        errors[element.name] = multiplierValues.map((values, index) => {
          parentIndex = index;
          return validateFields({
            fields: element.schema[0].fields,
            values,
            formData,
            schema,
            currentPage,
            parentIndex,
          });
        });
      }
    } else {
      if (element.isRequired && (!values || !values[element.name])) {
        allValid = false;
        errors[element.name] = 'This field is requiered';
      }
      if (element.validation) {
        switch (element.validation) {
          case 'oneOfAll':
            if (
              !values ||
              !values[element.name] ||
              (values[element.name] && allFalse(values[element.name]))
            ) {
              allValid = false;
              errors[element.name] = 'Select at least one option';
            }
            break;
          default:
            if (validations[element.validation]) {
              let validationResult = validations[element.validation]({
                formData,
                field: element,
                schema,
                currentPage,
                parentIndex,
              });
              if (validationResult) {
                allValid = validationResult.allValid;
                errors[element.name] = validationResult.error;
              }
            }
            break;
        }
      }
    }
  });
  return { errors, allValid };
};

function allFalse(obj) {
  for (var i in obj) {
    if (obj[i] === true) return false;
  }
  return true;
}

export default validateFields;
