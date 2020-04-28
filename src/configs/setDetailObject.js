const setDetailObject = ({ selectedForm, formData, generalData, currentPage, detailObject }) => {
  return new Promise((resolve, reject) => {
    const detailValues = detailObject.detailValues
      .map((el) => {
        let value = '';
        switch (el.value) {
          case 'selectedForm':
            value = selectedForm.label;
            break;
          case 'state':
            value = generalData.states[formData.idState].name;
            break;
          case 'creationDate':
            value = formData.formObject.fechaCreacion;
            break;
          // CUSTOM SETTERS
          default:
        }
        return { ...el, value };
      })
      .filter((el) => el.type === 'title' || el.value !== '');
    resolve({ ...detailObject, detailValues });
  });
};

export default setDetailObject;
