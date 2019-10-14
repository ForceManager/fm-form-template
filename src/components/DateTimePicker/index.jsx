import React, { useState, useEffect } from 'react';
import { DateTimePicker as MaterialDateTimePicker } from '@material-ui/pickers';
import moment from 'moment';

import './style.scss';

function DateTimePicker({ value: valueProp, readOnly, isReadOnly, onChange, ...props }) {
  const initialValue = valueProp ? moment(valueProp, 'MM/DD/YYYY HH:mm A') : null;
  const [value, setValue] = useState(initialValue);
  const [prevValue, setPrevValue] = useState(null);
  let reset = false;

  useEffect(() => {
    if (!valueProp) {
      setValue(null);
    }
  }, [valueProp]);

  const handleOnOpen = () => {
    setPrevValue(value);
  };

  const handleOnChange = (date) => {
    if (reset) {
      setValue(prevValue);
      reset = false;
    } else {
      setValue(date);
    }
  };

  const handleOnAccept = (date) => {
    setValue(date);
    onChange(moment(date).format('MM/DD/YYYY HH:mm A'));
  };

  const handleOnClose = () => {
    reset = true;
  };

  return (
    <MaterialDateTimePicker
      {...props}
      format="MM/DD/YYYY hh:mm A"
      minutesStep={30}
      invalidDateMessage={null}
      onOpen={handleOnOpen}
      onChange={handleOnChange}
      onAccept={handleOnAccept}
      onClose={handleOnClose}
      value={value}
      disabled={isReadOnly || readOnly}
    />
  );
}

export default DateTimePicker;
