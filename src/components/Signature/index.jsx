import React from 'react';
import { Button } from 'hoi-poi-ui';
import { bridge } from 'fm-bridge';

import './style.scss';

function Signature({ title, value, onChange }) {
  const onClickSign = () => {
    bridge
      .openSignatureView()
      .then((res) => {
        console.log('openSignatureView res', res);
        onChange(res);
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  return (
    <div className="signature">
      <div className="signature-title">{title}</div>
      <div className="signature-image-container">
        {value && <img className="signature-image" src={`data:image/png;base64,${value}`} />}
      </div>

      <Button className="signature-button" color="primary" onClick={onClickSign}>
        SIGN
      </Button>
    </div>
  );
}

export default Signature;
