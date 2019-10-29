import moment from 'moment';

const date = '/^(0[1-9]|1[0-2])/(0[1-9]|1d|2d|3[01])/(19|20)d{2}$/';
const url = 'https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)';
const word = '[A-Za-z]+';
const number = '/^[0-9]';
const decimalNumber = '/^[0-9]+,?[0-9]*$/';
const email =
  '1/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/';
const nif = '/^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i';
const nie = '/^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i';

const validations = {
  required,
  date,
  url,
  word,
  number,
  decimalNumber,
  onFinish,
  email,
  nif,
  nie,
  maxNumber,
  minNumber,
  maxLength,
  minLength,
  biggerThanDateFrom,
  biggerThanHourFrom,
  biggerThanDepart,
  biggerThanEndDepart,
};

function required(data) {
  let result;
  if (!data.value) {
    result = { valid: false, error: 'This field is requiered' };
  }
  return result;
}

function onFinish(data) {
  return new Promise((resolve, reject) => {
    resolve();
    // reject({ type: 'validationError', msg: 'validationError'});
  });
}

function maxNumber(data) {}

function minNumber(data) {}

function maxLength(data) {}

function minLength(data) {}

// function validate(value, validation) {
//   if (!value.test(validation)) {
//     return;
//   }
// }

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
