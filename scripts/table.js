import { canvas, addRowBtn, saveChartBtn, dataInputTable } from './main.js'
import { drawChart } from './draw.js';

const noDataTip = document.getElementById('no-data-tip');

/// Add a new row to the table
addRowBtn.addEventListener('click', () => {
    const lastRow = dataInputTable.lastElementChild;
    const lastYear = lastRow.querySelector('.year').value;
    const defaultValue = (lastYear === '') ? '' : Number(lastYear) + 1;

    // Add a new row
    const newRow = document.createElement('tr');
    newRow.className = 'data-row';
    newRow.innerHTML = `
        <td><input type="number" class="year" value="${defaultValue}"></td>
        <td><input type="number" class="yield"></td>
        <td><button class="delete-button">×</button></td>
    `;
    dataInputTable.appendChild(newRow);

    // Focus on the new row
    newRow.querySelector('.yield').focus();

    // Change the delete button status
    const rows = document.querySelectorAll('.data-row');
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        if (rows.length > 1) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
});

/// Delete a row from the table
dataInputTable.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-button') && !event.target.classList.contains('disabled')) {
        const row = event.target.parentNode.parentNode;
        row.remove();

        // Change the delete button status
        const rows = document.querySelectorAll('.data-row');
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            if (rows.length > 1) {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });

        // Redraw the chart
        drawChart();
    }
});

/// Save the chart as a png image to local disk
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

function checkNoData() {
    let allHidden = true;
    const rows = document.querySelectorAll('.data-row');
    rows.forEach(row => {
        if (row.style.display !== 'none') {
            allHidden = false;
        }
    });
    return allHidden;
}

export function checkNoDataTip() {
    if (checkNoData()) {
        noDataTip.style.display = 'table-row';
    } else {
        noDataTip.style.display = 'none';
    }
}