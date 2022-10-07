import moment from 'moment';
import { bridge } from 'fm-bridge';
import CONSTANTS from '../constants';

const formatInitData = (data, statesList, literals) => {
  let initData;
  if (data.mode === 'creation') {
    bridge.setTitle(literals.formCeation || 'Form creation');
    initData = {
      formData: {
        formObject: {
          fechaCreacion: moment().format(CONSTANTS.FORMATS.DATE_TIME),
          userCreacion: data.user.id,
        },
        idFormType: data.idFormType || data.form.idFormType || data.idPreSelectedFormType,
        idFormSubtype: null,
        idState: null,
        endState: null,
      },
      generalData: {
        account: data.account,
        user: data.user,
        mode: data.mode,
        platform: data.platform,
        isReadonly: data.isReadonly || false,
        imei: data.imei,
        statesList,
      },
      selectedForm: null,
    };
  } else if (data.mode === 'edition') {
    if (data.form.endState) {
      bridge.setTitle(literals.formSummary || 'Form summary');
    } else {
      bridge.setTitle(literals.formEdition || 'Form edition');
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
