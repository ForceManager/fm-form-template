import React from 'react';
import { DatePicker as MaterialDatePicker } from '@material-ui/pickers';

import './style.scss';

function DatePicker({ ...props }) {
  return <MaterialDatePicker format="DD/MM/YYYY" {...props} />;
}

export default DatePicker;
