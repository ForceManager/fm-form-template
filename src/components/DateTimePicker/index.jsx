import React from 'react';
import BasePicker from '../BasePicker';
import CONSTANTS from '../../constants';

function DateTimePicker({ format: formatProp, minutesStep: minutesStepProp, ...props }) {
  const format = formatProp || CONSTANTS.FORMATS.DATE_TIME;
  const minutesStep = minutesStepProp || 30;

  return (
    <BasePicker pickerType="DateTimePicker" format={format} minutesStep={minutesStep} {...props} />
  );
}

export default DateTimePicker;
