import moment from 'moment';
import CONSTANTS from '../constants';

const customActions = {
  onChange: {
    standardService: {
      generalInformation: {
        contact: setContact,
        // dateFrom: setDateToMin,
      },
      signatures: {
        customerSignature: setDateCustomerSignature,
        serviceEngineerSignature: setDateServiceEngineerSignature,
      },
    },
    newMachine: {
      generalInformation: {
        contact: setContact,
        // dateFrom: setDateToMin,
      },
      signatures: {
        customerSignature: setDateCustomerSignature,
        serviceEngineerSignature: setDateServiceEngineerSignature,
      },
    },
  },
  onChangePage,
};

function setContact(data) {
  return new Promise((resolve) => {
    let newState = {
      ...data.state,
      formData: {
        ...data.state.formData,
        formObject: {
          ...data.state.formData.formObject,
          workPerformed: {
            ...data.state.formData.formObject.workPerformed,
            contact: data.values[data.field.name],
          },
        },
      },
    };
    resolve(newState);
  });
}

// function setDateToMin(data) {
//   return new Promise((resolve) => {
//     let fields = data.state.formSchema[data.currentPage].fields.map((el) => {
//       if (el.name === 'dateTo') {
//         el['attrs']['minDate'] = data.values[data.field.name];
//       }
//       return el;
//     });
//     let newState = {
//       ...data.state,
//       formSchema: {
//         ...data.state.formSchema,
//         [data.currentPage]: {
//           ...data.state.formSchema[data.currentPage],
//           fields,
//         },
//       },
//     };
//     resolve(newState);
//   });
// }

function setDateCustomerSignature(data) {
  return new Promise((resolve) => {
    let newState = {
      ...data.state,
      formData: {
        ...data.state.formData,
        formObject: {
          ...data.state.formData.formObject,
          signatures: {
            ...data.state.formData.formObject.signatures,
            dateCustomerSignature: moment().format('DD/MM/YYYY'),
          },
        },
      },
    };
    resolve(newState);
  });
}

function setDateServiceEngineerSignature(data) {
  return new Promise((resolve) => {
    let newState = {
      ...data.state,
      formData: {
        ...data.state.formData,
        formObject: {
          ...data.state.formData.formObject,
          signatures: {
            ...data.state.formData.formObject.signatures,
            dateServiceEngineerSignature: moment().format('DD/MM/YYYY'),
          },
        },
      },
    };
    resolve(newState);
  });
}

function onChangePage(data) {
  return new Promise((resolve) => {
    if (data.currentPage === 5) {
      let detailValues = [...data.state.formData.detailObject.detailValues];
      detailValues[3].value = CONSTANTS.LITERALS.STATE[CONSTANTS.STATE.SIGNED]['en'];
      let newState = {
        ...data.state,
        formData: {
          ...data.state.formData,
          listObject: {
            ...data.state.formData.listObject,
            pos21: CONSTANTS.LITERALS.STATE[CONSTANTS.STATE.SIGNED]['en'],
          },
          detailObject: {
            ...data.state.formData.detailObject,
            detailValues,
          },
          idState: CONSTANTS.STATE.SIGNED,
        },
      };
      resolve(newState);
    } else {
      resolve();
    }
  });
}

export default customActions;
