import React, { useState } from "react";
import Spreadsheet from "./spreadSheet";
import "./spreadSheet.css"


const SpreadSheetComponent = () => {
    const [sheet] = useState(new Spreadsheet(10, 5));
    const [cells, setCells] = useState({});

    // Handle input change in cells
    const handleInputChange = (row, col, event) => {
        const value = event.target.value;
        sheet.setCell(row, col, value);
        setCells({ ...cells, [sheet.getCellRef(row, col)]: sheet.getCellValue(sheet.getCellRef(row, col)) });
    };

    // Render spreadsheet table
    const renderTable = () => {
        return (
            <table border="1">
                <thead>
                    <tr>
                        <th></th>
                        {[...Array(5)].map((_, col) => (
                            <th key={col}>{String.fromCharCode(65 + col)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...Array(10)].map((_, row) => (
                        <tr key={row}>
                            <td><b>{row + 1}</b></td>
                            {[...Array(5)].map((_, col) => {
                                console.log(`Rendering Cell: Row ${row}, Col ${col}`);
                                return(
                                <td key={col}>
                                    <input 
                                        type="text"
                                        value={cells[sheet.getCellRef(row, col)] || ""}
                                        onChange={(e) => handleInputChange(row, col, e)}
                                    />
                                </td>
                            );
                         })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div>
            <h2>Google Sheets Clone</h2>
            <div className="spreadsheet-container">
            </div>
            {renderTable()}
            <button onClick={() => {
                sheet.removeDuplicates("A1:A10");
                setCells({ ...cells });
            }}>
                Remove Duplicates
            </button>
            <button onClick={() => {
                sheet.findAndReplace("A1:A10", "old", "new");
                setCells({ ...cells });
            }}>
                Find & Replace
            </button>
        </div>
    );
};

export default SpreadSheetComponent;
