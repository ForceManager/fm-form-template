import React from 'react';
import { TimePicker as MaterialTimePicker } from '@material-ui/pickers';

import './style.scss';

function TimePicker({ ...props }) {
  return <MaterialTimePicker format="HH:mm" {...props} />;
}

export default TimePicker;
