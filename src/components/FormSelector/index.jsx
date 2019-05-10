import React from 'react';
import { Select } from 'hoi-poi-ui';

import './style.scss';

const FormSelector = ({ schema, selectedForm, onChange }) => {
  const options = schema.map((form) => {
    return { label: form.title, value: form.id };
  });

  const onFormChange = (formValues) => onChange(formValues);

  return (
    <div className="forms-select">
      <Select
        label="Form Type"
        placeholder="Select one"
        onChange={onFormChange}
        options={options}
        value={selectedForm}
      />
    </div>
  );
};

export default FormSelector;
