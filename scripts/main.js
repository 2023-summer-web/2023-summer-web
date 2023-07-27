export const canvas = document.getElementById('chartCanvas');
export const ctx = canvas.getContext('2d');

export const canvasContainer = document.getElementById('canvas-container');

export const dataInputTable = document.getElementById('dataInputTable').getElementsByTagName('tbody')[0];

const addRowBtn = document.getElementById('addRowBtn');
const saveChartBtn = document.getElementById("saveChartBtn");

/// Add a new row to the table
addRowBtn.addEventListener('click', () => {
    const lastRow = dataInputTable.lastElementChild;
    const lastYear = lastRow.querySelector('.year').value;
    const defaultValue = (lastYear === '') ? '' : Number(lastYear) + 1;

    // Add a new row
    const newRow = document.createElement('tr');
    newRow.className = 'dataRow';
    newRow.innerHTML = `
        <td><input type="number" class="year" value="${defaultValue}"></td>
        <td><input type="number" class="yield"></td>
        <td><button class="deleteBtn">×</button></td>
    `;
    dataInputTable.appendChild(newRow);

    // Focus on the new row
    newRow.querySelector('.yield').focus();

    // Change the delete button status
    const rows = document.querySelectorAll('.dataRow');
    const deleteButtons = document.querySelectorAll('.deleteBtn');
    deleteButtons.forEach(button => {
        if (rows.length > 1) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
});

saveChartBtn.addEventListener("click", function() {
    const imgURL = canvas.toDataURL("image/png");

    // Create a virtual link element
    const downloadLink = document.createElement("a");
    downloadLink.href = imgURL;
    downloadLink.target = "_blank";

    const filename = prompt("请输入文件名", "chart.png");
    if (filename !== null && filename.trim() !== "") {
        downloadLink.download = filename;
        downloadLink.click();
    }
});
