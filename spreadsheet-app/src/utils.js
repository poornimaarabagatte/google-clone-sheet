export const getSelectedRange = (cells, selectedCells) => {
    let values = [];
    selectedCells.forEach(({ row, col }) => {
        const cellId = `${row}-${col}`;
        values.push(cells[cellId] || 0);
    });
    return values;
};
