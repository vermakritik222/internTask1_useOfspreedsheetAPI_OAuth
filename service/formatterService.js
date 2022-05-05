exports.data_formatter = (data) => {
  const doc = {};

  for (let i = 0; i < data.sheets?.length; i++) {
    const arr = [];
    const sheet = data.sheets[i].data;

    for (let j = 0; j < sheet?.length; j++) {
      const rowData = sheet[j].rowData;

      for (let k = 0; k < rowData?.length; k++) {
        const obj = {};
        const el = rowData[k].values;
        if (el === undefined) {
          arr.push(obj);

          continue;
        }

        for (let p = 0; p < el.length; p++) {
          const item = el[p];
          if (Object.keys(item).length === 0) {
            obj[`${p}`] = "";
            continue;
          }

          let val = item[Object.keys(item)[0]];
          val = val[Object.keys(val)[0]];

          obj[`${p}`] = val;
        }
        arr.push(obj);
      }
    }
    doc[`sheet_id_${i}`] = arr;
  }

  return doc;
};

exports.convertColumn = (num) => {
  let s = "",
    t;

  while (num > 0) {
    t = (num - 1) % 26;
    s = String.fromCharCode(65 + t) + s;
    num = ((num - t) / 26) | 0;
  }
  return s || undefined;
};
