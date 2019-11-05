import { bridge } from 'fm-bridge';
import config from '../configs/config.json';
import getDefaultValues from '../configs/defaultValues';
import CONSTANTS from '../constants';
import formatEntityList from './formatEntityList';

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
                      field.attrs.options = res;
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
                const id =
                  field.attrs.relatedEntity[1] === 'accounts' &&
                  field.attrs.relatedEntity[2] === 'this'
                    ? generalData.account.id
                    : field.attrs.relatedEntity[2];
                schemaPromises.push(
                  bridge
                    .getRelatedEntity(
                      field.attrs.relatedEntity[0],
                      field.attrs.relatedEntity[1],
                      id,
                    )
                    .then((res) => {
                      field.attrs.options = [
                        ...field.attrs.options,
                        ...formatEntityList(field.attrs.relatedEntity[0], res),
                      ];
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

    function setListObject() {
      return new Promise((resolve, reject) => {
        Object.keys(newListObject).forEach((key) => {
          switch (newListObject[key]) {
            case 'selectedForm':
              newListObject[key] = selectedForm.label;
              break;
            case 'state':
              newListObject[key] = CONSTANTS.LITERALS.STATE[formData.idState]['en'];
              break;
            case 'creationDate':
              newListObject[key] = formData.formObject.fechaCreacion;
              break;
            default:
          }
        });
        resolve();
      });
    }

    function setDetailObject() {
      return new Promise((resolve, reject) => {
        newDetailObject.detailValues.forEach((element) => {
          switch (element.value) {
            case 'selectedForm':
              element.value = selectedForm.label;
              break;
            case 'state':
              element.value = CONSTANTS.LITERALS.STATE[formData.idState]['en'];
              break;
            case 'creationDate':
              element.value = formData.formObject.fechaCreacion;
              break;
            default:
          }
        });
        resolve();
      });
    }

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
          return setListObject();
        })
        .then(() => setDetailObject())
        .then(() => {
          const newFormData = {
            ...formData,
            formObject: {
              ...formData.formObject,
              ...defaultValues,
            },
            listObject: newListObject,
            detailObject: newDetailObject,
            idFormType: config.formSchema[selectedForm.value].id,
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
