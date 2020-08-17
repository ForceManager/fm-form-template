import config from '../configs/config.json';
import actions from '../configs/actions';
import setListObject from '../configs/setListObject';
import setDetailObject from '../configs/setDetailObject';

const actionsBeforeFinish = (data) => {
  if (!actions.beforeFinish) {
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
  return new Promise((resolve, reject) => {
    const finalState = generalData.states.find((state) => state.setOnPage === -1);
    let newStates = {
      formData: {
        ...formData,
        idState: finalState ? finalState.id : formData.idState,
        endState: finalState?.endState ? 1 : 0,
      },
      generalData: { ...generalData },
      formSchema: { ...formSchema },
      selectedForm,
      currentPage,
    };
    actionsBeforeFinish(newStates)
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
        const newFormData = {
          ...newStates.formData,
          listObject: newListObject,
          detailObject: newDetailObject,
        };
        setFormData(newFormData);
        setGeneralData({ ...newStates.generalData });
        setFormSchema({ ...newStates.formSchema });
        resolve(newFormData);
      })
      .catch(reject);
  });
};

export default beforeFinish;
