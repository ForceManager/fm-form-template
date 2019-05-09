import React from 'react';
import { HoiPoiProvider } from 'hoi-poi-ui';
import FormSelector from '../components/FormSelector;
import schema from './schema.json';
import './App.css';

function App() {
  return (
    <div className="App">
      <HoiPoiProvider>
        <FormsSelector schema={schema} />
      </HoiPoiProvider>
    </div>
  );
}

export default App;
