import React from 'react';
import { DateTimePicker as MaterialDateTimePicker } from '@material-ui/pickers';

import './style.scss';

function DateTimePicker({ title, signatureImage }) {
  return <MaterialDateTimePicker format="dd/MM/yyyy HH:mm" />;
}

export default DateTimePicker;
