function getDefaultValue(state, defaultValue) {
  return new Promise((resolve) => {
    const defaultValues = {
      accountName: state.company.nombre,
      userName: state.user.name,
    };
    resolve(defaultValues[defaultValue]);
  });
}

export default getDefaultValue;
