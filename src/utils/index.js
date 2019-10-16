import moment from 'moment';
import { bridge } from 'fm-bridge';
import config from '../configs/config.json';
import getDefaultValues from '../configs/defaultValues';
import CONSTANTS from '../constants';
import customValidations from '../configs/customValidations';

const utils = {
  formatEntityList: function(entity, data) {
    return data.map((el) => {
      switch (entity) {
        case 'contacts':
          return {
            value: el.id,
            label: `${el.firstName || el.nombre} ${el.lastName || el.apellidos}`,
          };
        default:
          return el;
      }
    });
  },
  formatInitData: function(data, states) {
    let initData;
    if (data.mode === 'creation') {
      bridge.setTitle('Form creation');
      initData = {
        formData: {
          formObject: {
            fechaCreacion: moment().format('MM/DD/YYYY hh:mm A'),
            userCreacion: data.user.id,
          },
          idFormType: null,
          idState: CONSTANTS.STATE.DRAFT,
          endState: 0,
        },
        generalData: {
          account: data.account,
          user: data.user,
          entityForm: data.entityForm,
          mode: data.mode,
          isReadonly: data.isReadonly || false,
          idPreSelectedFormType: data.idPreSelectedFormType,
          entityFormExtraFields: data.entityFormExtraFields,
          imei: data.imei,
          states,
        },
      };
    } else if (data.mode === 'edition') {
      bridge.setTitle('Form edition');
      let selectedFormValue = Object.keys(config.formSchema).find(
        (key) => data.idFormType === config.formSchema[key].id,
      );
      let selectedForm = {
        label: config.formSchema[selectedFormValue].title,
        value: selectedFormValue,
      };
      initData = {
        formData: {
          formObject: data.entityForm.fullObject.formObject,
          idFormType: data.idFormType,
          idState: data.entityForm.idState,
          endState: data.entityForm.fullObject.endState,
          listObject: data.entityForm.fullObject.listObject,
          detailObject: data.entityForm.fullObject.detailObject,
        },
        generalData: {
          account: data.account,
          user: data.user,
          entityForm: data.entityForm,
          mode: data.mode,
          isReadonly: data.isReadonly || false,
          selectedForm,
          states,
        },
      };
    }
    return initData;
  },
  generateForm: function(selectedForm, formData, generalData) {
    console.log('generateForm');
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
        fields.forEach((field, fieldIndex) => {
          // if (!field.isFullWidth) field.isFullWidth = true;
          // if (field.type !== 'checkbox' && !field.labelMode) field.labelMode = 'vertical';
          if (field.isVisible !== false) {
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
                          ...utils.formatEntityList(field.attrs.relatedEntity[0], res),
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
          }
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
  },
  validateFields: function(fields, values, formData, schema, currentPage) {
    let errors = {};
    let allValid = true;
    let parentIndex;
    fields.forEach((element) => {
      if (element.type === 'multiplier') {
        if (!errors[element.name]) errors[element.name] = [];
        if (!values) {
          errors[element.name] = element.schema[0].fields.map((field) =>
            utils.validateFields(element.schema[0].fields, values),
          );
        } else {
          const multiplierValues = values[element.name] ? values[element.name] : [];
          errors[element.name] = multiplierValues.map((values, index) => {
            parentIndex = index;
            return utils.validateFields(element.schema[0].fields, values);
          });
        }
      } else {
        if (element.isRequired && (!values || !values[element.name])) {
          allValid = false;
          errors[element.name] = 'This field is requiered';
        }
        if (element.validation) {
          function allFalse(obj) {
            for (var i in obj) {
              if (obj[i] === true) return false;
            }
            return true;
          }
          switch (element.validation) {
            case 'oneOfAll':
              if (
                !values ||
                !values[element.name] ||
                (values[element.name] && allFalse(values[element.name]))
              ) {
                allValid = false;
                errors[element.name] = 'Select at least one option';
              }
              break;
            default:
              if (customValidations[element.validation]) {
                let validationResult = customValidations[element.validation]({
                  formData,
                  field: element,
                  schema,
                  currentPage,
                  parentIndex,
                });
                if (validationResult) {
                  allValid = validationResult.allValid;
                  errors[element.name] = validationResult.error;
                }
              }
              break;
          }
        }
      }
    });
    return { errors, allValid };
  },
};

export default utils;
