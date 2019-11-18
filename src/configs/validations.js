import moment from 'moment';

const validations = {
  required,
  min,
  max,
  maxLength,
  minLength,
  number,
  url,
  email,
  // date,
  // word,
  // decimalNumber,
  // nif,
  // nie,
  biggerThanDateFrom,
  biggerThanHourFrom,
  biggerThanDepart,
  biggerThanEndDepart,
};

const urlRegex = '';
const emailRegex =
  "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
// const date = '/^(0[1-9]|1[0-2])/(0[1-9]|1d|2d|3[01])/(19|20)d{2}$/';
// const number = '/^[0-9]';
// const decimalNumber = '/^[0-9]+,?[0-9]*$/';
// const nif = '/^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i';
// const nie = '/^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i';

function required(data) {
  let result;
  if (!data.value) {
    result = { valid: false, error: 'This field is requiered' };
  }
  return result;
}

function countCheked(value) {
  let trues = 0;
  Object.keys(value).forEach((key) => {
    if (value[key]) trues++;
  });
  return trues;
}

function min(data) {
  console.log('min', data);
  let result;
  if (!data.params) {
    console.warn('Invalid min validation');
    return result;
  }
  if (data.field.type === 'text' && data.value && data.value.length < +data.params) {
    result = { valid: false, error: `You can check ${data.params} maximum` };
  }
  if (
    data.field.type === 'checkboxGroup' &&
    (!data.value || countCheked(data.value) < +data.params)
  ) {
    result = { valid: false, error: `You should check at least ${data.params}` };
  }
  return result;
}

function max(data) {
  let result;
  if (!data.params) {
    console.warn('Invalid max validation');
    return result;
  }
  if (data.field.type === 'text' && data.value && data.value.length > +data.params) {
    result = { valid: false, error: `You can check ${data.params} maximum` };
  }
  if (
    data.field.type === 'checkboxGroup' &&
    (!data.value || countCheked(data.value) > +data.params)
  ) {
    result = { valid: false, error: `You can check ${data.params} maximum` };
  }
  return result;
}

function minLength(data) {
  let result;
  if (!data.params || (data.field.type !== 'text' && data.field.type !== 'textarea')) {
    console.warn('Invalid minLength validation');
    return result;
  }
  if (data.value && data.value.length < +data.params) {
    result = { valid: false, error: `Min length is ${data.params} characters` };
  }
  return result;
}

function maxLength(data) {
  let result;
  if (!data.params || (data.field.type !== 'text' && data.field.type !== 'textarea')) {
    console.warn('Invalid maxLength validation');
    return result;
  }
  if (data.value && data.value.length > +data.params) {
    result = { valid: false, error: `Max length is ${data.params} characters` };
  }
  return result;
}

function number(data) {
  let result;
  if (data.field.type !== 'text') {
    console.warn('Invalid number validation');
    return result;
  }
  if (data.value === null || isNaN(data.value)) {
    result = { valid: false, error: `The value is not a number` };
  }
  return result;
}

function url(data) {
  // console.log('url', data);
  let result;
  if (data.field.type !== 'text') {
    console.warn('Invalid url validation');
    return result;
  }
  if (data.value && !new RegExp(urlRegex).test(data.value)) {
    console.log('urlRegex', !new RegExp(urlRegex).test(data.value));
    result = { valid: false, error: `Invalid url` };
  }
  return result;
}

function email(data) {
  // console.log('email', data);
  let result;
  if (data.field.type !== 'text') {
    console.warn('Invalid email validation');
    return result;
  }
  if (data.value && !new RegExp(emailRegex).test(data.value)) {
    console.log('emailRegex', !new RegExp(emailRegex).test(data.value));
    result = { valid: false, error: `Invalid email` };
  }
  return result;
}

//####################################################################################//
//                                 Custom Validations                                 //
//####################################################################################//

function biggerThanDateFrom(data) {
  let result;
  const generalInformation = data.formData.formObject.generalInformation;
  if (
    generalInformation.dateFrom &&
    generalInformation.dateTo &&
    moment(generalInformation.dateFrom, 'MM/DD/YYYY') >
      moment(generalInformation.dateTo, 'MM/DD/YYYY')
  ) {
    result = { valid: false, error: 'Date should be bigger than "Date from"' };
  }
  return result;
}

