import React, { PureComponent } from 'react';
import { Toast, toast } from 'hoi-poi-ui';
import moment from 'moment';
import { bridge } from 'fm-bridge';
import FormSelector from './components/FormSelector';
import FormEdit from './components/FormEdit';
import FormSummary from './components/FormSummary';
import Signature from './components/Signature';
import DatePicker from './components/DatePicker';
import TimePicker from './components/TimePicker';
import DateTimePicker from './components/DateTimePicker';
import Textarea from './components/Textarea';
import Checkbox from './components/Checkbox';
import utils from './utils';
import config from './configs/config.json';
import getDefaultValues from './configs/getDefaultValues';
import customActions from './configs/customActions';
import CONSTANTS from './constants';

import './App.scss';

class App extends PureComponent {
  state = {
    // selectedForm:
      // Object.keys(config.formSchema).length > 1
      //   ? null
      //   : {
      //       name: config.formSchema[Object.keys(config.formSchema)[0]].title,
      //       value: Object.keys(config.formSchema)[0],
      //     },
    selectedForm: { name: 'Standard Service', value: 'standardService' },
    formSchema: null,
    imagesView: false,
  };

  componentDidMount() {
    bridge
      .showLoading()
      .then(() => bridge.getFormInitData())
      .then((res) => {
        let newState;
        if (res.mode === 'creation') {
          bridge.setTitle('Form creation');
          newState = {
            formData: {
              formObject: {
                fechaCreacion: moment().format('DD/MM/YYYY hh:mm A'),
                userCreacion: res.user.id,
              },
              idFormType: null,
              idState: CONSTANTS.STATE.DRAFT,
              endState: 0,
            },
            company: res.company,
            user: res.user,
            entityForm: res.entityForm,
            mode: res.mode,
            isReadonly: res.isReadonly || false,
            idPreSelectedFormType: res.idPreSelectedFormType,
            entityFormExtraFields: res.entityFormExtraFields,
            imei: res.imei,
          };
          // Object.keys(newState.formData.listObject).forEach((key) => {
          // let element = newState.formData.listObject[key];
          //   switch (element) {
          //     case 'selectedForm':
          //       element = this.state.selectedForm;
          //       break;
          //     case 'creationDate':
          //       element = newState.formData.formObject.fechaCreacion;
          //       break;
          //     case 'state':
          //       element = newState.formData.formObject.fechaCreacion;
          //       break;

          //     default:
          //       break;
          //   }
          // });
        } else if (res.mode === 'edition') {
          bridge.setTitle('Form edition');
          newState = {
            formData: {
              formObject: res.entityForm.fullObject.formObject,
              idFormType: res.idFormType,
              idState: res.idState,
              endState: res.endState,
              listObject: res.entityForm.listObject,
              detailObject: {
                detailTitle: config.detailObject.detailTitle,
                detailValues: res.entityForm.detailObject,
              },
            },
            company: res.company,
            user: res.user,
            entityForm: res.entityForm,
            mode: res.mode,
            isReadonly: res.isReadonly || false,
          };
        }
        this.setState({ ...this.state, ...newState });
        bridge.hideLoading();
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  componentDidUpdate() {
    const { selectedForm, formSchema, formData, company } = this.state;

    if (selectedForm && !formSchema) {
      let defaultValues;
      let schemaPromises = [];
      let schemaPositions = [];
      let newFormSchema = [...config.formSchema[selectedForm.value].schema];
      let newListObject= { ...config.listObject};
      let newDetailObject = { ...config.detailObject};
      bridge.showLoading();

      const mapSections = (sections, currentPath, subsection) => {
        sections.forEach((section, sectionIndex) => {
          section.className = [section.className, 'form-page'];
          section.isExpandable = false;
          mapFields(section.fields, currentPath[sectionIndex].fields);
        });
      };
      const mapFields = (fields, currentPath) => {
        // console.log('currentValuePath', currentValuePath);
        fields.forEach((field, fieldIndex) => {
          // if (!field.isFullWidth) field.isFullWidth = true;
          // if (field.type !== 'checkbox' && !field.labelMode) field.labelMode = 'vertical';
          if (!field.attrs) field.attrs = {};
          field.attrs['className'] = `field-${field.type}`;
          switch (field.type) {
            case 'multiplier':
              mapSections(field.schema, currentPath[fieldIndex].schema, true);
              break;
            case 'select':
              field.isSearchable = false;
              if (field.attrs && field.attrs.table && field.attrs.table !== '') {
                schemaPromises.push(
                  bridge
                    .getValueList(field.attrs.table)
                    .then((res) => {
                      field.attrs.options = res;
                    })
                    .catch((err) => {
                      console.warn(err);
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
                    ? company.id
                    : field.attrs.relatedEntity[2];
                schemaPromises.push(
                  bridge
                    .getRelatedEntity(
                      field.attrs.relatedEntity[0],
                      field.attrs.relatedEntity[1],
                      id,
                    )
                    .then((res) => {
                      console.log('getRelatedEntity', res);
                      field.attrs.options = utils.formatEntityList(
                        field.attrs.relatedEntity[0],
                        res,
                      );
                    })
                    .catch((err) => {
                      console.warn(err);
                      toast({
                        type: 'error',
                        text: 'Get value list failed',
                        title: 'Error',
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
        });
      };

      function setListObject() {
        return new Promise((resolve, reject) => {
          Object.keys(newListObject).forEach(key => {
            switch (newListObject[key]) {
              case 'selectedForm':
                newListObject[key] = selectedForm.name;
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
          newDetailObject.detailValues.forEach(element => {
            switch (element.value) {
              case 'selectedForm':
                element.value = selectedForm.name;
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

      mapSections(newFormSchema, newFormSchema, false);

      Promise.all(schemaPromises)
        .then((res) => {
          res.forEach((el, i) => {
            schemaPositions[i] = el;
          });
          return getDefaultValues(this.state, selectedForm.value);
        })
        .then((res) => {
          defaultValues = res;
          return setListObject();
        })
        .then(() =>  setDetailObject())
        .then(() => {
          this.setState({
            ...this.state,
            formSchema: newFormSchema,
            formData: {
              ...formData,
              formObject: {
                ...formData.formObject,
                ...defaultValues,
              },
              listObject: newListObject,
              detailObject: newDetailObject,
              idFormType: config.formSchema[selectedForm.value].id,
            },
          });
          bridge.hideLoading();
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  }

  setImagesView = (value) => {
    this.setState({ imagesView: value });
  };

  onFieldFocus = (values, field, currentPage) => {
    const { formData, formSchema } = this.state;
    const sectionName = formSchema[currentPage].name;

    if (field.subType === 'date') {
      bridge
        .openDatePicker()
        .then((res) => {
          this.setState({
            formData: {
              ...formData,
              formObject: {
                ...formData.formObject,
                [sectionName]: {
                  ...formData.formObject[sectionName],
                  [field.name]: res,
                },
              },
            },
          });
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  };

  onSelectorChange = (value) => this.setState({ selectedForm: value });

  onFormChange = (values, field, currentPage) => {
    const { formData, formSchema, selectedForm } = this.state;
    const sectionName = formSchema[currentPage].name;

    // console.log('onFormChange', values, field, currentPage);

    function formatPickers(pickerField, pickerValue) {
      if (pickerField.type === 'datePicker' && typeof pickerValue === 'object')
        return moment(pickerValue).format('MM/DD/YYYY');
      if (pickerField.type === 'timePicker' && typeof pickerValue === 'object')
        return moment(pickerValue).format('hh:mm A');
      if (pickerField.type === 'dateTimePicker' && typeof pickerValue === 'object')
        return moment(pickerValue).format('MM/DD/YYYY hh:mm A');
      return pickerValue;
    }

     values[field.name] = formatPickers(field, values[field.name]);

    // if (
    //   (field.type === 'datePicker' ||
    //     field.type === 'timePicker' ||
    //     field.type === 'dateTimePicker') &&
    //   !values[field.name]
    // ) {
    //   values[field.name] = null;
    // }
    

    if (field.type === 'checkbox') {
      if (formData.formObject[sectionName][field.name]) {
        values[field.name] = false;
      } else {
        values[field.name] = true;
      }
    }

    if (field.type === 'multiplier') {
      values[field.name].forEach((element) => {
        if (element) {
          Object.keys(element).forEach(key => {
            const mField = field.schema[0].fields.find(el => el.name === key);
            element[key] = formatPickers(mField, element[key]);
          })
        }
      });
    }

    console.log('values', values);

    let newState = {
      formData: {
        ...formData,
        formObject: {
          ...formData.formObject,
          [sectionName]: values,
        },
      },
    };
    if (
      customActions[selectedForm.value] &&
      customActions[selectedForm.value][sectionName] &&
      customActions[selectedForm.value][sectionName][field.name] &&
      customActions[selectedForm.value][sectionName][field.name].onChange
    ) {
      let data = { state: newState, values, field, currentPage };
      customActions[selectedForm.value][sectionName][field.name]
        .onChange(data)
        .then((res) => {
          this.setState({
            ...newState,
            ...res,
          });
        })
        .catch((err) => {
          console.warn(err);
          this.setState({ ...newState });
        });
    } else {
      this.setState({ ...newState });
    }
  };

  overrides = {
    Select: { menu: {} },
  };

  customFields = {
    datePicker: DatePicker,
    timePicker: TimePicker,
    dateTimePicker: DateTimePicker,
    signature: Signature,
    textarea: Textarea,
    checkbox: Checkbox,
  };

  renderContent() {
    const { mode, selectedForm, formData, formSchema, imagesView } = this.state;

    console.log('this.state', this.state);

    if (mode === 'creation' && !selectedForm) {
      return (
        <FormSelector
          schema={config.formSchema}
          selectedForm={selectedForm}
          onChange={this.onSelectorChange}
        />
      );
    } else if (
      (formSchema && (this.state.mode === 'creation' && selectedForm)) ||
      this.state.mode === 'edition'
    ) {
      return (
        <FormEdit
          schema={formSchema}
          onChange={this.onFormChange}
          onFocus={this.onFieldFocus}
          formData={formData}
          customFields={this.customFields}
          setImagesView={this.setImagesView}
          imagesView={imagesView}
          overrrides={this.overrides}
        />
      );
    } else if (this.state.mode === 'edition') {
      return <FormSummary schema={formSchema} values={formData.formObject} />;
    } else {
      return;
    }
  }

  render() {
    return (
      <div className="fom-container">
        {this.renderContent()}
        <Toast />
      </div>
    );
  }
}

export default App;
