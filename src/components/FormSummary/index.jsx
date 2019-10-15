import React, { useEffect } from 'react';
import { Multiplier, Section, Input, CheckboxGroup } from 'hoi-poi-ui';
import Signature from '../../components/Signature';
import Checkbox from '../../components/Checkbox';
import { bridge } from 'fm-bridge';

import './style.scss';

function FormSummary({ schema, values, customFields }) {
  useEffect(() => {
    bridge.showCameraImages();
  }, []);

  const renderSectionContent = (section, index) => {
    const sectionFields = schema[index].fields;
    const sectionValues = values[section.name];

    if (!sectionValues) return;
    return Object.keys(sectionValues).map((key) => {
      let field = sectionFields.find((el) => el.name === key);
      if (!field) return null;
      let fieldValue = field.type === 'select' ? sectionValues[key].label : sectionValues[key];
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
  };

  const renderSections = () => {
    return schema.map((section, index) => {
      return (
        <Section key={section.name} title={section.title}>
          {renderSectionContent(section, index)}
        </Section>
      );
    });
  };

  return <div className="summary">{renderSections()}</div>;
}

export default FormSummary;