function biggerThanHourFrom(data) {
  let result;
  const timeAllocationTable =
    data.formData.formObject.timeAllocationTable.timeAllocationTable[data.parentIndex];
  if (
    timeAllocationTable.hourFrom &&
    timeAllocationTable.hourTo &&
    moment(timeAllocationTable.hourFrom, 'HH:mm A') > moment(timeAllocationTable.hourTo, 'HH:mm A')
  ) {
    result = { valid: false, error: 'Hour should be bigger than "Hour from"' };
  }
  return result;
}

function biggerThanDepart(data) {
  let result;
  const generalInformation = data.formData.formObject.generalInformation;
  if (
    generalInformation.departFromMarchesini &&
    generalInformation.arriveToCustomer &&
    moment(generalInformation.departFromMarchesini, 'MM/DD/YYYY HH:mm A') >
      moment(generalInformation.arriveToCustomer, 'MM/DD/YYYY HH:mm A')
  ) {
    result = { valid: false, error: 'Should be later than "Depart"' };
  }
  return result;
}

function biggerThanEndDepart(data) {
  let result;
  const generalInformationEnd = data.formData.formObject.generalInformationEnd;
  const generalInformationEnd2 = data.formData.formObject.generalInformationEnd2;
  if (
    generalInformationEnd.departFromCustomer &&
    generalInformationEnd2.arriveToMarchesini &&
    moment(generalInformationEnd.departFromCustomer, 'MM/DD/YYYY HH:mm A') >
      moment(generalInformationEnd2.arriveToMarchesini, 'MM/DD/YYYY HH:mm A')
  ) {
    result = { valid: false, error: 'Should be later than "Depart"' };
  }
  return result;
}

export default validations;

// function biggerThanDateFrom(data) {
//   let result;
//   const generalInformation = data.formData.formObject.generalInformation;
//   if (
//     generalInformation.dateFrom &&
//     generalInformation.dateTo &&
//     moment(generalInformation.dateFrom, CONSTANTS.FORMATS.DATE) >
//       moment(generalInformation.dateTo, CONSTANTS.FORMATS.DATE)
//   ) {
//     result = { allValid: false, error: 'Date should be bigger than "Date from"' };
//   }
//   return result;
// }

// function biggerThanHourFrom(data) {
//   let result;
//   const timeAllocationTable =
//     data.formData.formObject.timeAllocationTable.timeAllocationTable[data.parentIndex];
//   if (
//     timeAllocationTable.hourFrom &&
//     timeAllocationTable.hourTo &&
//     moment(timeAllocationTable.hourFrom, CONSTANTS.FORMATS.TIME) >
//       moment(timeAllocationTable.hourTo, CONSTANTS.FORMATS.TIME)
//   ) {
//     result = { allValid: false, error: 'Hour should be bigger than "Hour from"' };
//   }
//   return result;
// }

// function biggerThanDepart(data) {
//   let result;
//   const generalInformation = data.formData.formObject.generalInformation;
//   if (
//     generalInformation.departFromMarchesini &&
//     generalInformation.arriveToCustomer &&
//     moment(generalInformation.departFromMarchesini, CONSTANTS.FORMATS.DATE_TIME) >
//       moment(generalInformation.arriveToCustomer, CONSTANTS.FORMATS.DATE_TIME)
//   ) {
//     result = { allValid: false, error: 'Should be later than "Depart"' };
//   }
//   return result;
// }

// function biggerThanEndDepart(data) {
//   let result;
//   const generalInformationEnd = data.formData.formObject.generalInformationEnd;
//   const generalInformationEnd2 = data.formData.formObject.generalInformationEnd2;
//   if (
//     generalInformationEnd.departFromCustomer &&
//     generalInformationEnd2.arriveToMarchesini &&
//     moment(generalInformationEnd.departFromCustomer, CONSTANTS.FORMATS.DATE_TIME) >
//       moment(generalInformationEnd2.arriveToMarchesini, CONSTANTS.FORMATS.DATE_TIME)
//   ) {
//     result = { allValid: false, error: 'Should be later than "Depart"' };
//   }
//   return result;
// }
