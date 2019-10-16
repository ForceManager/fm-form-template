import moment from 'moment';
import CONSTANTS from '../constants';
import config from '../configs/config.json';

const actions = {
  onChange: {
    standardService: {
      generalInformation: {
        contact: onChangeContact,
        // dateFrom: setDateToMin,
      },
      signatures: {
        customerSignature: setDateCustomerSignature,
        serviceEngineerSignature: setDateServiceEngineerSignature,
      },
    },
    newMachine: {
      generalInformation: {
        contact: onChangeContact,
        // dateFrom: setDateToMin,
      },
      signatures: {
        customerSignature: setDateCustomerSignature,
        serviceEngineerSignature: setDateServiceEngineerSignature,
      },
    },
  },
  beforeChangePage,
};

function onChangeContact(data) {
  return new Promise((resolve) => {
    let formSchema = data.formSchema;
    let generalInformation = formSchema[0].fields;
    if (
      data.formData.formObject.generalInformation.contact &&
      data.formData.formObject.generalInformation.contact.value === 'other'
    ) {
      let otherContactName = {
        ...config.formSchema[data.selectedForm.value].schema[0].fields[2],
      };
      let otherContactEmail = {
        ...config.formSchema[data.selectedForm.value].schema[0].fields[3],
      };
      generalInformation.splice(2, 0, otherContactName, otherContactEmail);
    } else {
      if (generalInformation[2].name === 'otherContactName') {
        generalInformation.splice(2, 2);
      }
    }
    resolve({ formSchema });
  });
}

// function setDateToMin(data) {
//   return new Promise((resolve) => {
//     let fields = data.formSchema[data.currentPage].fields.map((el) => {
//       if (el.name === 'dateTo') {
//         el['attrs']['minDate'] = data.values[data.field.name];
//       }
//       return el;
//     });
//     let formSchema = {
//       ...data.formSchema,
//       [data.currentPage]: {
//         ...data.formSchema[data.currentPage],
//         fields,
//       },
//     };
//     resolve({ formSchema });
//   });
// }

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

function beforeChangePage(data) {
  return new Promise((resolve) => {
    if (data.currentPage === 4) {
      const detailValues = [...data.formData.detailObject.detailValues];
      detailValues[3].value = CONSTANTS.LITERALS.STATE[CONSTANTS.STATE.SIGNED]['en'];
      const formData = {
        ...data.formData,
        listObject: {
          ...data.formData.listObject,
          pos21: CONSTANTS.LITERALS.STATE[CONSTANTS.STATE.SIGNED]['en'],
        },
        detailObject: {
          ...data.formData.detailObject,
          detailValues,
        },
        idState: CONSTANTS.STATE.SIGNED,
      };
      resolve({ formData });
    } else {
      resolve();
    }
  });
}

export default actions;
