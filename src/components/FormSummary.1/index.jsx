import React, { Component } from 'react';
// import FormsSelector from './componenents/FormsSelector';
import { Select, Form } from 'hoi-poi-ui';

import './style.css';

class FormsSelector extends Component {
  state = { selectedForm: null, formValues: {} };

  componentDidMount() {
    this.initWidget();
  }

  initWidget = () => {};

  onFormChange = (formValues, field) => this.setState({ formValues });

  onSelectorChange = (selectedForm) => this.setState({ selectedForm });

  renderSelector() {
    const { schema } = this.props;
    const { selectedForm } = this.state;
    const options = schema.map((form) => {
      return { label: form.title, value: form.id };
    });
    console.log('options', options);

    return (
      <Select
        label="Form Type"
        placeholder="Select one"
        onChange={this.onSelectorChange}
        options={options}
        value={selectedForm}
      />
    );
  }

  renderForm() {
    const { schema } = this.props;
    const { formValues, selectedForm } = this.state;
    const errors = {
      phone: 'Invalid phone',
    };
    const formSchema = schema.filter((form) => form.id === selectedForm.value)[0].schema;
    console.log('formSchema', formSchema);

    return (
      <Form onFormChange={this.onChange} values={formValues} errors={errors} schema={formSchema} />
    );
  }

  render() {
    const { selectedForm } = this.state;

    if (selectedForm) {
      return this.renderForm();
    }
    return this.renderSelector();
  }
}

export default FormsSelector;
