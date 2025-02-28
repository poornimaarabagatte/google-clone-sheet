import Spreadsheet from "./spreadSheet";

function trimCellValue(value) {
    return value.trim();
  }
  
  function upperCaseCellValue(value) {
    return value.toUpperCase();
  }
  
  function lowerCaseCellValue(value) {
    return value.toLowerCase();
  }
  
  function removeDuplicates(sheetData) {
    const uniqueRows = [];
    const seen = new Set();
    
    sheetData.forEach((row) => {
      const rowString = JSON.stringify(row);
      if (!seen.has(rowString)) {
        seen.add(rowString);
        uniqueRows.push(row);
      }
    });
    
    return uniqueRows;
  }
  
  function findAndReplace(sheetData, findText, replaceText) {
    return sheetData.map(row =>
      row.map(cell => (cell === findText ? replaceText : cell))
    );
  }
  
  export { trimCellValue, upperCaseCellValue, lowerCaseCellValue, removeDuplicates, findAndReplace };
  