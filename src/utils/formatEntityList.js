const formatEntityList = (entity, data) => {
  data = Array.isArray(data) ? data : [data];
  return data.map((el) => {
    switch (entity) {
      case 'contacts':
        return {
          value: el.id,
          label: `${el.firstName || el.nombre} ${el.lastName || el.apellidos}`,
        };
      case 'users':
        return {
          value: el.id,
          label:
            el.name ||
            el.strNombre +
              (el.lastName || el.strApellidos ? ` ${el.lastName || el.strApellidos}` : ''),
        };
      case 'opportunities':
        return {
          value: el.id,
          label: el.reference,
        };
      default:
        return el;
    }
  });
};

export default formatEntityList;
