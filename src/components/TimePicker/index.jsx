import React, { useState, useEffect } from 'react';
import { TimePicker as MaterialTimePicker } from '@material-ui/pickers';
import moment from 'moment';

import './style.scss';

function TimePicker({ value: valueProp, readOnly, isReadOnly, onChange, ...props }) {
  const initialValue = valueProp ? moment(valueProp, 'HH:mm A') : null;
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
    onChange(moment(date).format('HH:mm A'));
  };

  const handleOnClose = () => {
    reset = true;
  };

  return (
    <MaterialTimePicker
      {...props}
      format="hh:mm A"
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

export default TimePicker;
