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
          label: config.formSchema[Object.keys(config.formSchema)[0]].title,
          value: Object.keys(config.formSchema)[0],
        };
  const [selectedForm, setSelectedForm] = useState(initialSelectedForm);
  const [generalData, setGeneralData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [formSchema, setFormSchema] = useState(null);
  const [imagesView, setImagesView] = useState(false);

  const setStates = useCallback(
    (data) => {
      if (data && data.formData) {
        setFormData({ ...formData, ...data.formData });
      }
      if (data && data.generalData) {
        setGeneralData({ ...generalData, ...data.generalData });
      }
      if (data && data.formSchema) {
        setFormSchema({ ...formSchema, ...data.formSchema });
      }
    },
    [formData, generalData, formSchema, setFormData, setGeneralData, setFormSchema],
  );

  useEffect(() => {
    let states = {};
    bridge
      .showLoading()
      .then(() => bridge.getFormStates())
      .then((res) => {
        states = res;
        return bridge.getFormInitData();
      })
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
    if (selectedForm || !generalData) return;
    if (generalData.mode === 'edition') {
      const selectedForm = Object.keys(config.formSchema).find(
        (key) => config.formSchema[key].id === formData.idFormType,
      );
      setSelectedForm({
        label: config.formSchema[selectedForm].title,
        value: selectedForm,
      });
    }
  }, [selectedForm, generalData, formData, setSelectedForm]);

  useEffect(() => {
    if (!selectedForm || !formData || !generalData || formSchema) return;
    bridge
      .showLoading()
      .then(() => utils.generateForm(selectedForm, formData, generalData))
      .then((res) => {
        setFormSchema(res.formSchema);
        if (res.formData) {
          setFormData(res.formData);
        }
        if (!actions || !actions.onFormReady) {
          return Promise.resolve({});
        }
        const data = {
          formData: res.formData,
          generalData,
          formSchema: res.formSchema,
        };
        return actions.onFormReady(data);
      })
      .then((res) => {
        setStates(res);
        bridge.hideLoading();
      })
      .catch((err) => {
        console.warn(err.error ? err.error : err);
        bridge.hideLoading();
        if (err.toast) {
          toast(err.toast);
        }
      });
  }, [selectedForm, generalData, formSchema, formData, setStates]);

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
            if (res && res.formData) {
              setFormData({ ...newFormData, ...res.formData });
            } else {
              setFormData({ ...newFormData });
            }
            if (res && res.generalData) {
              setGeneralData({ ...generalData, ...res.generalData });
            }
            if (res && res.formSchema) {
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
      return utils.beforeChangePage({
        selectedForm,
        formSchema,
        formData,
        generalData,
        currentPage,
        setFormData,
        setGeneralData,
        setFormSchema,
      });
    },
    [formData, formSchema, generalData, selectedForm],
  );

  const handleBeforeFinish = useCallback(
    (currentPage) => {
      return utils.beforeFinish({
        selectedForm,
        formSchema,
        formData,
        generalData,
        currentPage,
        setFormData,
        setGeneralData,
        setFormSchema,
      });
    },
    [formData, formSchema, generalData, selectedForm],
  );

  const showSelector = generalData && generalData.mode === 'creation' && !selectedForm;
  const showEdit =
    formSchema &&
    generalData &&
    ((generalData.mode === 'creation' && selectedForm) ||
      (generalData.mode === 'edition' && formData && !formData.endState));
  const showSummary = !!(
    formSchema &&
    generalData &&
    generalData.mode === 'edition' &&
    formData &&
    formData.endState
  );

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
          generalData={generalData}
          formData={formData}
          customFields={customFields}
          setImagesView={setImagesView}
          imagesView={imagesView}
          setFormData={setFormData}
          beforeChangePage={handleBeforeChangePage}
          beforeFinish={handleBeforeFinish}
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
