export const canvas = document.getElementById('chartCanvas');
export const ctx = canvas.getContext('2d');

export const dataInputTable = document.getElementById('dataInputTable').getElementsByTagName('tbody')[0];
export const drawChartBtn = document.getElementById('drawChartBtn');

export const histogramChoice = document.getElementById('histogram');
export const curveChoice = document.getElementById('curve');

const addRowBtn = document.getElementById('addRowBtn');

/// Add a new row to the table
addRowBtn.addEventListener('click', () => {
    const lastRow = dataInputTable.lastElementChild;
    const lastYear = lastRow.querySelector('.year').value;
    const defaultValue = (lastYear === '') ? '' : Number(lastYear) + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'dataRow';
    newRow.innerHTML = `
        <td><input type="number" class="year" value="${defaultValue}"></td>
        <td><input type="number" class="yield"></td>
    `;
    dataInputTable.appendChild(newRow);
});
