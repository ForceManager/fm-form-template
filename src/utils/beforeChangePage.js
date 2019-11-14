import config from '../configs/config.json';
import actions from '../configs/actions';
import setListObject from '../configs/setListObject';
import setDetailObject from '../configs/setDetailObject';

const actionsBeforeChangePage = (data) => {
  if (!actions.beforeChangePage) {
    return actions.beforeChangePage(data);
  } else {
    return Promise.resolve();
  }
};

const beforeChangePage = ({
  selectedForm,
  formSchema,
  formData,
  generalData,
  currentPage,
  setFormData,
  setGeneralData,
  setFormSchema,
}) => {
  const newFormState = generalData.states.find((el) => el.setStateOnPage === currentPage + 1);
  console.log('newFormState', newFormState);
  let newStates = {
    formData: {
      ...formData,
      idState: newFormState ? newFormState.id : formData.idState,
    },
    generalData: { ...generalData },
    formSchema: { ...formSchema },
    selectedForm,
    currentPage,
  };
  return actionsBeforeChangePage(newStates)
    .then((res) => {
      if (res) {
        newStates = {
          ...newStates,
          formData: {
            ...newStates.formData,
            ...res.formData,
          },
          generalData: {
            ...newStates.generalData,
            ...res.generalData,
          },
          formSchema: {
            ...newStates.formSchema,
            ...res.formSchema,
          },
        };
      }

      let listObject = JSON.parse(JSON.stringify(config.listObject));
      let detailObject = JSON.parse(JSON.stringify(config.detailObject));
      return Promise.all([
        setListObject({ ...newStates, listObject }),
        setDetailObject({ ...newStates, detailObject }),
      ]);
    })
    .then(([newListObject, newDetailObject]) => {
      setFormData({
        ...newStates.formData,
        listObject: newListObject,
        detailObject: newDetailObject,
      });
      setGeneralData({ ...newStates.generalData });
      setFormSchema({ ...newStates.formSchema });
    })
    .catch((err) => console.warn(err));
};

export default beforeChangePage;
