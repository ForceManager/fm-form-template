import React, { useMemo } from 'react';
import { Input } from 'hoi-poi-ui';

function Number({ ...props }) {
  const overrides = useMemo(
    () => ({
      input: {
        step: 'any',
        onKeyPress: (e) => {
          e = e || window.event;
          const charCode = typeof e.which == 'undefined' ? e.keyCode : e.which;
          const charStr = String.fromCharCode(charCode);
          if (!charStr.match(/^[0-9.]+$/)) return e.preventDefault();
        },
      },
    }),
    [],
  );

  return <Input type="number" placeholder="0.00" overrides={overrides} {...props} />;
}

export default Number;
