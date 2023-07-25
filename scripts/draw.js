// import index.js
import { canvas, ctx, dataInputTable, drawChartBtn } from './index.js';

const xAxisLeftPostion = [50, canvas.height - 50]; // X-axis left point position
const xAxisRightPostion = [canvas.width - 50, canvas.height - 50]; // X-axis right point position
const yAxisTopPostion = [50, 50]; // Y-axis top point position
const yAxisBottomPostion = [50, canvas.height - 50]; // Y-axis bottom point position

const xAxisLength = xAxisRightPostion[0] - xAxisLeftPostion[0];
const yAxisLength = yAxisBottomPostion[1] - yAxisTopPostion[1];

const chartMaxHeight = yAxisLength - 50;

const xAxisStartSpacing = 10; // Spacing between the first tick and the Y-axis
const numberOfTicks = 6; // Number of ticks on the Y-axis
const xAxisSpacing = 60; // X-axis tick spacing

const xAxisLineHeight = 15; // X-axis tick line height
const xAxisLineSpacing = 5; // Spacing between the bar and the hovering value
const barCurveSpacing = 45; // Spacing between the bar and the curve

const barWidth = 30; // Bar width

const pointRadius = 5; // Point radius

const barColor = '#4693E0';
const curveColor = '#39C5BB'; // The representative color of YOU-KNOW-WHO

function setCtxStyle(fillStyle='black', font='14px Arial', textAlign='right') {
    ctx.fillStyle = fillStyle;
    ctx.font = font;
    ctx.textAlign = textAlign;
}

/// Draw the chart
drawChartBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get data from table
    const dataRows = dataInputTable.getElementsByClassName('dataRow');
    const data = [];

    for (const row of dataRows) {
        const year = row.querySelector('.year').value;
        const yieldInput = row.querySelector('.yield').value;
        if (year === '' || yieldInput === '') {
            continue;
        } else {
            data.push([Number(year), Number(yieldInput)]);
        }
    }

    // Maximum statistics
    const yieldSum = data.reduce((sum, d) => sum + d[1], 0);
    const maxYield = Math.max(...data.map(d => d[1]));

    // Draw axes and Y-ticks
    setCtxStyle();
    drawAxes();
    // The value gap between each tick
    const tickUnit = Math.ceil(maxYield / numberOfTicks);
    // The distance between each tick in pixels
    const tickSpacing = chartMaxHeight / numberOfTicks;
    const barHeightPerUnit = tickSpacing / tickUnit;
    for (let i = 0; i <= numberOfTicks; i++) {
        const pointY = xAxisLeftPostion[1] - i * tickSpacing;
        ctx.fillText((i * tickUnit).toString(), xAxisLeftPostion[0] - xAxisStartSpacing, pointY);
    }

    // Draw the histogram
    for (let i = 0; i < data.length; i++) {
        const year = data[i][0];
        const yieldInput = data[i][1];

        const pointX = xAxisLeftPostion[0] + xAxisStartSpacing + (i * xAxisSpacing);
        const pointY = xAxisLeftPostion[1];
        const barHeight = yieldInput * barHeightPerUnit;

        // Draw the bar
        ctx.fillStyle = barColor;
        ctx.fillRect(pointX, pointY, barWidth, -barHeight);

        // Draw the value and year
        setCtxStyle('black', '14px Arial', 'center');
        // Show the value
        ctx.fillText(yieldInput, pointX + barWidth / 2, pointY - barHeight - xAxisLineSpacing);
        // Show the year
        ctx.fillText(year, pointX + barWidth / 2, pointY + xAxisLineHeight);
    }

    // Draw the curve
    for (let i = 0; i < data.length; i++) {
        const yieldInput = data[i][1];
        const yieldRatio = yieldInput / yieldSum;

        const pointX = xAxisLeftPostion[0] + xAxisStartSpacing + (i * xAxisSpacing) + barWidth / 2;
        const pointY = xAxisLeftPostion[1] - yieldInput * barHeightPerUnit - barCurveSpacing;

        // Draw the point
        drawSolidCircle(pointX, pointY, pointRadius, curveColor);

        // Show the value in the form of ratio
        setCtxStyle('black', '14px Arial', 'center');
        ctx.fillText((yieldRatio * 100).toFixed(0) + '%', pointX, pointY - pointRadius - xAxisLineHeight / 2);
    }

    ctx.beginPath();
    ctx.strokeStyle = curveColor;
    ctx.lineWidth = 2;
    for (let i = 0; i < data.length; i++) {
        const yieldInput = data[i][1];

        const pointX = xAxisLeftPostion[0] + xAxisStartSpacing + (i * xAxisSpacing) + barWidth / 2;
        const pointY = xAxisLeftPostion[1] - yieldInput * barHeightPerUnit - barCurveSpacing;

        if (i === 0) {
            ctx.moveTo(pointX, pointY);
        } else {
            ctx.lineTo(pointX, pointY);
        }
    }
    ctx.stroke();

    // Draw the labels of axes
    setCtxStyle();
    const yieldInfo = "产量\n（万吨）"; // TODO: How to make line break?
    ctx.fillText(yieldInfo, yAxisTopPostion[0] + 50, yAxisTopPostion[1] - 20);
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

/// Draw a solid circle
function drawSolidCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}