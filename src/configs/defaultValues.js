function getDefaultValues(selectedForm, formData, generalData) {
  return new Promise((resolve, reject) => {
    // // WITH PROMISES
    // const getAccountName = Promise.resolve({
    //   label: state.company.nombre,
    //   value: state.company.id,
    // });
    // const getUserName = Promise.resolve({ label: state.user.name, value: state.user.userId });

    // const allForms = () => {
    //   Promise.all([getAccountName, getUserName])
    //     .then((res) => {
    //       const accountName = res[0];
    //       const userName = res[1];

    //       const defaultValues = {
    //         generalInformation: {
    //           customer: accountName,
    //           serviceEngineer: userName,
    //         },
    //         workPerformed: {
    //           customer: accountName,
    //         },
    //       };
    //       resolve(defaultValues);
    //     })
    //     .catch((err) => reject(err));
    // };

    // const fomDefaultValues = {
    //   standardService: allForms,
    //   newMachine: allForms,
    // };

    // fomDefaultValues[selectedForm]();

    // WITHOUT PROMISES
    // const defaultValues = {
    //   generalInformation: {
    //     customer: {
    //       label: generalData.account.name,
    //       value: generalData.account.id,
    //     },
    //     serviceEngineer: { label: generalData.user.name, value: generalData.user.id },
    //   },
    //   workPerformed: {
    //     customer: {
    //       label: generalData.account.name,
    //       value: generalData.account.id,
    //     },
    //   },
    // };
    // resolve(defaultValues);
    resolve();
  });
}

export default getDefaultValues;
