const setDetailObject = ({ selectedForm, formData, generalData, currentPage, detailObject }) => {
  return new Promise((resolve, reject) => {
    const newDetailObject = { ...detailObject };
    newDetailObject.detailValues.forEach((element) => {
      switch (element.value) {
        case 'selectedForm':
          element.value = selectedForm.label;
          break;
        case 'state':
          element.value = generalData.states[formData.idState].name;
          break;
        case 'creationDate':
          element.value = formData.formObject.fechaCreacion;
          break;
        // CUSTOM SETTERS
        default:
      }
    });
    resolve(newDetailObject);
  });
};

export default setDetailObject;
