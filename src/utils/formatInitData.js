import moment from 'moment';
import { bridge } from 'fm-bridge';
import config from '../configs/config.json';
import CONSTANTS from '../constants';

const formatInitData = (data, states) => {
  let initData;
  if (data.mode === 'creation') {
    bridge.setTitle('Form creation');
    initData = {
      formData: {
        formObject: {
          fechaCreacion: moment().format(CONSTANTS.FORMATS.DATE_TIME),
          userCreacion: data.user.id,
        },
        idFormType: null,
        idState: CONSTANTS.STATE.DRAFT,
        endState: 0,
      },
      generalData: {
        account: data.account,
        user: data.user,
        mode: data.mode,
        isReadonly: data.isReadonly || false,
        idPreSelectedFormType: data.idPreSelectedFormType,
        imei: data.imei,
        states,
      },
    };
  } else if (data.mode === 'edition') {
    bridge.setTitle('Form edition');
    let selectedFormValue = Object.keys(config.formSchema).find(
      (key) => data.form.idFormType === config.formSchema[key].id,
    );
    let selectedForm = {
      label: config.formSchema[selectedFormValue].title,
      value: selectedFormValue,
    };
    initData = {
      formData: {
        ...data.form,
      },
      generalData: {
        account: data.account,
        user: data.user,
        mode: data.mode,
        isReadonly: data.isReadonly || false,
        selectedForm,
        states,
      },
    };
  }
  return initData;
};

export default formatInitData;
