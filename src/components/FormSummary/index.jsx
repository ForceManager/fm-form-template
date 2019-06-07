import React, { PureComponent } from 'react';
import { Section, Input } from 'hoi-poi-ui';

import './style.scss';

class FormSummary extends PureComponent {
  state = {};

  renderSectionContent(section, index) {
    const { schema, values } = this.props;
    const sectionFields = schema[index].fields;
    const sectionValues = values[section.name];

    // console.log('sectionFields', sectionFields);
    // console.log('sectionValues', sectionValues);
    if (!sectionValues) return null;
    return Object.keys(sectionValues).map((key) => {
      let field = sectionValues[key];
      let fieldLabel = sectionFields.find((el) => el.name === key).label;
      console.log('fieldLabel', fieldLabel);
      return <Input key={key} label={fieldLabel} value={field.label} />;
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
    return <dic className="summary">{this.renderSections()}</dic>;
  }
}

export default FormSummary;
