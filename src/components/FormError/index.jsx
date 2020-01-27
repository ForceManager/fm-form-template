import React from 'react';
import { Text, Icon } from 'hoi-poi-ui';

import './style.scss';

function FormError({ ...props }) {
  return (
    <div className="form-error">
      <Icon name="warning" className="form-error-icon" />
      <Text className="form-error-text">Error</Text>
    </div>
  );
}

export default FormError;
