import React, { useState, useEffect, useCallback } from 'react';
import { DatePicker } from '@material-ui/pickers';
import { TimePicker } from '@material-ui/pickers';
import { DateTimePicker } from '@material-ui/pickers';
import moment from 'moment';

function BasePicker({
  pickerType,
  value: valueProp,
  readOnly,
  isReadOnly,
  onChange,
  format,
  minutesStep,
  ...props
}) {
  const [value, setValue] = useState(valueProp ? moment(valueProp, format) : null);
  const [prevValue, setPrevValue] = useState(null);
  const [reset, setReset] = useState(false);

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
        setReset(false);
      } else {
        setValue(date);
      }
    },
    [reset, prevValue],
  );

  const handleOnAccept = useCallback(
    (date) => {
      setValue(date);
      onChange(moment(date).format(format));
    },
    [format, onChange],
  );

  const handleOnClose = useCallback(() => {
    setReset(true);
  }, []);

  const components = {
    DatePicker,
    TimePicker,
    DateTimePicker,
  };

  const Component = components[pickerType];

  return (
    <Component
      {...props}
      format={format.replace('HH', 'hh')}
      minutesStep={minutesStep}
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

export default BasePicker;
