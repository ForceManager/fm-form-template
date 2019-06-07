import React from 'react';
import { DatePicker as MaterialDatePicker } from '@material-ui/pickers';

import './style.scss';

function DatePicker({ title, signatureImage }) {
  return <MaterialDatePicker format="dd/MM/yyyy" />;
}

export default DatePicker;
