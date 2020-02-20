// #################################################################### //
// DO NOT MODIFY THIS FILE                                              //
// For custom formats use configs/actions.js -> formatValueList        //
// #################################################################### //

function compare(a, b) {
  if (a.label < b.label) {
    return -1;
  }
  if (a.label > b.label) {
    return 1;
  }
  return 0;
}

const formatValueList = (table, data) => {
  data = Array.isArray(data) ? data : [data];
  return data
    .map((el) => {
      switch (table) {
        case 'tblCountries':
          return {
            value: el.id,
            label: el.strName,
          };
        default:
          return el;
      }
    })
    .sort(compare);
};

export default formatValueList;
