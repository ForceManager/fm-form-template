const setListObject = ({ selectedForm, formData, generalData, currentPage, listObject }) => {
  return new Promise((resolve, reject) => {
    const newListObject = { ...listObject };
    Object.keys(listObject).forEach((key) => {
      switch (listObject[key]) {
        case 'selectedForm':
          newListObject[key] = selectedForm.label;
          break;
        case 'state':
          newListObject[key] = generalData.states[formData.idState].name;
          break;
        case 'creationDate':
          newListObject[key] = formData.formObject.fechaCreacion;
          break;
        // CUSTOM SETTERS
        default:
      }
    });
    resolve(newListObject);
  });
};

export default setListObject;
