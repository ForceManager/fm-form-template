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
import getDefaultValue from './configs/getDefaultValue';
import customActions from './configs/customActions';

import './App.scss';

class App extends PureComponent {
  state = {
    selectedForm:
      Object.keys(config.formSchema).length > 1
        ? null
        : {
            name: config.formSchema[Object.keys(config.formSchema)[0]].title,
            value: Object.keys(config.formSchema)[0],
          },
    // selectedForm: { name: 'Standard Service', value: 'standardService' },
    formSchema: null,
    imagesView: false,
  };

  componentDidMount() {
    bridge
      .showLoading()
      .then(() => bridge.getFormInitData())
      .then((res) => {
        console.log('config.formSchema', config.formSchema);
        let newState;
        if (res.mode === 'creation') {
          bridge.setTitle('Form creation');
          newState = {
            formData: {
              formObject: {
                fechaCreacion: moment().format('DD/MM/YYYY HH:mm'),
                userCreacion: res.user.id,
              },
              idFormType: null,
              idState: 1,
              endState: 0,
              listObject: config.listObject,
              detailObject: config.detailObject,
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
      let schemaPromises = [];
      let schemaPositions = [];
      let defaultValuesPromises = [];
      let defaultValuesPositions = [];
      let defaultValuePath = [];
      let newFormSchema = [...config.formSchema[selectedForm.value].schema];
      bridge.showLoading();
      const mapSections = (sections, currentPath, subsection) => {
        sections.forEach((section, sectionIndex) => {
          section.className = [section.className, 'form-page'];
          section.isExpandable = false;
          if (!subsection) defaultValuePath = [];
          defaultValuePath.push(currentPath[sectionIndex].name);
          mapFields(section.fields, currentPath[sectionIndex].fields);
        });
      };
      const mapFields = (fields, currentPath) => {
        // console.log('currentValuePath', currentValuePath);
        fields.forEach((field, fieldIndex) => {
          if (!field.isFullWidth) field.isFullWidth = true;
          if (field.type !== 'checkbox' && !field.labelMode) field.labelMode = 'vertical';
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
              if (field.defaultValue && field.defaultValue !== '') {
                defaultValuesPromises.push(getDefaultValue(this.state, field.defaultValue));
                let position = [...defaultValuePath, currentPath[fieldIndex].name];
                defaultValuesPositions.push(position);
              }
              break;
            case 'checkboxGroup':
              break;
            case 'text':
              if (field.defaultValue && field.defaultValue !== '') {
                defaultValuesPromises.push(getDefaultValue(this.state, field.defaultValue));
                let position = [...defaultValuePath, currentPath[fieldIndex].name];
                defaultValuesPositions.push(position);
              }
              break;
            case 'datePicker':
            case 'dateTimePicker':
            case 'dateTime':
              defaultValuesPromises.push(Promise.resolve(null));
              let position = [...defaultValuePath, currentPath[fieldIndex].name];
              defaultValuesPositions.push(position);
              break;
            default:
          }
        });
      };

      mapSections(newFormSchema, newFormSchema, false);
      Promise.all(schemaPromises)
        .then((res) => {
          res.forEach((el, i) => {
            schemaPositions[i] = el;
          });
          return Promise.all(defaultValuesPromises);
        })
        .then((res) => {
          let defaultValues = {};
          let pointer = defaultValues;
          res.forEach((defaultValue, index) => {
            defaultValuesPositions[index].forEach((key, index) => {
              if (index < defaultValuesPositions[index].length - 1) {
                if (!pointer[key]) {
                  pointer[key] = {};
                }
                pointer = pointer[key];
              } else {
                pointer[key] = defaultValue;
                pointer = defaultValues;
              }
            });
          });
          this.setState({
            ...this.state,
            formSchema: newFormSchema,
            formData: {
              ...formData,
              formObject: {
                ...formData.formObject,
                ...defaultValues,
              },
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

    console.log('onFormChange', values, field, currentPage);

    if (
      (field.type === 'datePicker' ||
        field.type === 'timePicker' ||
        field.type === 'dateTimePicker') &&
      !values[field.name]
    ) {
      values[field.name] = null;
    }

    if (field.type === 'datePicker')
      values[field.name] = moment(values[field.name]).format('MM/DD/YYYY');
    if (field.type === 'timePicker')
      values[field.name] = moment(values[field.name]).format('HH:mm');
    if (field.type === 'dateTimePicker')
      values[field.name] = moment(values[field.name]).format('MM/DD/YYYY HH:mm');

    if (field.type === 'checkbox') {
      if (formData.formObject[sectionName][field.name]) {
        values[field.name] = false;
      } else {
        values[field.name] = true;
      }
    }

    if (field.type === 'multiplier') {
      // values = values[field.name];
    }

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
          console.log('customActions state', res);
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

  onPickerChange = (a, b, c) => {
    console.log('onPickerChange', a, b, c);
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
