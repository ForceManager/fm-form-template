import moment from 'moment';

const customActions = {
  standardService: {
    generalInformation: {
      contact: {
        onChange: setContact,
      },
    },
    signatures: {
      customerSignature: {
        onChange: setDateCustomerSignature,
      },
      serviceEngineerSignature: {
        onChange: setDateServiceEngineerSignature,
      },
    },
  },
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

export default customActions;
