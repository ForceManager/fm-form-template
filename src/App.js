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
    formValues: {},
  };

  getFormInitData() {
    return new Promise((resolve) => {
      resolve({ data: 'cacota' });
    });
  }

  onSelectorChange = (value) => this.setState({ selectedForm: value });

  onFormChange = (values, field, currentPage) => {
    const { formValues } = this.state;

    console.log('onFormChange', values, field, currentPage);
    this.setState({
      formValues: { ...formValues, [currentPage]: values },
    });
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
      const formSchema = schema[selectedForm.value].schema;
      console.log('formSchema', formSchema);

      return <FormEdit schema={formSchema} values={formValues} onChange={this.onFormChange} />;
    } else {
      return <FormSummary values={formValues} />;
    }
  }
}

export default App;
