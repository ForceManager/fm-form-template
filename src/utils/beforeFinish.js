import config from '../configs/config.json';
import actions from '../configs/actions';
import setListObject from '../configs/setListObject';
import setDetailObject from '../configs/setDetailObject';

const actionsBeforeFinish = (data) => {
  if (!actions.beforeChangePage) {
    return actions.beforeFinish(data);
  } else {
    return Promise.resolve();
  }
};

const beforeFinish = ({
  selectedForm,
  formSchema,
  formData,
  generalData,
  currentPage,
  setFormData,
  setGeneralData,
  setFormSchema,
}) => {
  let newStates = {
    formData: { ...formData },
    generalData: { ...generalData },
    formSchema: { ...formSchema },
    selectedForm,
    currentPage,
  };
  return actionsBeforeFinish(newStates)
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
        listObject: {
          ...newStates.formData.listObject,
          ...newListObject,
        },
        detailObject: {
          ...newStates.formData.detailObject,
          ...newDetailObject,
        },
      });
      setGeneralData({ ...newStates.generalData });
      setFormSchema({ ...newStates.formSchema });
    })
    .catch((err) => console.warn(err));
};

export default beforeFinish;
