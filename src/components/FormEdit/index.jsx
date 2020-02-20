import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Icon, Toast, toast } from 'hoi-poi-ui';
import { bridge } from 'fm-bridge';
import utils from '../../utils';
import FormSummary from '../FormSummary';
// import config from '../../configs/config.json';

import './style.scss';

function FormEdit({
  schema,
  onChange,
  onFocus,
  generalData,
  formData,
  customFields,
  setImagesView,
  imagesView,
  overrrides,
  beforeChangePage,
  beforeFinish,
  setFormData,
  ...props
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages] = useState(schema.length);
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   if (currentPage === null) {
  //     let page = schema.findIndex((page) => !formData.formObject[page.name]);
  //     if (page === -1) {
  //       page = schema.length;
  //     }
  //     setCurrentPage(page);
  //   }
  // }, [currentPage, formData.formObject, schema]);

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
        .then((newFormData) => {
          if (newFormData) {
            return bridge.saveData(newFormData);
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
    // beforeFinish()
    //   .then(() =>
    bridge
      .saveData(formData)
      .then(() => {
        bridge.finishActivity();
      })
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
    return <FormSummary schema={schema} values={formData.formObject} customFields={customFields} />;
  }, [customFields, formData.formObject, schema]);

  const renderForm = useMemo(() => {
    // TODO set isReadOnly segun config
    const isReadOnly = false;
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
        isReadOnly={isReadOnly}
        useNativeForm={false}
      />
    );
  }, [
    currentPage,
    customFields,
    errors,
    formData.formObject,
    handleOnClose,
    handleOnFieldFocus,
    handleOnFormChange,
    schema,
  ]);

  const renderContent = useMemo(() => {
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
