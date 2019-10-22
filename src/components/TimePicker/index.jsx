import React from 'react';
import BasePicker from '../BasePicker';

function TimePicker({ format: formatProp, minutesStep: minutesStepProp, ...props }) {
  const format = formatProp || 'HH:mm A';
  const minutesStep = minutesStepProp || 30;

  return (
    <BasePicker pickerType="TimePicker" format={format} minutesStep={minutesStep} {...props} />
  );
}

export default TimePicker;
