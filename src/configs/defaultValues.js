function getDefaultValues(selectedForm, formData, generalData) {
  return new Promise((resolve, reject) => {
    const defaultValues = {
      form1: {
        page1: {
          someText: 'Lorem ipsum',
        },
      },
    };
    resolve(defaultValues[selectedForm.value]);
  });
}

export default getDefaultValues;
