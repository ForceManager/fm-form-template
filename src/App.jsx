import React, { useState, useEffect, useCallback } from 'react';
import { Toast, toast } from 'hoi-poi-ui';
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
import actions from './configs/actions';

import './app.scss';

const customFields = {
  datePicker: DatePicker,
  timePicker: TimePicker,
  dateTimePicker: DateTimePicker,
  signature: Signature,
  textarea: Textarea,
  checkbox: Checkbox,
};

function App() {
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
      .then(() => bridge.getFormStates())
      .then((res) => {
        res.forEach((el) => {
          states[el.value] = el.label;
        });
      })
      .then(() => bridge.getFormInitData())
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
    if (!selectedForm || formSchema) return;
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
  }, [selectedForm, generalData, formSchema, formData]);

  const handleOnFieldFocus = useCallback(
    (values, field, currentPage) => {
      const sectionName = formSchema[currentPage].name;
      if (field.subType !== 'date') return;
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
    },
    [formData, formSchema],
  );

  const handleOnFormChange = useCallback(
    (values, field, currentPage) => {
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
    },
    [formData, formSchema, generalData, selectedForm],
  );

  const handleBeforeChangePage = useCallback(
    (currentPage) => {
      return new Promise((resolve, reject) => {
        if (!actions.beforeChangePage) {
          resolve();
        } else {
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
        }
      });
    },
    [formData, formSchema, generalData],
  );

  // const overrides = {
  //   Select: { menu: {} },
  // };

  const showSelector = generalData && generalData.mode === 'creation' && !selectedForm;
  const showEdit =
    formSchema &&
    generalData &&
    ((generalData.mode === 'creation' && selectedForm) ||
      (generalData.mode === 'edition' && formData.endState));
  const showSummary =
    formSchema && generalData && generalData.mode === 'edition' && formData.endState;

  return (
    <div className="form-container">
      {showSelector && (
        <FormSelector
          schema={config.formSchema}
          selectedForm={selectedForm}
          onChange={setSelectedForm}
        />
      )}
      {showEdit && (
        <FormEdit
          schema={formSchema}
          onChange={handleOnFormChange}
          onFocus={handleOnFieldFocus}
          formData={formData}
          customFields={customFields}
          setImagesView={setImagesView}
          imagesView={imagesView}
          // overrrides={overrides}
          beforeChangePage={handleBeforeChangePage}
        />
      )}
      {showSummary && (
        <FormSummary schema={formSchema} values={formData.formObject} customFields={customFields} />
      )}
      <Toast />
    </div>
  );
}

export default App;
