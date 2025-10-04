// Chakri did this
const convertToCSV = (objArray: any) => {
  console.log({ objArray });
  const array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  let str = "";

  // Get only the cols that have non-object values
  const cols = Object.keys(array[0])
    .filter((key) =>
      array.every(
        (item: any) => item[key] === null || typeof item[key] !== "object"
      )
    )
    .toSorted();

  str += cols.map((col) => `"${col}"`).join(",") + "\r\n";

  for (let i = 0; i < array.length; i++) {
    let line = "";
    for (let index in cols) {
      if (line != "") line += ",";

      line += `"${array[i][cols[index]]}"`;
    }

    str += line + "\r\n";
  }

  return str;
};

const downloadTable = async (data: any) => {
  const csvdata = convertToCSV(data);
  const blob = new Blob([csvdata], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "joborder.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export default downloadTable;
