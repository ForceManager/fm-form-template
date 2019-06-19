const customValidations = {
  onFinish,
};

function onFinish(data) {
  return new Promise((resolve, reject) => {
    resolve();
    // reject({ type: 'validationError', msg: 'validationError'});
  });
}

export default customValidations;
