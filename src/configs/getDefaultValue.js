function getDefaultValue(state, defaultValue) {
  return new Promise((resolve) => {
    const defaultValues = {
      accountName: { label: state.company.nombre, value: state.company.id },
      userName: { label: state.user.name, value: state.user.id },
    };
    resolve(defaultValues[defaultValue]);
  });
}

export default getDefaultValue;
