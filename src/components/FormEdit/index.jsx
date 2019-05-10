import React from 'react';
import FormPager from '../../components/FormPager';

import './style.scss';

const FormsEdit = ({ schema, onChange, values }) => {
  return <FormPager schema={schema} onChange={onChange} values={values} />;
};

export default FormsEdit;
