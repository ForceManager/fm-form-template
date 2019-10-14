import React, { useState, useEffect } from 'react';
import { DatePicker as MaterialDatePicker } from '@material-ui/pickers';
import moment from 'moment';

import './style.scss';

function DatePicker({ value: valueProp, readOnly, isReadOnly, onChange, ...props }) {
  const initialValue = valueProp ? moment(valueProp, 'MM/DD/YYYY') : null;
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
    onChange(moment(date).format('MM/DD/YYYY'));
  };

  const handleOnClose = () => {
    reset = true;
  };

  return (
    <MaterialDatePicker
      {...props}
      format="MM/DD/YYYY"
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

export default DatePicker;
