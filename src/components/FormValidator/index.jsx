import React from 'react';
import { Form } from 'hoi-poi-ui';

import './style.scss';

const FormValidator = ({ schema, onChange, values }) => {
  const errors = {};

  console.log('schema', schema);
  console.log('values', values);
  debugger;

  return <Form onChange={onChange} values={values} errors={errors} schema={schema} />;
};

export default FormValidator;
