import moment from 'moment';
// import CONSTANTS from '../constants';
// import config from '../configs/config.json';

const actions = {
  onChange: {
    horarios: {
      timeAllocationTable: {
        timeAllocationTable: onChangeMultiplier,
      },
      signatures: {
        customerSignature: setDateCustomerSignature,
        serviceEngineerSignature: setDateServiceEngineerSignature,
      },
    },
  },
  onFormReady,
  beforeChangePage,
  beforeFinish,
  formatEntityList: {
    formatUsers,
  },
};

function onChangeMultiplier(data) {
  console.log('onChangeMultiplier', data);
  let formSchema = { ...data.formSchema };
  const usedValues = data.values.timeAllocationTable.map(
    (value) => value && value.day && value.day.value,
  );
  const filteredOptions = data.formSchema[1].fields[0].schema[0].fields[0].attrs.options.reduce(
    (obj, option) => {
      let newOption = { ...option };
      newOption.isDisabled = usedValues.includes(newOption.value);
      obj.push(newOption);
      return obj;
    },
    [],
  );
  formSchema[1].fields[0].schema[0].fields[0].attrs.options = filteredOptions;
  return Promise.resolve({ formSchema });
}

function setDateCustomerSignature(data) {
  return new Promise((resolve) => {
    let formData = {
      ...data.formData,
      formObject: {
        ...data.formData.formObject,
        signatures: {
          ...data.formData.formObject.signatures,
          dateCustomerSignature: moment().format('DD/MM/YYYY'),
        },
      },
    };
    resolve({ formData });
  });
}

function setDateServiceEngineerSignature(data) {
  return new Promise((resolve) => {
    let formData = {
      ...data.formData,
      formObject: {
        ...data.formData.formObject,
        signatures: {
          ...data.formData.formObject.signatures,
          dateServiceEngineerSignature: moment().format('DD/MM/YYYY'),
        },
      },
    };
    resolve({ formData });
  });
}

function onFormReady(data) {
  return new Promise((resolve) => {
    let formSchema = { ...data.formSchema };
    const filteredOptions = data.formSchema[0].fields[0].schema[0].fields[0].attrs.options.reduce(
      (obj, option) => {
        let newOption = { ...option };
        newOption.isDisabled = [6, 7].includes(newOption.value);
        obj.push(newOption);
        return obj;
      },
      [],
    );
    formSchema[0].fields[0].schema[0].fields[0].attrs.options = filteredOptions;
    resolve({ formSchema });
  });
}

function beforeChangePage(data) {
  return new Promise((resolve) => {
    resolve();
  });
}

function beforeFinish(data) {
  return new Promise((resolve) => {
    resolve();
  });
}

function formatUsers(data) {
  console.log('formatUsers', data);
  return data.map((el) => {
    return {
      value: el.id,
      label: el.id,
    };
  });
}

export default actions;
