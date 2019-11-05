import React from 'react';
import BasePicker from '../BasePicker';
import CONSTANTS from '../../constants';

function DatePicker({ format: formatProp, ...props }) {
  const format = formatProp || CONSTANTS.FORMATS.DATE;

  return <BasePicker pickerType="DatePicker" format={format} {...props} />;
}

export default DatePicker;
