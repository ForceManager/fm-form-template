import moment from 'moment';

const validations = {
  required,
  smallerThanHourToM,
  biggerThanHourFromM,
  smallerThanHourToT,
  biggerThanHourFromT,
};

function required(data) {
  let result;
  if (!data.value) {
    result = { valid: false, error: 'This field is requiered' };
  }
  return result;
}

function smallerThanHourToM(data) {
  let result;
  const timeAllocationTable =
    data.formData.formObject.timeAllocationTable.timeAllocationTable[data.parentIndex];
  if (
    timeAllocationTable.hourFromM &&
    timeAllocationTable.hourToM &&
    moment(timeAllocationTable.hourFromM, 'HH:mm A') >
      moment(timeAllocationTable.hourToM, 'HH:mm A')
  ) {
    result = { valid: false, error: 'Hour should be smaller than "Hour to"' };
  }
  return result;
}

function biggerThanHourFromM(data) {
  let result;
  const timeAllocationTable =
    data.formData.formObject.timeAllocationTable.timeAllocationTable[data.parentIndex];
  if (
    timeAllocationTable.hourFromM &&
    timeAllocationTable.hourToM &&
    moment(timeAllocationTable.hourToM, 'HH:mm A') <
      moment(timeAllocationTable.hourFromM, 'HH:mm A')
  ) {
    result = { valid: false, error: 'Hour should be bigger than "Hour from"' };
  }
  return result;
}

function smallerThanHourToT(data) {
  let result;
  const timeAllocationTable =
    data.formData.formObject.timeAllocationTable.timeAllocationTable[data.parentIndex];
  if (
    timeAllocationTable.hourFromT &&
    timeAllocationTable.hourToT &&
    moment(timeAllocationTable.hourFromT, 'HH:mm A') >
      moment(timeAllocationTable.hourToT, 'HH:mm A')
  ) {
    result = { valid: false, error: 'Hour should be smaller than "Hour to"' };
  }
  return result;
}

function biggerThanHourFromT(data) {
  let result;
  const timeAllocationTable =
    data.formData.formObject.timeAllocationTable.timeAllocationTable[data.parentIndex];
  if (
    timeAllocationTable.hourFromT &&
    timeAllocationTable.hourToT &&
    moment(timeAllocationTable.hourToT, 'HH:mm A') <
      moment(timeAllocationTable.hourFromT, 'HH:mm A')
  ) {
    result = { valid: false, error: 'Hour should be bigger than "Hour from"' };
  }
  return result;
}

export default validations;
