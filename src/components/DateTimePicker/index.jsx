import React from 'react';
import { DateTimePicker as MaterialDateTimePicker } from '@material-ui/pickers';

import './style.scss';

function DateTimePicker({ ...props }) {
  return <MaterialDateTimePicker format="DD/MM/YYYY HH:mm" {...props} />;
}

export default DateTimePicker;
