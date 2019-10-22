import React from 'react';
import BasePicker from '../BasePicker';

function DatePicker({ format: formatProp, ...props }) {
  const format = formatProp || 'MM/DD/YYYY';

  return <BasePicker pickerType="DatePicker" format={format} {...props} />;
}

export default DatePicker;
