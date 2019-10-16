import React, { useState, useEffect } from 'react';
import { Toast, toast } from 'hoi-poi-ui';

import { bridge } from 'fm-bridge';
import localBridge from './configs/localBridge';
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
import actions from './configs/actions';

import './App.scss';

function App({}) {
  const initialSelectedForm =
    Object.keys(config.formSchema).length > 1
      ? null
      : {
          name: config.formSchema[Object.keys(config.formSchema)[0]].title,
          value: Object.keys(config.formSchema)[0],
        };
  const [selectedForm, setSelectedForm] = useState(initialSelectedForm);
  const [generalData, setGeneralData] = useState();
  const [formData, setFormData] = useState();
  const [formSchema, setFormSchema] = useState(null);
  const [imagesView, setImagesView] = useState(false);

  useEffect(() => {
    let states = {};
    bridge
      .showLoading()
      .then(localBridge.getFormStates)
      // .then(() => bridge.getFormStates())
      .then((res) => {
        res.forEach((el) => {
          states[el.value] = el.label;
        });
      })
      .then(localBridge.getFormInitData)
      // .then(() => bridge.getFormInitData())
      .then((res) => {
        const initData = utils.formatInitData(res, states);
        setFormData(initData.formData);
        setGeneralData(initData.generalData);
        bridge.hideLoading();
      })
      .catch((err) => {
        console.warn(err);
        bridge.hideLoading();
      });
  }, []);

  useEffect(() => {
    if (selectedForm && !formSchema) {
      bridge
        .showLoading()
        .then(() => utils.generateForm(selectedForm, formData, generalData))
        .then((res) => {
          setFormSchema(res.formSchema);
          if (res.formData) {
            setFormData(res.formData);
          }
          bridge.hideLoading();
        })
        .catch((err) => {
          console.warn(err);
          bridge.hideLoading();
          if (err.toast) {
            toast(err.toast);
          }
        });
    }
  }, [selectedForm, generalData, formSchema, formData]);

  const handleSetImagesView = (value) => {
    setImagesView(value);
  };

  const handleOnFieldFocus = (values, field, currentPage) => {
    const sectionName = formSchema[currentPage].name;

    if (field.subType === 'date') {
      bridge
        .openDatePicker()
        .then((res) => {
          setFormData({
            ...formData,
            formObject: {
              ...formData.formObject,
              [sectionName]: {
                ...formData.formObject[sectionName],
                [field.name]: res,
              },
            },
          });
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  };

  const handleOnSelectorChange = (value) => setSelectedForm(value);

  const handleOnFormChange = (values, field, currentPage) => {
    const sectionName = formSchema[currentPage].name;

    if (field.type === 'checkbox') {
      if (formData.formObject[sectionName][field.name]) {
        values[field.name] = false;
      } else {
        values[field.name] = true;
      }
    }

    const newFormData = {
      ...formData,
      formObject: {
        ...formData.formObject,
        [sectionName]: values,
      },
    };

    //newState = executeActions(newState);
    if (
      actions.onChange &&
      actions.onChange[selectedForm.value][sectionName] &&
      actions.onChange[selectedForm.value][sectionName][field.name]
    ) {
      const data = {
        formData: { ...formData, ...newFormData },
        generalData,
        formSchema,
        values,
        field,
        currentPage,
      };
      actions.onChange[selectedForm.value][sectionName][field.name](data)
        .then((res) => {
          if (res.formData) {
            setFormData({ ...newFormData, ...res.formData });
          } else {
            setFormData({ ...newFormData });
          }
          if (res.generalData) {
            setGeneralData({ ...generalData, ...res.generalData });
          }
          if (res.formSchema) {
            setFormSchema({ ...formSchema, ...res.formSchema });
          }
        })
        .catch((err) => {
          console.warn(err);
          setFormData(newFormData);
        });
    } else {
      setFormData(newFormData);
    }
  };

  const handleOnChangePage = (currentPage) => {
    // if (actions.onChangePage) {
    //   let data = { state: this.state, currentPage };
    //   actions
    //     .onChangePage(data)
    //     .then((newSate) => {
    //       if (newSate) {
    //         this.setState({ ...newSate });
    //       }
    //     })
    //     .catch((err) => console.warn(err));
    // }
  };

  const handleBeforeChangePage = (currentPage) => {
    return new Promise((resolve, reject) => {
      if (actions.beforeChangePage) {
        const data = {
          formData,
          generalData,
          formSchema,
          currentPage,
        };
        actions
          .beforeChangePage(data)
          .then((res) => {
            if (res && res.formData) {
              setFormData({ ...formData, ...res.formData });
            }
            if (res && res.generalData) {
              setGeneralData({ ...generalData, ...res.generalData });
            }
            if (res && res.formSchema) {
              setFormSchema({ ...formSchema, ...res.formSchema });
            }
            resolve();
          })
          .catch((err) => reject(err));
      } else {
        resolve();
      }
    });
  };

  const overrides = {
    Select: { menu: {} },
  };

  const customFields = {
    datePicker: DatePicker,
    timePicker: TimePicker,
    dateTimePicker: DateTimePicker,
    signature: Signature,
    textarea: Textarea,
    checkbox: Checkbox,
  };

  const renderContent = () => {
    if (generalData && generalData.mode === 'creation' && !selectedForm) {
      return (
        <FormSelector
          schema={config.formSchema}
          selectedForm={selectedForm}
          onChange={handleOnSelectorChange}
        />
      );
    } else if (
      formSchema &&
      generalData &&
      ((generalData.mode === 'creation' && selectedForm) ||
        (generalData.mode === 'edition' && !formData.endState))
    ) {
      return (
        <FormEdit
          schema={formSchema}
          onChange={handleOnFormChange}
          onFocus={handleOnFieldFocus}
          formData={formData}
          customFields={customFields}
          setImagesView={handleSetImagesView}
          imagesView={imagesView}
          overrrides={overrides}
          onChangePage={handleOnChangePage}
          beforeChangePage={handleBeforeChangePage}
        />
      );
    } else if (formSchema && generalData && generalData.mode === 'edition' && formData.endState) {
      return (
        <FormSummary schema={formSchema} values={formData.formObject} customFields={customFields} />
      );
    } else {
      return;
    }
  };

  return (
    <div className="form-container">
      {renderContent()}
      <Toast />
    </div>
  );
}

export default App;
