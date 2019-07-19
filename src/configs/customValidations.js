import moment from 'moment';

const customValidations = {
  onFinish,
  biggerThanDateFrom,
  biggerThanHourFrom,
};

function onFinish(data) {
  return new Promise((resolve, reject) => {
    resolve();
    // reject({ type: 'validationError', msg: 'validationError'});
  });
}

function biggerThanDateFrom(data) {
  let result;
  const generalInformation = data.formData.formObject.generalInformation;
  if (
    generalInformation.dateFrom &&
    generalInformation.dateTo &&
    moment(generalInformation.dateFrom, 'MM/DD/YYYY') >
      moment(generalInformation.dateTo, 'MM/DD/YYYY')
  ) {
    result = { allValid: false, error: 'Date should be bigger than "Date from"' };
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
    result = { allValid: false, error: 'Hour should be bigger than "Hour from"' };
  }
  return result;
}

export default customValidations;
