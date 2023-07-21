const canvas = document.getElementById('chartCanvas');
const ctx = canvas.getContext('2d');

const dataInputTable = document.getElementById('dataInputTable').getElementsByTagName('tbody')[0];
const addRowBtn = document.getElementById('addRowBtn');
const drawChartBtn = document.getElementById('drawChartBtn');

const xAxisLeftPostion = [50, canvas.height - 50]; // X-axis left point position
const xAxisRightPostion = [canvas.width - 50, canvas.height - 50]; // X-axis right point position
const yAxisTopPostion = [50, 50]; // Y-axis top point position
const yAxisBottomPostion = [50, canvas.height - 50]; // Y-axis bottom point position

const xAxisStartSpacing = 10; // Spacing between the first tick and the Y-axis
const xAxisSpacing = 60; // X-axis tick spacing
const yAxisSpacing = 60; // Y-axis tick spacing

const xAxisLineHeight = 20; // X-axis tick line height

const barWidth = 30; // Bar width
const barHeightPerUnit = 10; // Bar height per unit of yield

const pointRadius = 5; // Point radius

const barColor = '#4693E0';
const curveColor = '#39C5BB'; // The representative color of YOU-KNOW-WHO

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

drawChartBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get data from table
    const dataRows = dataInputTable.getElementsByClassName('dataRow');
    const data = [];

    for (const row of dataRows) {
        const year = row.querySelector('.year').value;
        const yield = row.querySelector('.yield').value;
        if (year === '' || yield === '') {
            continue;
        } else {
            data.push([Number(year), Number(yield)]);
        }
    }

    // Ratio statistics
    const yAxisLength = yAxisBottomPostion[1] - yAxisTopPostion[1];
    const yieldSum = data.reduce((sum, d) => sum + d[1], 0);
    let maxRatio = 0.0;
    for (const d of data) {
        const ratio = d[1] / yieldSum;
        if (ratio > maxRatio) {
            maxRatio = ratio;
        }
    }

    console.log(data);

    // Draw axes and Y-ticks
    drawAxes();
    drawYAxisTicks(data);


    // Draw the histogram
    for (let i = 0; i < data.length; i++) {
        const year = data[i][0];
        const yield = data[i][1];

        const pointX = xAxisLeftPostion[0] + xAxisStartSpacing + (i * xAxisSpacing);
        const pointY = xAxisLeftPostion[1];
        const barHeight = yield * barHeightPerUnit;

        // Draw the bar
        ctx.fillStyle = barColor;
        ctx.fillRect(pointX, pointY, barWidth, -barHeight);

        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.font = '14px Arial';

        // Show the value
        ctx.fillText(yield, pointX + barWidth / 2, pointY - barHeight - xAxisLineHeight / 2);

        // Show the year
        ctx.fillText(year, pointX + barWidth / 2, pointY + xAxisLineHeight);
    }

    // Draw the curve
    for (let i = 0; i < data.length; i++) {
        const yield = data[i][1];
        const yieldRatio = yield / yieldSum;

        const pointX = xAxisLeftPostion[0] + xAxisStartSpacing + (i * xAxisSpacing) + barWidth / 2;
        const pointY = xAxisLeftPostion[1] - (yieldRatio / maxRatio) * yAxisLength;

        // Draw the point
        drawSolidCircle(pointX, pointY, pointRadius, curveColor);

        // Show the value in the form of ratio
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.font = '14px Arial';
        ctx.fillText((yieldRatio * 100).toFixed(0) + '%', pointX, pointY - pointRadius - xAxisLineHeight / 2);
    }

    ctx.beginPath();
    ctx.strokeStyle = curveColor;
    ctx.lineWidth = 2;
    for (let i = 0; i < data.length; i++) {
        const yield = data[i][1];
        const yieldRatio = yield / yieldSum;

        const pointX = xAxisLeftPostion[0] + xAxisStartSpacing + (i * xAxisSpacing) + barWidth / 2;
        const pointY = xAxisLeftPostion[1] - (yieldRatio / maxRatio) * yAxisLength;

        if (i === 0) {
            ctx.moveTo(pointX, pointY);
        } else {
            ctx.lineTo(pointX, pointY);
        }
    }
    ctx.stroke();

    // Draw the labels of axes
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.font = '14px Arial';
    const yieldInfo = "产量\n（万吨）"; // TODO: How to make line break?
    ctx.fillText(yieldInfo, yAxisTopPostion[0] - 10, yAxisTopPostion[1] - 20);
    const yearInfo = "年份";
    ctx.fillText(yearInfo, xAxisRightPostion[0] + 10, xAxisRightPostion[1] + 20);
});

function drawAxes() {
    // Set the color and width of axes
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 2;

    // Draw X-axis
    ctx.beginPath();
    ctx.moveTo(xAxisLeftPostion[0], xAxisRightPostion[1]);
    ctx.lineTo(xAxisRightPostion[0], xAxisRightPostion[1]);
    // Add arrow
    ctx.lineTo(xAxisRightPostion[0] - 5, xAxisRightPostion[1] - 5); 
    ctx.moveTo(xAxisRightPostion[0], xAxisRightPostion[1]);
    ctx.lineTo(xAxisRightPostion[0] - 5, xAxisRightPostion[1] + 5); 
    ctx.stroke();

    // Draw Y-axis
    ctx.beginPath();
    ctx.moveTo(yAxisBottomPostion[0], yAxisBottomPostion[1]);
    ctx.lineTo(yAxisTopPostion[0], yAxisTopPostion[1]);
    // Add arrow
    ctx.lineTo(yAxisTopPostion[0] - 5, yAxisTopPostion[1] + 5);
    ctx.moveTo(yAxisTopPostion[0], yAxisTopPostion[1]);
    ctx.lineTo(yAxisTopPostion[0] + 5, yAxisTopPostion[1] + 5);
    ctx.stroke();
}

function drawYAxisTicks(data) {
    // const yAxisMaxValue = Math.max(...data.map(d => d[1]));
    const yAxisLength = yAxisBottomPostion[1] - yAxisTopPostion[1];

    // Draw Y-axis ticks
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    for (let i = 0; i <= yAxisLength; i += barHeightPerUnit * 5) {
        const pointY = yAxisBottomPostion[1] - i;
        ctx.beginPath();
        ctx.moveTo(yAxisBottomPostion[0] - 5, pointY);
        ctx.lineTo(yAxisBottomPostion[0], pointY);
        ctx.stroke();
        ctx.fillText((i / barHeightPerUnit).toString(), yAxisBottomPostion[0] - 30, pointY + 5);
    }
}

function drawSolidCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}