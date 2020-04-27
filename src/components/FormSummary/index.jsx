import React, { useEffect, useCallback, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { Multiplier, Section, Input, CheckboxGroup } from 'hoi-poi-ui';
import { bridge } from 'fm-bridge';
import Signature from '../../components/Signature';
import Checkbox from '../../components/Checkbox';

import './style.scss';

function FormSummary({ schema, values, customFields, summaryConfig }) {
  useEffect(() => {
    if (summaryConfig.disablePhotos) return;
    bridge.showCameraImages();
  }, [summaryConfig.disablePhotos]);

  const renderSectionContent = useCallback(
    (section, index) => {
      const sectionFields = schema[index].fields;
      const sectionValues = values[section.name];

      if (!sectionValues) return;
      return Object.keys(sectionValues).map((key) => {
        let field = sectionFields.find((el) => el.name === key);
        if (!field) return null;
        let fieldValue =
          field.type === 'select'
            ? sectionValues[key]
              ? sectionValues[key].label
              : ''
            : sectionValues[key];
        let Field;
        let options;
        let multiplierSchema;
        switch (field.type) {
          case 'multiplier':
            Field = Multiplier;
            multiplierSchema = sectionFields[0].schema;
            break;
          case 'signature':
            Field = Signature;
            break;
          case 'checkbox':
            Field = Checkbox;
            break;
          case 'checkboxGroup':
            Field = CheckboxGroup;
            options = field.attrs.options;
            break;
          default:
            Field = Input;
            break;
        }
        return (
          <Field
            key={key}
            label={field.label}
            value={fieldValue}
            values={fieldValue}
            isReadOnly={true}
            summary={true}
            options={options}
            schema={multiplierSchema}
            customFields={customFields}
            className={`field-${field.type}`}
          />
        );
      });
    },
    [schema, values, customFields],
  );

  const renderSections = useMemo(() => {
    if (!schema) return null;
    return Object.keys(schema).map((key) => {
      const section = schema[key];
      return (
        <Section key={section.name} title={section.title}>
          {renderSectionContent(section, key)}
        </Section>
      );
    });
  }, [schema, renderSectionContent]);

  return <div className="summary">{renderSections}</div>;
}

FormSummary.defaultProps = {
  summaryConfig: { disablePhotos: false },
};

FormSummary.propTypes = {
  schema: PropTypes.object,
  values: PropTypes.object,
  customFields: PropTypes.object,
  summaryConfig: PropTypes.object,
};

export default memo(FormSummary);
