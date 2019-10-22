import React from 'react';
import BasePicker from '../BasePicker';

function DateTimePicker({ format: formatProp, minutesStep: minutesStepProp, ...props }) {
  const format = formatProp || 'MM/DD/YYYY HH:mm A';
  const minutesStep = minutesStepProp || 30;

  return (
    <BasePicker pickerType="DateTimePicker" format={format} minutesStep={minutesStep} {...props} />
  );
}

export default DateTimePicker;
