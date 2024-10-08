const axios = require('axios');

module.exports.filterLocalizationsByCoordinates = (
  allLocalizations,
  extent
) => {
  const ROWS = 14;
  const COLS = 8;
  const resultArray = {};
  const finalArray = [];
  const xDelta = Math.abs(extent.minX - extent.maxX) / COLS;
  const yDelta = Math.abs(extent.maxY - extent.minY) / ROWS;
  for (const loc of allLocalizations) {
    const firstIndex = Math.round(
      Math.abs(extent.minX - loc.geometry.coordinates[0]) / xDelta
    );
    const secondIndex = Math.round(
      Math.abs(extent.maxY - loc.geometry.coordinates[1]) / yDelta
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

module.exports.filterLocalizationsByCoordinatesMobile = (
  allLocalizations,
  extent
) => {
  const ROWS = 12;
  const COLS = 6;
  const resultArray = {};
  const finalArray = [];
  const xDelta = Math.abs(extent.minX - extent.maxX) / COLS;
  const yDelta = Math.abs(extent.maxY - extent.minY) / ROWS;
  for (const loc of allLocalizations) {
    const firstIndex = Math.round(
      Math.abs(extent.minX - loc.geometry.coordinates[0]) / xDelta
    );
    const secondIndex = Math.round(
      Math.abs(extent.maxY - loc.geometry.coordinates[1]) / yDelta
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

module.exports.getLocalizationNameByCoordinates = async (coordinates) => {
  const result = await axios.get(
    `https://photon.komoot.io/reverse?lon=${coordinates[0]}&lat=${coordinates[1]}`
  );

  return (
    result.data.features[0]?.properties?.city ||
    result.data.features[0]?.properties?.name ||
    null
  );
};
