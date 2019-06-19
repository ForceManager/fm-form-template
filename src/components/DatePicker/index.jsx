import React from 'react';
import { DatePicker as MaterialDatePicker } from '@material-ui/pickers';

import './style.scss';

function DatePicker({ ...props }) {
  return (
    <MaterialDatePicker
      format="MM/DD/YYYY"
      invalidDateMessage={null}
      {...props}
      value={props.value || null}
    />
  );
}

export default DatePicker;
