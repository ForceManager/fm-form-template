// #################################################################### //
// DO NOT MODIFY THIS FILE                                              //
// For custom formats use configs/actions.js -> formatEntityList        //
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

const formatEntityList = (entity, data) => {
  data = Array.isArray(data) ? data : [data];
  return data
    .map((el) => {
      switch (entity) {
        case 'contacts':
          let nameContact = el.name || el.nombre !== undefined ? el.name || el.nombre : '';
          let familyNameContact =
            el.lastName || el.apellidos ? ` ${el.lastName || el.apellidos}` : '';
          return {
            value: el.id,
            label: nameContact + familyNameContact,
          };
        case 'users':
          let nameUser =
            el.name || el.strNombre || el.Nombre ? el.name || el.strNombre || el.Nombre : '';
          let familyNameUser =
            el.lastName || el.strApellidos || el.Apellidos
              ? ` ${el.lastName || el.strApellidos || el.Apellidos}`
              : '';
          return {
            value: el.id,
            label: nameUser + familyNameUser,
          };
        case 'opportunities':
          return {
            value: el.id,
            label: el.reference,
          };
        case 'accounts':
          return {
            value: el.id,
            label: el.name,
          };
        default:
          return el;
      }
    })
    .sort(compare);
};

export default formatEntityList;
