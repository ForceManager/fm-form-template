import React, { PureComponent } from 'react';
// import { bridge } from 'fm-bridge';
import FormSelector from './components/FormSelector';
import FormEdit from './components/FormEdit';
import FormSummary from './components/FormSummary';
import schema from './schema.json';
import './App.css';

class App extends PureComponent {
  state = {
    formInitData: null,
    selectedForm: null,
    formValues: [],
  };

  getFormInitData() {
    return new Promise((resolve) => {
      resolve({ data: 'cacota' });
    });
  }

  onSelectorChange = (value) => this.setState({ selectedForm: value });

  onFormChange = (values, field) => {
    console.log('onFormChange', values, field);
    // this.setState({
    //   formValues: [...this.state.formValues, this.state.formValues[selectedForm]: values,
    // });
  };

  componentDidMount() {
    this.getFormInitData()
      .then((res) => {
        this.setState({ formInitData: res.data });
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  render() {
    const { formInitData, formValues, selectedForm } = this.state;

    console.log('formValues', formValues);

    if (formInitData && !selectedForm) {
      return (
        <FormSelector
          schema={schema}
          selectedForm={selectedForm}
          onChange={this.onSelectorChange}
        />
      );
    } else if (formInitData && selectedForm) {
      const formSchema = schema.filter((form) => form.id === selectedForm.value)[0].schema;
      console.log('formSchema', formSchema);

      return <FormEdit schema={formSchema} values={formValues} onChange={this.onFormChange} />;
    } else {
      return <FormSummary values={formValues} />;
    }
  }
}

export default App;
