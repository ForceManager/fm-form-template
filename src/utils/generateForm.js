import { bridge } from 'fm-bridge';
import config from '../configs/config.json';
import getDefaultValues from '../configs/defaultValues';
import formatEntityList from './formatEntityList';
import setListObject from '../configs/setListObject';
import setDetailObject from '../configs/setDetailObject';
import actions from '../configs/actions';

const generateForm = (selectedForm, formData, generalData) => {
  return new Promise((resolve, reject) => {
    let defaultValues;
    let schemaPromises = [];
    let newFormSchema = JSON.parse(JSON.stringify(config.formSchema[selectedForm.value].schema));
    let newListObject = JSON.parse(JSON.stringify(config.listObject));
    let newDetailObject = JSON.parse(JSON.stringify(config.detailObject));
    let finishButtonLabel = JSON.parse(
      JSON.stringify(config.formSchema[selectedForm.value].finishButtonLabel),
    );
    let states = JSON.parse(JSON.stringify(config.formSchema[selectedForm.value].states)).map(
      (state) => ({
        ...state,
        name: generalData.statesList.find((el) => state.id === el.id).name,
      }),
    );
    const newGeneralData = { ...generalData, states, finishButtonLabel };

    const mapSections = (sections, currentPath) => {
      sections.forEach((section, sectionIndex) => {
        section.className = [section.className, 'form-page'];
        section.isExpandable = false;
        section.fields = mapFields(section.fields, currentPath[sectionIndex].fields);
      });
    };
    const mapFields = (fields, currentPath) => {
      const newFields = [];
      fields.forEach((field, fieldIndex) => {
        if (!field.attrs) field.attrs = {};
        field.attrs['className'] = `field-${field.type}`;
        switch (field.type) {
          case 'multiplier':
            mapSections(field.schema, currentPath[fieldIndex].schema);
            break;
          case 'select':
            field.isFullWidth = true;
            if (field.attrs.table && field.attrs.table !== '') {
              schemaPromises.push(
                bridge
                  .getValueList(field.attrs.table)
                  .then((res) => {
                    const options = field.attrs.options ? field.attrs.options : [];
                    if (field.attrs.table && actions.formtValuelist?.[field.attrs.table]) {
                      field.attrs.options = [
                        ...options,
                        ...actions.formtValuelist[field.attrs.table]({
                          list: res,
                          selectedForm,
                          formData,
                          generalData,
                        }),
                      ];
                    } else {
                      field.attrs.options = [...options, ...res];
                    }
                  })
                  .catch(reject),
              );
            } else if (field.attrs.relatedEntity && field.attrs.relatedEntity !== '') {
              let id;
              if (!field.attrs.relatedEntity[2]) {
                id = -1;
              } else if (
                field.attrs.relatedEntity[2] === 'this' &&
                ((!field.attrs.relatedEntity[1] && field.attrs.relatedEntity[0] === 'accounts') ||
                  field.attrs.relatedEntity[1] === 'accountId')
              ) {
                id = generalData.account.id;
              } else if (
                field.attrs.relatedEntity[2] === 'this' &&
                !field.attrs.relatedEntity[1] &&
                field.attrs.relatedEntity[0] === 'users'
              ) {
                id = generalData.user.id;
              } else {
                id = field.attrs.relatedEntity[2];
              }

              schemaPromises.push(
                bridge
                  .getRelatedEntity(field.attrs.relatedEntity[0], field.attrs.relatedEntity[1], id)
                  .then((res) => {
                    const options = field.attrs.options ? field.attrs.options : [];
                    if (
                      field.attrs.relatedEntity[3] &&
                      actions.formatEntityList?.[field.attrs.relatedEntity[3]]
                    ) {
                      field.attrs.options = [
                        ...options,
                        ...actions.formatEntityList[field.attrs.relatedEntity[3]]({
                          entity: field.attrs.relatedEntity[0],
                          list: res,
                          selectedForm,
                          formData,
                          generalData,
                        }),
                      ];
                    } else {
                      field.attrs.options = [
                        ...options,
                        ...formatEntityList(field.attrs.relatedEntity[0], res),
                      ];
                    }
                  })
                  .catch((err) => {
                    reject({
                      error: err,
                      toast: {
                        type: 'error',
                        text: 'Get value list failed',
                        title: 'Error',
                      },
                    });
                  }),
              );
            }
            break;
          case 'checkboxGroup':
          case 'text':
          case 'datePicker':
          case 'dateTimePicker':
          case 'dateTime':
          default:
        }
        newFields.push(field);
      });
      return newFields;
    };

    if (generalData.mode === 'creation') {
      const initialState = states.find((state) => state.setOnPage === 0);
      let newFormData = {
        ...formData,
        idState: initialState.id || states[0].id,
        endState: initialState.endState || states[0].endState,
      };

      mapSections(newFormSchema, newFormSchema);

      Promise.all(schemaPromises)
        .then((res) => getDefaultValues(selectedForm, formData, newGeneralData))
        .then((res) => {
          defaultValues = res;
          return setListObject({
            selectedForm,
            formData: newFormData,
            generalData: newGeneralData,
            listObject: newListObject,
          });
        })
        .then((res) => {
          newListObject = { ...newListObject, ...res };
          return setDetailObject({
            selectedForm,
            formData: newFormData,
            generalData: newGeneralData,
            detailObject: newDetailObject,
          });
        })
        .then((res) => {
          newDetailObject = { ...newDetailObject, ...res };
          newFormData = {
            ...newFormData,
            formObject: {
              ...formData.formObject,
              ...defaultValues,
            },
            listObject: newListObject,
            detailObject: newDetailObject,
            idFormSubtype: selectedForm.value,
          };
          resolve({
            formSchema: newFormSchema,
            formData: newFormData,
            generalData: newGeneralData,
          });
        })
        .catch(reject);
    } else if (generalData.mode === 'edition' && !formData.endState) {
      mapSections(newFormSchema, newFormSchema, false);

      Promise.all(schemaPromises)
        .then((res) => {
          resolve({ formSchema: newFormSchema, formData, generalData: newGeneralData });
        })
        .catch(reject);
    } else if (generalData.mode === 'edition' && formData.endState) {
      resolve({
        formSchema: [...config.formSchema[selectedForm.value].schema],
        formData,
        generalData: newGeneralData,
      });
    }
  });
};

export default generateForm;
