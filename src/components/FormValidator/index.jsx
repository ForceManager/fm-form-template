import React from 'react';
import { Form } from 'hoi-poi-ui';

import './style.scss';

const FormValidator = ({ schema, onChange, values }) => {
  const errors = {};

  console.log('schema', schema);
  console.log('values', values);

  const onFormChange = (values, field) => {
    console.log('onFormChange', values, field);
    onChange(values, field);
  };

  return <Form onChange={onFormChange} values={values} errors={errors} schema={schema} />;
};

export default FormValidator;
