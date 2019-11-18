import { createHoiPoiTheme } from 'hoi-poi-ui';

const hoiPoiTheme = createHoiPoiTheme({
  overrides: {
    Input: {
      formControl: {
        flex: 1,
      },
    },
    Section: {
      backgroundColor: 'red',
      root: {
        backgroundColor: 'blue',
      },
      '&signatures': {
        Input: {
          postComponent: {
            position: 'absolute',
            top: 10,
            left: 10,
          },
          postCloseComponent: {
            height: 15,
            width: 15,
          },
        },
      },
    },
  },
  props: {},
});

export default hoiPoiTheme;
