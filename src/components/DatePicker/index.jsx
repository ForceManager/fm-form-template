import React, { useState, useEffect, useCallback } from 'react';
import { DatePicker as MaterialDatePicker } from '@material-ui/pickers';
import moment from 'moment';

import './style.scss';

function DatePicker({
  value: valueProp,
  readOnly,
  isReadOnly,
  onChange,
  format: formatProp,
  ...props
}) {
  const format = formatProp || 'MM/DD/YYYY';
  const [value, setValue] = useState(valueProp ? moment(valueProp, format) : null);
  const [prevValue, setPrevValue] = useState(null);
  let reset = false;

  useEffect(() => {
    if (!valueProp) {
      setValue(null);
    }
  }, [valueProp]);

  const handleOnOpen = useCallback(() => {
    setPrevValue(value);
  }, [value]);

  const handleOnChange = useCallback(
    (date) => {
      if (reset) {
        setValue(prevValue);
        reset = false;
      } else {
        setValue(date);
      }
    },
    [prevValue],
  );

  const handleOnAccept = useCallback(
    (date) => {
      setValue(date);
      onChange(moment(date).format(format));
    },
    [format, onChange],
  );

  const handleOnClose = () => {
    reset = true;
  };

  return (
    <MaterialDatePicker
      {...props}
      format={format}
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
