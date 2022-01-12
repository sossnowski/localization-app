module.exports.filterLocalizationsByCoordinates = (
  allLocalizations,
  extent
) => {
  const ROWS = 5;
  const COLS = 4;
  const resultArray = {};
  const finalArray = [];
  const xDelta =
    Math.abs(extent.a.split(',')[0] - extent.b.split(',')[0]) / COLS;
  const yDelta =
    Math.abs(extent.a.split(',')[1] - extent.c.split(',')[1]) / ROWS;
  for (const loc of allLocalizations) {
    const firstIndex = Math.round(
      Math.abs(extent.a.split(',')[0] - loc.geometry.coordinates[0]) / xDelta
    );
    const secondIndex = Math.round(
      Math.abs(extent.a.split(',')[1] - loc.geometry.coordinates[1]) / yDelta
    );
    if (!resultArray[firstIndex]) {
      resultArray[firstIndex] = {};
      resultArray[firstIndex][secondIndex] = loc;
      finalArray.push({ ...loc, numberOfPlaces: 1 });
    } else if (!resultArray[firstIndex][secondIndex]) {
      resultArray[firstIndex][secondIndex] = loc;
      finalArray.push({ ...loc, numberOfPlaces: 1 });
    } else if (resultArray[firstIndex][secondIndex]) {
      finalArray.map((elem) =>
        elem.uid === resultArray[firstIndex][secondIndex].uid
          ? { ...elem, numberOfPlaces: (elem.numberOfPlaces += 1) }
          : elem
      );
    }
  }

  return finalArray;
};
