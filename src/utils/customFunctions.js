import { bridge } from 'fm-bridge';

const customFunctions = {
  photosFunctions: () => {
    console.log('photosFunctions');
    bridge.expandImagesView();
  },
};

export default customFunctions;
