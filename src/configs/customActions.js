import moment from 'moment';
import CONSTANTS from '../constants';

const customActions = {
  onChange: {
    standardService: {
      generalInformation: {
        contact: setContact,
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
    if (data.currentPage === 4) {
      console.log('nextPage', data);
      let newState = {
        ...data.state,
        formData: {
          ...data.state.formData,
          listObject: {
            ...data.state.formData.listObject,
            pos21: CONSTANTS.LITERALS.SIGNED['en'],
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
