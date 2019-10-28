import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Icon, Toast, toast } from 'hoi-poi-ui';
import { bridge } from 'fm-bridge';
import utils from '../../utils';
import FormSummary from '../FormSummary';
import config from '../../configs/config.json';
import CONSTANTS from '../../constants';

import './style.scss';

function FormEdit({
  schema,
  onChange,
  onFocus,
  formData,
  customFields,
  setImagesView,
  imagesView,
  overrrides,
  beforeChangePage,
  ...props
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages] = useState(schema.length);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.idState === CONSTANTS.STATE.SIGNED) {
      setCurrentPage(5);
    }
  }, [formData.idState, setCurrentPage]);

  useEffect(() => {
    const pageSchema = schema[currentPage];
    if ((pageSchema && pageSchema.imagesView && !imagesView) || currentPage === totalPages) {
      bridge
        .showCameraImages()
        .then(() => {
          setImagesView(true);
        })
        .catch((err) => {
          console.warn(err);
        });
    } else if (!pageSchema || (imagesView && !pageSchema.imagesView)) {
      bridge
        .hideCameraImages()
        .then(() => setImagesView(false))
        .catch((err) => {
          console.warn(err);
        });
    }
  }, [imagesView, schema, setImagesView, currentPage, totalPages]);

  const validate = useCallback(() => {
    return new Promise((resolve, reject) => {
      const pageSchema = schema[currentPage];
      const { errors, allValid } = utils.validateFields(
        pageSchema.fields,
        formData.formObject[schema[currentPage].name],
        formData,
        schema,
        currentPage,
      );

      if (allValid) {
        setErrors({});
        resolve();
      } else {
        setErrors(errors);
        reject({ type: 'invalid' });
      }
    });
  }, [currentPage, formData, schema]);

  const handleOnClickPrev = useCallback(
    (event) => {
      if (currentPage > 0) {
        bridge
          .showLoading()
          .then(() => bridge.saveData(formData))
          .then(() => {
            setCurrentPage(currentPage - 1);
            bridge.hideLoading();
          })
          .catch((err) => {
            if (err.type === 'invalid') {
            } else {
              console.warn(err);
              toast({
                type: 'error',
                text: 'The form could not be saved',
                title: 'Error',
              });
            }
            bridge.hideLoading();
          });
      }
    },
    [currentPage, formData],
  );

  const handleOnClickNext = useCallback(
    (event) => {
      bridge
        .showLoading()
        .then(() => validate())
        .then(() => beforeChangePage(currentPage))
        .then((newState) => {
          if (newState) {
            return bridge.saveData(newState.formData);
          } else {
            return bridge.saveData(formData);
          }
        })
        .then(() => {
          setCurrentPage(currentPage + 1);
          bridge.hideLoading();
        })
        .catch((err) => {
          if (err.type === 'invalid') {
          } else {
            console.warn(err);
            toast({
              type: 'error',
              text: 'The form could not be saved',
              title: 'Error',
            });
          }
          bridge.hideLoading();
        });
    },
    [beforeChangePage, currentPage, formData, validate],
  );

  const handleOnFormChange = useCallback(
    (values, field) => {
      onChange(values, field, currentPage);
    },
    [currentPage, onChange],
  );

  const handleOnFieldFocus = useCallback(
    (values, field) => {
      onFocus(values, field, currentPage);
    },
    [currentPage, onFocus],
  );

  const handleOnClose = useCallback(() => {
    // onClose({ ...props });
  }, []);

  const handleOnClickFinish = useCallback(() => {
    formData.idState = CONSTANTS.STATE.FINISHED;
    formData.endState = 1;
    Object.keys(config.listObject).forEach((key) => {
      if (config.listObject[key] === 'state') {
        formData.listObject[key] = 'Closed';
      }
    });
    config.detailObject.detailValues.forEach((el, i) => {
      if (el.value === 'state') {
        formData.detailObject.detailValues[i].value = 'Closed';
      }
    });
    bridge
      .saveData(formData)
      .then(() => bridge.finishActivity())
      .catch((err) => {
        console.warn(err);
        toast({
          type: 'error',
          text: 'The form could not be saved',
          title: 'Error',
        });
      });
  }, [formData]);

  const renderPrev = useMemo(() => {
    if (currentPage === 0) return <div className="forms-pager-prev" />;
    return (
      <div className="forms-pager-prev" onClick={handleOnClickPrev}>
        <Icon name="chevron" />
      </div>
    );
  }, [currentPage, handleOnClickPrev]);

  const renderNext = useMemo(() => {
    if (currentPage === totalPages) return <div className="forms-pager-next" />;
    return (
      <div className="forms-pager-next" onClick={handleOnClickNext}>
        <Icon name="chevron" />
      </div>
    );
  }, [currentPage, handleOnClickNext, totalPages]);

  const renderPageNumber = useMemo(() => {
    if (currentPage === totalPages) {
      return (
        <div className="forms-pager-finish" onClick={handleOnClickFinish}>
          FINISH
        </div>
      );
    }
    return <div className="forms-pager-number">{`${currentPage + 1} / ${totalPages}`}</div>;
  }, [currentPage, handleOnClickFinish, totalPages]);

  const renderSummary = useMemo(() => {
    console.log('renderSummary', currentPage, totalPages, schema);
    return <FormSummary schema={schema} values={formData.formObject} customFields={customFields} />;
  }, [customFields, formData.formObject, schema]);

  const renderForm = useMemo(() => {
    console.log('renderForm', currentPage, totalPages);
    const isSignedForm = formData.idState === CONSTANTS.STATE.SIGNED;
    if (!schema[currentPage]) return null;

    return (
      <Form
        schema={[schema[currentPage]]}
        currentPage={currentPage}
        onChange={handleOnFormChange}
        onFocus={handleOnFieldFocus}
        values={formData.formObject[schema[currentPage].name] || {}}
        customFields={customFields}
        errors={errors}
        onClose={handleOnClose}
        isReadOnly={isSignedForm}
        useNativeForm={false}
      />
    );
  }, [
    currentPage,
    customFields,
    errors,
    formData.formObject,
    formData.idState,
    handleOnClose,
    handleOnFieldFocus,
    handleOnFormChange,
    schema,
  ]);

  const renderContent = useMemo(() => {
    console.log('renderContent', currentPage, totalPages);
    if (currentPage === totalPages) {
      return renderSummary;
    }
    return renderForm;
  }, [currentPage, renderForm, renderSummary, totalPages]);

  return (
    <div className="forms-pager">
      <div className="form-container">{renderContent}</div>
      <div className="forms-pager-bar">
        {renderPrev}
        {renderPageNumber}
        {renderNext}
      </div>
      <Toast />
    </div>
  );
}

export default FormEdit;
