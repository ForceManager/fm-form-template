import React, { PureComponent } from 'react';
// import validator from 'validator';
import { Form } from 'hoi-poi-ui';

import './style.scss';

class FormValidator extends PureComponent {
  state = { errors: {}, validations: {} };

  validateField = (field, value) => {
    const { schema, currentPage } = this.props;

    console.log('schema', schema[currentPage].fields);
    console.log('value', value);
  };

  onFormChange = (values, field, value) => {
    const { onChange } = this.props;

    console.log('onFormChange', values, field);
    this.validateField(field, value);
    onChange(values, field);
  };

  render() {
    const { errors } = this.state;
    const { schema, values } = this.props;

    return <Form onChange={this.onFormChange} values={values} errors={errors} schema={schema} />;
  }
}

export default FormValidator;
