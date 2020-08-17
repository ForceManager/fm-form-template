import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Toast, toast } from 'hoi-poi-ui';
import { bridge } from 'fm-bridge';
import utils from '../../utils';
import FormSummary from '../FormSummary';

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
  summaryConfig,
  ...props
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages] = useState(schema.length);
  const [errors, setErrors] = useState({});
  const [hasSummary] = useState(!summaryConfig.disable);

  useEffect(() => {
    const pageSchema = schema[currentPage];
    if (pageSchema?.imagesView && !imagesView) {
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
          .then(() => beforeChangePage(currentPage, 0))
          .then(bridge.saveData)
          .then(() => {
            setCurrentPage(currentPage - 1);
            bridge.hideLoading();
          })
          .catch((err) => {
            bridge.hideLoading();
            if (err.type === 'invalid') {
            } else {
              console.warn(err);
              toast({
                type: 'error',
                text: 'The form could not be saved',
                title: 'Error',
              });
            }
          });
      }
    },
    [beforeChangePage, currentPage],
  );

  const handleOnClickNext = useCallback(
    (event) => {
      bridge
        .showLoading()
        .then(() => validate())
        .then(() => beforeChangePage(currentPage, 1))
        .then(bridge.saveData)
        .then(() => {
          setCurrentPage(currentPage + 1);
          bridge.hideLoading();
        })
        .catch((err) => {
          bridge.hideLoading();
          if (err.type === 'invalid') {
          } else {
            console.warn(err);
            toast({
              type: 'error',
              text: 'The form could not be saved',
              title: 'Error',
            });
          }
        });
    },
    [beforeChangePage, currentPage, validate],
  );

  const handleOnClickFinish = useCallback(() => {
    const noSummaryValidate = () => {
      if (hasSummary) return Promise.resolve();
      return validate();
    };
    bridge
      .showLoading()
      .then(noSummaryValidate)
      .then(beforeFinish)
      .then(bridge.saveData)
      .then(bridge.hideLoading)
      .then(bridge.finishActivity)
      .catch((err) => {
        bridge.hideLoading();
        if (err.type === 'invalid') {
        } else {
          console.warn(err);
          toast({
            type: 'error',
            text: 'The form could not be saved',
            title: 'Error',
          });
        }
      });
  }, [beforeFinish, validate, hasSummary]);

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

  const renderPrev = useMemo(() => {
    if (currentPage === 0) return <div className="forms-pager-prev" />;
    return (
      <div className="forms-pager-prev" onClick={handleOnClickPrev}>
        <Icon name="chevron" />
      </div>
    );
  }, [currentPage, handleOnClickPrev]);

  const renderNext = useMemo(() => {
    if (currentPage === totalPages || (!hasSummary && currentPage === totalPages - 1))
      return <div className="forms-pager-next" />;
    return (
      <div className="forms-pager-next" onClick={handleOnClickNext}>
        <Icon name="chevron" />
      </div>
    );
  }, [currentPage, handleOnClickNext, totalPages, hasSummary]);

  const renderPageNumber = useMemo(() => {
    if (currentPage === totalPages || (!hasSummary && currentPage === totalPages - 1)) {
      return (
        <div className="forms-pager-finish" onClick={handleOnClickFinish}>
          {generalData.finishButtonLabel || 'FINISH'}
        </div>
      );
    }
    return <div className="forms-pager-number">{`${currentPage + 1} / ${totalPages}`}</div>;
  }, [currentPage, handleOnClickFinish, totalPages, hasSummary, generalData.finishButtonLabel]);

  const renderSummary = useMemo(() => {
    return <FormSummary schema={schema} values={formData.formObject} customFields={customFields} />;
  }, [customFields, formData.formObject, schema]);

  const pageSchema = useMemo(
    () =>
      schema[currentPage]
        ? {
            ...schema[currentPage],
            fields: schema[currentPage].fields.filter((field) => field.isHidden !== true),
          }
        : null,
    [schema, currentPage],
  );

  const renderForm = useMemo(() => {
    // TODO set isReadOnly segun config
    const isReadOnly = false;
    if (!schema[currentPage]) return null;

    return (
      <Form
        schema={[pageSchema]}
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
    pageSchema,
  ]);

  const renderContent = useMemo(() => {
    if (hasSummary && currentPage === totalPages) {
      return renderSummary;
    }
    return renderForm;
  }, [currentPage, renderForm, renderSummary, totalPages, hasSummary]);

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

FormEdit.defaultProps = {
  summaryConfig: { disable: false },
};

FormEdit.propTypes = {
  schema: PropTypes.object,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  generalData: PropTypes.object,
  formData: PropTypes.object,
  customFields: PropTypes.object,
  setImagesView: PropTypes.func,
  imagesView: PropTypes.bool,
  overrrides: PropTypes.object,
  beforeChangePage: PropTypes.func,
  beforeFinish: PropTypes.func,
  setFormData: PropTypes.func,
  summaryConfig: PropTypes.object,
};

export default memo(FormEdit);
