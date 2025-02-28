import React, { useState } from "react";
import { evaluate } from "mathjs";
import { FaPlusCircle, FaMinusCircle, FaSortAmountDown, FaSortAmountUp, FaHashtag as FaCount, FaSave, FaFolderOpen, FaEdit, FaRegCheckSquare, FaTimesCircle, FaTextHeight, FaSortAlphaDown, FaCut, FaEraser, FaSearch, FaArrowUp, FaArrowDown, FaCaretDown } from "react-icons/fa";
 // Use FaCut instead of FaScissors

import "./spreadSheet.css"

const Spreadsheet = () => {
    const [cells, setCells] = useState(Array(10).fill(null).map(() => Array(10).fill("")));
    const [selectedCell, setSelectedCell] = useState(null);
    const [formula, setFormula] = useState("");
    const [isFormulaMode, setIsFormulaMode] = useState(false);
    const [showDataQualityMenu, setShowDataQualityMenu] = useState(false);

    const handleCellChange = (row, col, value) => {
        const newCells = cells.map((r, i) => r.map((c, j) => (i === row && j === col ? value : c)));
        setCells(newCells);
    };

    const applyFormula = () => {
        if (!selectedCell || formula === "") return;
        try {
            const [row, col] = selectedCell;
            const newCells = [...cells];
            const result = evaluate(formula.replace(/[A-J][1-9]/g, (match) => {
                const r = parseInt(match[1], 10) - 1;
                const c = match.charCodeAt(0) - 65;
                return cells[r][c] || 0;
            }));
            newCells[row][col] = result.toString();
            setCells(newCells);
            setIsFormulaMode(false);
        } catch (error) {
            alert("Error evaluating formula. Please check your formula syntax.");
        }
    };

    const applyMathFunction = (type) => {
        if (!selectedCell) return;
        let values = cells.flat().map(value => parseFloat(value)).filter(value => !isNaN(value));
        if (values.length === 0) return;
        let result = 0;
        switch (type) {
            case "SUM":
                result = values.reduce((acc, val) => acc + val, 0);
                break;
            case "AVG":
                result = values.length ? (values.reduce((acc, val) => acc + val, 0) / values.length) : 0;
                break;
            case "MIN":
                result = Math.min(...values);
                break;
            case "MAX":
                result = Math.max(...values);
                break;
            case "COUNT":
                result = values.length;
                break;
            default:
                return;
        }
        const [targetRow, targetCol] = selectedCell;
        const newCells = [...cells];
        newCells[targetRow][targetCol] = result.toString();
        setCells(newCells);
    };

    const saveSpreadsheet = () => {
        localStorage.setItem("spreadsheetData", JSON.stringify(cells));
        alert("Spreadsheet saved successfully!");
    };

    const loadSpreadsheet = () => {
        const data = localStorage.getItem("spreadsheetData");
        if (data) {
            setCells(JSON.parse(data));
            alert("Spreadsheet loaded successfully!");
        } else {
            alert("No saved spreadsheet found!");
        }
    };

    const applyTextFunction = (type) => {
      if (!selectedCell) return;
      const [row, col] = selectedCell;
      let newValue = cells[row][col];
  
      if (!newValue) return; // Avoid modifying empty cells
  
      switch (type) {
          case "UPPER":
              newValue = newValue.toUpperCase();
              break;
          case "LOWER":
              newValue = newValue.toLowerCase();
              break;
          case "TRIM":
              newValue = newValue.trim(); // ✅ FIX: Trim function now correctly removes extra spaces
              break;
          case "REMOVE_DUPLICATES":
              const uniqueValues = [...new Set(cells.flat())]; // Remove duplicates
              setCells(uniqueValues.map(value => [value])); 
              return;
          case "FIND_REPLACE":
              const findValue = prompt("Enter value to find:");
              const replaceValue = prompt("Enter value to replace with:");
              if (findValue !== null && replaceValue !== null) {
                  newValue = newValue.replace(new RegExp(findValue, "g"), replaceValue);
              }
              break;
          default:
              return;
      }
  
      const newCells = [...cells];
      newCells[row][col] = newValue;
      setCells(newCells);
  };
  

    return (
        <div className="spreadsheet">
                    <div className="toolbar">
                        <button onClick={() => applyTextFunction("UPPER")}><FaArrowUp /> Upper</button>
                        <button onClick={() => applyTextFunction("LOWER")}><FaArrowDown /> Lower</button>
                        <button onClick={() => applyTextFunction("TRIM")}><FaCut /> Trim</button>
                        <button onClick={() => applyTextFunction("REMOVE_DUPLICATES")}><FaEraser /> Remove Duplicates</button>
                        <button onClick={() => applyTextFunction("FIND_REPLACE")}><FaSearch /> Find & Replace</button>
                    
                <button onClick={() => applyMathFunction("SUM")}><FaPlusCircle /> Sum</button>
                <button onClick={() => applyMathFunction("AVG")}><FaMinusCircle /> Average</button>
                <button onClick={() => applyMathFunction("MIN")}><FaSortAmountDown /> Min</button>
                <button onClick={() => applyMathFunction("MAX")}><FaSortAmountUp /> Max</button>
                <button onClick={() => applyMathFunction("COUNT")}><FaCount /> Count</button>
                <button onClick={saveSpreadsheet}><FaSave /> Save</button>
                <button onClick={loadSpreadsheet}><FaFolderOpen /> Load</button>
                <button onClick={() => setIsFormulaMode(true)}><FaEdit /> Enter Formula</button>

                </div>
                

                {isFormulaMode && (
                    <>
                        <input type="text" value={formula} onChange={(e) => setFormula(e.target.value)} placeholder="Enter formula (e.g. A1+B1)" />
                        <button onClick={applyFormula}><FaRegCheckSquare /> Apply Formula</button>
                    </>
                )}
            
            <table>
                <thead>
                    <tr>
                        <th></th>
                        {cells[0].map((_, colIndex) => (
                            <th key={colIndex}>{String.fromCharCode(65 + colIndex)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {cells.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <th>{rowIndex + 1}</th>
                            {row.map((cell, colIndex) => (
                                <td key={colIndex} className="cell-container">
                                    <input
                                        value={cell}
                                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                        onClick={() => setSelectedCell([rowIndex, colIndex])}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Spreadsheet;
