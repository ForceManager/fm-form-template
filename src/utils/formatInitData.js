import moment from 'moment';
import { bridge } from 'fm-bridge';
import CONSTANTS from '../constants';

const formatInitData = (data, statesList) => {
  let initData;
  if (data.mode === 'creation') {
    bridge.setTitle('Aggiunta prodotto');
    initData = {
      formData: {
        formObject: {
          fechaCreacion: moment().format(CONSTANTS.FORMATS.DATE_TIME),
          userCreacion: data.user.id,
        },
        idFormType: data.form.idFormType,
        idState: null,
        endState: null,
        selectedForm: null,
      },
      generalData: {
        account: data.account,
        user: data.user,
        mode: data.mode,
        platform: data.platform,
        isReadonly: data.isReadonly || false,
        idPreSelectedFormType: data.idPreSelectedFormType,
        imei: data.imei,
        statesList,
      },
    };
  } else if (data.mode === 'edition') {
    if (data.form.endState) {
      bridge.setTitle('Form summary');
    } else {
      bridge.setTitle('Modifica prodotto');
    }
    initData = {
      formData: {
        ...data.form,
      },
      generalData: {
        account: data.account,
        user: data.user,
        mode: data.mode,
        platform: data.platform,
        isReadonly: data.isReadonly || false,
        statesList,
      },
    };
  }
  return initData;
};

export default formatInitData;
