import moment from 'moment';
import { bridge } from 'fm-bridge';
// import config from '../configs/config.json';
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
        idFormType: data.form.idFormType,
        idState: states[0].id,
        endState: 0,
        selectedForm: null,
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
    initData = {
      formData: {
        ...data.form,
      },
      generalData: {
        account: data.account,
        user: data.user,
        mode: data.mode,
        isReadonly: data.isReadonly || false,
        states,
      },
    };
  }
  return initData;
};

export default formatInitData;
