import React from 'react';
import { TimePicker as MaterialTimePicker } from '@material-ui/pickers';

import './style.scss';

function TimePicker({ ...props }) {
  return <MaterialTimePicker format="hh:mm A" invalidDateMessage={null} {...props} value={props.value || null} />;
}

export default TimePicker;
