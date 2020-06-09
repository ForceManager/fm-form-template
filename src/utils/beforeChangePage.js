import config from '../configs/config.json';
import actions from '../configs/actions';
import setListObject from '../configs/setListObject';
import setDetailObject from '../configs/setDetailObject';

const actionsBeforeChangePage = (newStates, next) => {
  if (!next && actions.beforePrevPage) {
    return actions.beforePrevPage(newStates);
  } else if (next && actions.beforeNextPage) {
    return actions.beforeNextPage(newStates);
  } else {
    return Promise.resolve();
  }
};

const setReadOnlyOnState = (newStates, newFormStateId) => {
  return new Promise((resolve) => {
    if (newFormStateId) {
      newStates.formSchema = Object.keys(newStates.formSchema).map((key) => {
        const section = newStates.formSchema[key];
        if (section.readOnlyOnState && section.readOnlyOnState === newFormStateId) {
          const fields = section.fields.map((field) => {
            field.isReadOnly = true;
            return field;
          });
          section.fields = fields;
        }
        return section;
      });
    }
    resolve(newStates);
  });
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
  next,
}) => {
  return new Promise((resolve, reject) => {
    const newFormState =
      next && generalData.states.find((el) => el.setStateOnPage === currentPage + 1);
    const newFormStateId = newFormState ? newFormState.id : null;
    let newStates = {
      formData: {
        ...formData,
        idState: newFormStateId ? newFormStateId : formData.idState,
        currentPage: next ? currentPage + 1 : currentPage - 1,
      },
      generalData: { ...generalData },
      formSchema: [...formSchema],
      selectedForm,
      currentPage,
    };
    setReadOnlyOnState(newStates, newFormStateId)
      .then((res) => actionsBeforeChangePage(res, next))
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
            formSchema: res.formSchema || newStates.formSchema,
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
        setFormSchema([...newStates.formSchema]);
        resolve(newFormData);
      })
      .catch(reject);
  });
};

export default beforeChangePage;
