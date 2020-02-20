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
    let schemaPositions = [];
    let newFormSchema = JSON.parse(JSON.stringify(config.formSchema[selectedForm.value].schema));
    let newListObject = JSON.parse(JSON.stringify(config.listObject));
    let newDetailObject = JSON.parse(JSON.stringify(config.detailObject));

    const mapSections = (sections, currentPath) => {
      sections.forEach((section, sectionIndex) => {
        section.className = [section.className, 'form-page'];
        section.isExpandable = false;
        section.fields = mapFields(section.fields, currentPath[sectionIndex].fields);
      });
    };
    const mapFields = (fields, currentPath) => {
      const newFields = [];
      fields
        .filter((field) => field.isVisible !== false)
        .forEach((field, fieldIndex) => {
          if (!field.attrs) field.attrs = {};
          field.attrs['className'] = `field-${field.type}`;
          switch (field.type) {
            case 'multiplier':
              mapSections(field.schema, currentPath[fieldIndex].schema);
              break;
            case 'select':
              // field.isSearchable = false;
              field.isFullWidth = true;
              if (field.attrs && field.attrs.table && field.attrs.table !== '') {
                schemaPromises.push(
                  bridge
                    .getValueList(field.attrs.table)
                    .then((res) => {
                      field.attrs.options = [...field.attrs.options, ...res];
                    })
                    .catch((err) => {
                      reject(err);
                    }),
                );
                schemaPositions.push(currentPath[fieldIndex].attrs.options);
              } else if (
                field.attrs &&
                field.attrs.relatedEntity &&
                field.attrs.relatedEntity !== ''
              ) {
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
                    .getRelatedEntity(
                      field.attrs.relatedEntity[0],
                      field.attrs.relatedEntity[1],
                      id,
                    )
                    .then((res) => {
                      if (
                        field.attrs.relatedEntity[3] &&
                        actions.formatEntityList &&
                        actions.formatEntityList[field.attrs.relatedEntity[3]]
                      ) {
                        field.attrs.options = [
                          ...field.attrs.options,
                          ...actions.formatEntityList[field.attrs.relatedEntity[3]](res),
                        ];
                      } else {
                        field.attrs.options = [
                          ...field.attrs.options,
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
                schemaPositions.push(currentPath[fieldIndex].attrs.options);
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
      mapSections(newFormSchema, newFormSchema);

      Promise.all(schemaPromises)
        .then((res) => {
          res.forEach((el, i) => {
            schemaPositions[i] = el;
          });
          return getDefaultValues(selectedForm, formData, generalData);
        })
        .then((res) => {
          defaultValues = res;
          return setListObject({
            selectedForm,
            formData,
            generalData,
            listObject: newListObject,
          });
        })
        .then((res) => {
          newListObject = { ...newListObject, ...res };
          return setDetailObject({
            selectedForm,
            formData,
            generalData,
            detailObject: newDetailObject,
          });
        })
        .then((res) => {
          newDetailObject = { ...newDetailObject, ...res };
          const newFormData = {
            ...formData,
            formObject: {
              ...formData.formObject,
              ...defaultValues,
            },
            listObject: newListObject,
            detailObject: newDetailObject,
            idFormSubtype: selectedForm.value,
          };
          resolve({ formSchema: newFormSchema, formData: newFormData });
        })
        .catch((err) => {
          reject(err);
        });
    } else if (generalData.mode === 'edition' && !formData.endState) {
      mapSections(newFormSchema, newFormSchema, false);

      Promise.all(schemaPromises)
        .then((res) => {
          res.forEach((el, i) => {
            schemaPositions[i] = el;
          });
          resolve({ formSchema: newFormSchema });
        })
        .catch((err) => {
          reject(err);
        });
    } else if (generalData.mode === 'edition' && formData.endState) {
      resolve({ formSchema: [...config.formSchema[selectedForm.value].schema] });
    }
  });
};

export default generateForm;
