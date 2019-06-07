import React from 'react';
import { TimePicker as MaterialTimePicker } from '@material-ui/pickers';

import './style.scss';

function TimePicker({ title, signatureImage }) {
  return <MaterialTimePicker format="HH:mm" />;
}

export default TimePicker;
