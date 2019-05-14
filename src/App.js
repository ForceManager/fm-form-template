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
    selectedForm:
      Object.keys(schema).length > 1
        ? null
        : { name: schema[Object.keys(schema)[0]].title, value: Object.keys(schema)[0] },
    formValues: {},
  };

  componentDidMount() {
    this.getFormInitData()
      .then((res) => {
        return this.setDefaultValues(res.data);
      })
      .then((res) => {
        console.log('setDefaultValues', res);
        this.setState({ ...this.state, ...res });
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  getFormInitData() {
    //TEMP
    return new Promise((resolve, reject) => {
      try {
        let data = JSON.parse(
          '{"company":{"agendaMetadata":"","calificacion":"","cif":"","countContacto":-1,"countExpediente":-1,"countGestiones":-1,"countOfertas":-1,"distancia":"0","email":"","email2":"","email3":"","entorno":"Sales","extId":"","fax":"","idCalificacion":-1,"idEstadoEmpresa":-1,"idresponsable":101,"identorno":16,"idTarifa":0,"idTipoEmpresa":40,"idWarning":-1,"idresponsable2":-1,"idresponsable3":-1,"idresponsable4":-1,"idresponsable5":-1,"intgeoaccuracy":0,"isActiveWarning":false,"followingItem":-1,"blnReadOnly":false,"lastAccuracy":0,"lastActivityDate":0,"lastCheckinDate":"","lastUserCheckinDate":"","lastDistance":0,"logo":"-1","movil":"","nombre":"Test","numAgenda":"0","observaciones":"","relation":{"id":-1,"isDeleted":0,"pendingCrud":0,"relationType":0,"serverOrder":-1,"sqlId":-1,"updateTime":-1,"uuid":"a9224ab2-c973-47bc-97fb-62a510acb8d6"},"responsable":"Test Marchesiniusa","responsable2":"","responsable3":"","responsable4":"","responsable5":"","strSearchField":"TestBarcelonaBarcelona08034CarrerdeJosepIrlaiBosch,1","strPoblacion":"Barcelona","strProvincia":"Barcelona","tel":"","tel2":"","tipoEmpresa":"Other","web":"","country":"España","cp":"08034","direccion":"Carrer de Josep Irla i Bosch, 1","idCountry":73,"mLatitude":"41.3912239","mLongitude":"2.12918568","poblacion":"Barcelona","provincia":"Barcelona","fcreado":"14\\/05\\/2019 15:23:46","fmodificado":"","id":2323,"isDeleted":0,"pendingCrud":0,"serverOrder":-1,"sqlId":995,"symbolCurrency":"$","updateTime":1557841895141,"uuid":"a9224ab2-c973-47bc-97fb-62a510acb8d6"},"user":{"username":"test@marchesiniusa","userId":101,"name":"Test","lang":"es","langDB":"es","locale":"es-ES"},"idPreSelectedFormType":1,"entityFormExtraFields":"[]","isReadonly":false,"mode":"creation","imei":"867560031532166"}',
        );
        resolve({ data });
      } catch (error) {
        reject(error);
      }
      resolve({ data: 'cacota' });
    });
  }

  setSelectors(formInitData) {
    return new Promise((resolve, reject) => {
      let state = { formInitData };
      state.formValues = {
        0: { customer: formInitData.company.nombre, serviceEngineer: formInitData.user.name },
      };
      resolve(state);
    });
  }

  setDefaultValues(formInitData) {
    return new Promise((resolve, reject) => {
      let state = { formInitData };
      state.formValues = {
        0: { customer: formInitData.company.nombre, serviceEngineer: formInitData.user.name },
      };
      resolve(state);
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

  render() {
    const { formInitData, formValues, selectedForm } = this.state;

    console.log('this.state', this.state);

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
