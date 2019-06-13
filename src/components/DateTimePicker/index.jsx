import React from 'react';
import { DateTimePicker as MaterialDateTimePicker } from '@material-ui/pickers';

import './style.scss';

function DateTimePicker({ ...props }) {
  return <MaterialDateTimePicker format="DD/MM/YYYY hh:mm A" invalidDateMessage={null} {...props}  value={props.value || null}/>;
}

export default DateTimePicker;
