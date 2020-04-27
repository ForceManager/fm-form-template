const actions = {
  onChange: {},
  onFormReady,
  beforeChangePage,
  beforeFinish,
  formatEntityList: {},
  formtValuelist: {},
};

function onFormReady(data) {
  return new Promise((resolve) => {
    resolve();
  });
}

function beforeChangePage(data) {
  return new Promise((resolve) => {
    resolve();
  });
}

function beforeFinish(data) {
  return new Promise((resolve) => {
    resolve();
  });
}

export default actions;
