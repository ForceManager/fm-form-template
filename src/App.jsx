import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Toast, toast } from 'hoi-poi-ui';
import { bridge } from 'fm-bridge';
import FormSelector from './components/FormSelector';
import FormEdit from './components/FormEdit';
import FormSummary from './components/FormSummary';
import FormError from './components/FormError';
import Signature from './components/Signature';
import DatePicker from './components/DatePicker';
import TimePicker from './components/TimePicker';
import DateTimePicker from './components/DateTimePicker';
import Textarea from './components/Textarea';
import Checkbox from './components/Checkbox';
import utils from './utils';
import config from './configs/config.json';
import actions from './configs/actions';
import { version } from '../package.json';

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
  const [error, setError] = useState(false);
  const [summaryConfig, setSummaryConfig] = useState(
    (selectedForm && config.formSchema[selectedForm.value]?.summary) || {},
  );

  const setStates = useCallback(
    (data) => {
      if (data && data.formSchema) {
        setFormSchema([...data.formSchema]);
      }
      if (data && data.formData) {
        setFormData({ ...formData, ...data.formData });
      }
      if (data && data.generalData) {
        setGeneralData({ ...generalData, ...data.generalData });
      }
    },
    [formData, generalData, setFormData, setGeneralData, setFormSchema],
  );
  
  const startTime = Date.now();
  const getFormStatesBE = () => {
    return new Promise((resolve, reject) => {
      bridge
        .getFormStates()
        .then((res) => resolve(res))
        .catch(() => {
          if (Date.now() - startTime > 10000) reject('Timeout getting states');
          getFormStatesBE();
        });
    });
  };

  useEffect(() => {
    let statesList = {};
    bridge
      .showLoading()
      .then(() => getFormStatesBE())
      .then((res) => {
        statesList = res;
        return bridge.getFormInitData();
      })
      .then((res) => {
        const initData = utils.formatInitData(res, statesList, config.literals);
        setFormData(initData.formData);
        setGeneralData(initData.generalData);
        bridge.hideLoading();
      })
      .catch((err) => {
        console.warn(err);
        bridge.hideLoading();
        setError(true);
      });
  }, []);

  useEffect(() => {
    setSummaryConfig((selectedForm && config.formSchema[selectedForm.value]?.summary) || {});
  }, [selectedForm]);

  useEffect(() => {
    if (selectedForm || !generalData || !formData.idFormSubType) return;
    if (generalData.mode === 'edition') {
      const selectedForm = Object.keys(config.formSchema).find(
        (key) => key === formData.idFormSubType,
      );
      setSelectedForm({
        label: config.formSchema[selectedForm].title,
        value: selectedForm,
      });
    }
  }, [selectedForm, generalData, formData, setSelectedForm]);

  useEffect(() => {
    if (!selectedForm || !formData || !generalData || formSchema) return;
    let data = {};
    bridge
      .showLoading()
      .then(() => utils.generateForm(selectedForm, formData, generalData))
      .then((res) => {
        data = {
          formData: res.formData,
          generalData: res.generalData,
          formSchema: res.formSchema,
        };
        if (!actions || !actions.onFormReady) {
          return Promise.resolve({});
        }
        return actions.onFormReady(data);
      })
      .then((res) => {
        const newStates = {
          formData: res?.formData ? res.formData : data.formData,
          generalData: res?.generalData ? res.generalData : data.generalData,
          formSchema: res?.formSchema ? res.formSchema : data.formSchema,
        };
        setStates(newStates);
        bridge.hideLoading();
      })
      .catch((err) => {
        console.warn(err.error ? err.error : err);
        bridge.hideLoading();
        if (err.toast) {
          toast(err.toast);
        }
        // setError(true);
      });
  }, [selectedForm, generalData, formSchema, formData, setStates]);

  const handleOnFieldFocus = useCallback((values, field, currentPage) => {}, []);

  const handleOnFormChange = useCallback(
    (values, field, currentPage) => {
      const sectionName = formSchema[currentPage].name;

      if (field.type === 'checkbox') {
        if (formData.formObject[sectionName] && formData.formObject[sectionName][field.name]) {
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

      if (actions.onChange?.[selectedForm.value]?.[sectionName]?.[field.name]) {
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
            const newStates = {
              formData: res.formData ? { ...newFormData, ...res.formData } : { ...newFormData },
              generalData: res.generalData ? res.generalData : null,
              formSchema: res.formSchema ? res.formSchema : null,
            };
            setStates(newStates);
          })
          .catch((err) => {
            console.warn(err);
            setFormData(newFormData);
          });
      } else {
        setFormData(newFormData);
      }
    },
    [formData, formSchema, generalData, selectedForm, setStates],
  );

  const handleBeforeChangePage = useCallback(
    (currentPage, next) => {
      return utils.beforeChangePage({
        selectedForm,
        formSchema,
        formData,
        generalData,
        currentPage,
        setFormData,
        setGeneralData,
        setFormSchema,
        next,
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

  const showSelector = useMemo(() => {
    return generalData?.mode === 'creation' && !selectedForm;
  }, [generalData, selectedForm]);

  const showEdit = useMemo(() => {
    return (
      formSchema &&
      ((generalData?.mode === 'creation' && selectedForm) ||
        (generalData?.mode === 'edition' && formData && !formData.endState))
    );
  }, [formSchema, generalData, selectedForm, formData]);

  const showSummary = useMemo(() => {
    return !!(formSchema && generalData?.mode === 'edition' && formData?.endState);
  }, [formSchema, generalData, formData]);

  const platformClass = useMemo(() => {
    return generalData && generalData.platform ? `platform-${generalData.platform}` : '';
  }, [generalData]);

  return (
    <div className={`form-container ${platformClass}`}>
      {error && <FormError />}
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
          summaryConfig={summaryConfig}
        />
      )}
      {showSummary && (
        <FormSummary
          schema={formSchema}
          values={formData.formObject}
          customFields={customFields}
          summaryConfig={summaryConfig}
        />
      )}
      <Toast />
      <div className={`form-version ${error || showSelector ? 'show' : ''}`}>{version}</div>
    </div>
  );
}

export default App;
