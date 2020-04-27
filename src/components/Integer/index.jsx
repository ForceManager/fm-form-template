import React, { useMemo } from 'react';
import { Input } from 'hoi-poi-ui';

function Integer({ ...props }) {
  const overrides = useMemo(
    () => ({
      input: {
        onKeyPress: (e) => {
          e = e || window.event;
          const charCode = typeof e.which == 'undefined' ? e.keyCode : e.which;
          const charStr = String.fromCharCode(charCode);
          if (!charStr.match(/^[0-9]+$/)) e.preventDefault();
        },
      },
    }),
    [],
  );

  return <Input type="number" placeholder="0" overrides={overrides} {...props} />;
}

export default Integer;
