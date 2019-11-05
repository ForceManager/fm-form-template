import React from 'react';
import BasePicker from '../BasePicker';
import CONSTANTS from '../../constants';

function TimePicker({ format: formatProp, minutesStep: minutesStepProp, ...props }) {
  const format = formatProp || CONSTANTS.FORMATS.TIME;
  const minutesStep = minutesStepProp || 30;

  return (
    <BasePicker pickerType="TimePicker" format={format} minutesStep={minutesStep} {...props} />
  );
}

export default TimePicker;
