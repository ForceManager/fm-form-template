function getCustomAction(state, customAction) {
  return new Promise((resolve) => {
    let newState = {};
    const customActions = {
      onChangeCustomer: function() {
        console.log('onChangeCustomer');
      },
    };
    resolve(customActions);
  });
}

export default getCustomAction;
