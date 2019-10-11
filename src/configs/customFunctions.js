import { bridge } from 'fm-bridge';

const customFunctions = {
  photosFunctions: () => {
    bridge.expandImagesView();
  },
};

export default customFunctions;
