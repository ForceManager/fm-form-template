import React, { PureComponent } from 'react';
import { Section, Input } from 'hoi-poi-ui';
import Signature from '../../components/Signature';
import Checkbox from '../../components/Checkbox';

import './style.scss';

class FormSummary extends PureComponent {
  state = {};

  renderSectionContent(section, index) {
    const { schema, values } = this.props;
    const sectionFields = schema[index].fields;
    const sectionValues = values[section.name];

    // console.log('sectionFields', sectionFields);
    // console.log('sectionValues', sectionValues);
    if (!sectionValues) return <div/>;
    return Object.keys(sectionValues).forEach((key) => {
      console.log('key', key);
      let field = sectionFields.find((el) => el.name === key);
      if (!field) return;
      debugger;
      let fieldValue = field.type === 'select' ? sectionValues[key].label : sectionValues[key];
      let Field;
      switch (field.type) {
        case 'signature':
          Field = Signature;
          break;
        case 'checkbox':
          Field = Checkbox;
          break;
        default:
          Field = Input;
          break;
      }
      return (
        <Field key={key} label={field.label} value={fieldValue} isReadOnly={true} summary={true} />
      );
    });
  }

  renderSections() {
    const { schema } = this.props;

    return schema.map((section, index) => {
      return (
        <Section key={section.name} title={section.title}>
          {this.renderSectionContent(section, index)}
        </Section>
      );
    });
  }

  render() {
    return <div className="summary">{this.renderSections()}</div>;
  }
}

export default FormSummary;
