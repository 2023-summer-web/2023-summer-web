import { canvas, ctx, dataInputTable, sidebar } from './main.js';
import { 
    histogramChoice, curveChoice, shouldBeAdapted, colorWheels, radioInputs, 
    subRadioInputs, lineDashInputs, lineWidthInputs, pointShapeInputs, pointSizeInputs,
} from './sidebar.js';
import { checkNoDataTip } from './table.js'

// Axes position, relative to the canvas
const xAxisLeftPostion = [50, canvas.height - 50];
const xAxisRightPostion = [canvas.width - 50, canvas.height - 50];
const yAxisTopPostion = [50, 50];
const yAxisBottomPostion = [50, canvas.height - 50];

// Axes length
const xAxisLength = xAxisRightPostion[0] - xAxisLeftPostion[0];
const yAxisLength = yAxisBottomPostion[1] - yAxisTopPostion[1];

// Chart height bound, preventing the chart from exceeding the canvas
const chartMaxHeight = yAxisLength - 50;

// Number of ticks on the Y-axis
const numberOfTicks = 6; 
const yTickOffset = 10;

const barTextSpacing = 5; // Spacing between the bar and the hovering value
const xTickLineHeight = 15; // X-axis tick text line height
const barCurveSpacing = 60; // Spacing between the bar and the curve

/// Redraw the chart when the data inputs are changed
dataInputTable.addEventListener('change', () => {
    checkNoDataTip();
    drawChart();
});

const tableObserver = new MutationObserver(() => {
    checkNoDataTip();
    drawChart();
});

tableObserver.observe(dataInputTable, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['style'],
});

/// Redraw the chart when the sidebar settings are changed
sidebar.addEventListener('change', (e) => {
    const targetElement = e.target;
    if (targetElement.matches('input[type=checkbox], input[type=radio]')) {
        drawChart();
    }
});

const sidebarObserver = new MutationObserver(drawChart);

sidebarObserver.observe(sidebar, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['style'],
});

/// Draw chart functions ///
export function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get data from table
    const dataRows = dataInputTable.getElementsByClassName('dataRow');
    const data = [];
    const seenYears = {};

    for (const row of dataRows) {
        const yearIn = row.querySelector('.year');
        const yieldIn = row.querySelector('.yield');
        const year = parseInt(yearIn.value);
        const yieldInput = parseInt(yieldIn.value);

        // Change the color to red in illegal input
        if (isNaN(year) || isNaN(yieldInput) || row.style.display === 'none'){
            continue;
        } else if (yieldInput < 0 ) {
            yearIn.style.color = 'red';
            yieldIn.style.color = 'red';
        } else {
            // Retain the first value if there are multiple values for the same year
            if (seenYears[year]) {
                yearIn.style.color = 'red';
                yieldIn.style.color = 'red';
            }
            else {
                seenYears[year] = true;
                yearIn.style.color = '';
                yieldIn.style.color = '';
                data.push([year, yieldInput]);
            }
        }
    }

    // Sort the data by year
    data.sort((a, b) => a[0] - b[0]);

    // Check if there is any data
    if (data.length === 0) {
        return;
    }

    // Bar width adaptive to the number of data, and the relevant constants
    // 2 * xAxisChartSpacing + (numberOfBars - 1) * xTickSpacing + numberOfBars * barWidth = xAxisLength
    const numberOfBars = data.length;
    const barWidth = xAxisLength / (0.2 + numberOfBars * 1.8);
    const xTickSpacing = 0.8 * barWidth;    // Spacing between each tick on the X-axis
    const xAxisChartSpacing = 0.5 * barWidth;   // Spacing between the first & last bar and the chart border

    // Maximum statistics
    const yieldSum = data.reduce((sum, d) => sum + d[1], 0);
    const maxYield = Math.max(...data.map(d => d[1]));
    const minYield = Math.min(...data.map(d => d[1]));
    const yieldGap = maxYield - minYield;

    // Draw axes
    drawAxes();

    // Adapt layout parameters to the data
    const shouldBeAdaptedFlag = data.length > 1 && shouldBeAdapted(yieldGap, maxYield); // If there is only one data point, don't adapt
    const tickUnit = Math.ceil(shouldBeAdaptedFlag ? yieldGap / (numberOfTicks - 1) : maxYield / numberOfTicks);
    const tickSpacing = chartMaxHeight / numberOfTicks;
    const barHeightPerUnit = tickSpacing / tickUnit;
    const barHeightOffset = shouldBeAdaptedFlag ? (minYield - tickUnit) * barHeightPerUnit : 0;

    // Adapt and draw the X-axis ticks
    ctx.fillStyle = 'black';
    setCtxFontStyle('14 Arial', 'center');
    for (let i = 0; i < data.length; i++) {
        const year = data[i][0];

        const pointX = xAxisLeftPostion[0] + xAxisChartSpacing + i * (xTickSpacing + barWidth);
        const pointY = xAxisLeftPostion[1];

        // Show the year
        ctx.fillText(year, pointX + barWidth / 2, pointY + xTickLineHeight);
    }

    // Adapt and draw the Y-axis ticks
    for (let i = 0; i <= numberOfTicks; i++) {
        const pointY = xAxisLeftPostion[1] - i * tickSpacing;
        if (i === 0) {
            ctx.fillText('0', xAxisLeftPostion[0] - yTickOffset, pointY);
            continue;
        }
        const tickValue = shouldBeAdaptedFlag ? (i - 1) * tickUnit + minYield : i * tickUnit;
        ctx.fillText(tickValue.toString(), xAxisLeftPostion[0] - yTickOffset, pointY);
    }

    // Draw the histogram
    if (histogramChoice.checked) {
        // Set the bar style
        if (radioInputs[0].checked) {
            ctx.fillStyle = colorWheels[0].style.backgroundColor;
        } else if (radioInputs[1].checked) {
            if (subRadioInputs[0].checked) {
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, colorWheels[1].style.backgroundColor);
                gradient.addColorStop(1, colorWheels[2].style.backgroundColor);
                ctx.fillStyle = gradient;
            } else if (subRadioInputs[1].checked) {
                const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                gradient.addColorStop(0, colorWheels[3].style.backgroundColor);
                gradient.addColorStop(1, colorWheels[4].style.backgroundColor);
                ctx.fillStyle = gradient;
            }
        }

        // Draw the bars
        for (let i = 0; i < data.length; i++) {
            const yieldInput = data[i][1];

            const pointX = xAxisLeftPostion[0] + xAxisChartSpacing + i * (xTickSpacing + barWidth);
            const pointY = xAxisLeftPostion[1];
            const barHeight = yieldInput * barHeightPerUnit - barHeightOffset;

            ctx.fillRect(pointX, pointY, barWidth, -barHeight);
        }

        // Draw the bar text
        ctx.fillStyle = 'black';
        setCtxFontStyle('14 Arial', 'center');
        for (let i = 0; i < data.length; i++) {
            const yieldInput = data[i][1];

            const pointX = xAxisLeftPostion[0] + xAxisChartSpacing + i * (xTickSpacing + barWidth);
            const pointY = xAxisLeftPostion[1];
            const barHeight = yieldInput * barHeightPerUnit - barHeightOffset;

            ctx.fillText(yieldInput, pointX + barWidth / 2, pointY - barHeight - barTextSpacing);
        }
    }

    // Draw the curve
    if (curveChoice.checked) {
        // Set the stroke style
        ctx.strokeStyle = colorWheels[5].style.backgroundColor;
        if (lineDashInputs[1].checked) {
            ctx.setLineDash([5, 5]);
        }
        lineWidthInputs.forEach((input, index) => {
            if (input.checked) {
                ctx.lineWidth = Number(index + 1);
            }
        });

        // Draw the curve
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
            const yieldInput = data[i][1];

            const pointX = xAxisLeftPostion[0] + xAxisChartSpacing + i * (xTickSpacing + barWidth) + barWidth / 2;
            const pointY = xAxisLeftPostion[1] - yieldInput * barHeightPerUnit + barHeightOffset - barCurveSpacing;

            if (i === 0) {
                ctx.moveTo(pointX, pointY);
            } else {
                ctx.lineTo(pointX, pointY);
            }
        }
        ctx.stroke();

        // Set the point style
        const pointColor = colorWheels[6].style.backgroundColor;
        let pointRadius;
        pointSizeInputs.forEach((input, index) => {
            if (input.checked) {
                pointRadius = Number((index + 1) * 2 + 1);
            }
        });

        // Draw the points
        for (let i = 0; i < data.length; i++) {
            const yieldInput = data[i][1];

            const pointX = xAxisLeftPostion[0] + xAxisChartSpacing + i * (xTickSpacing + barWidth) + barWidth / 2;
            const pointY = xAxisLeftPostion[1] - yieldInput * barHeightPerUnit + barHeightOffset - barCurveSpacing;

            if (pointShapeInputs[0].checked) {
                drawSolidCircle(pointX, pointY, pointRadius, pointColor);
            } else if (pointShapeInputs[1].checked) {
                ctx.fillStyle = pointColor;
                ctx.fillRect(pointX - pointRadius, pointY - pointRadius, pointRadius * 2, pointRadius * 2);
            }
        }

        // Draw the ticks and values
        ctx.fillStyle = 'black';
        setCtxFontStyle('14 Arial', 'center');
        for (let i = 0; i < data.length; i++) {
            const yieldInput = data[i][1];
            const yieldRatio = yieldInput / yieldSum;

            const pointX = xAxisLeftPostion[0] + xAxisChartSpacing + i * (xTickSpacing + barWidth) + barWidth / 2;
            const pointY = xAxisLeftPostion[1] - yieldInput * barHeightPerUnit + barHeightOffset - barCurveSpacing;

            // Show the value in the form of ratio
            // One decimal place reserved for curves values
            ctx.fillText((yieldRatio * 100).toFixed(1) + '%', pointX, pointY - pointRadius - xTickLineHeight / 2);
        }
    } 
}

function drawAxes() {
    // Set the color and width of axes
    ctx.fillStyle = 'black';
    setCtxFontStyle('14 Arial', 'center');
    ctx.strokeStyle = 'gray';
    ctx.setLineDash([]);
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

    // Draw the labels of axes
    const yieldInfo = "产量\n（万吨）";
    ctx.fillText(yieldInfo, yAxisTopPostion[0] + 50, yAxisTopPostion[1] - 20);
    const yearInfo = "年份";
    ctx.fillText(yearInfo, xAxisRightPostion[0] + 40, xAxisRightPostion[1] + 10);
}

function setCtxFontStyle(font='14px Arial', textAlign='right') {
    ctx.font = font;
    ctx.textAlign = textAlign;
}

/// Draw a solid circle
function drawSolidCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}
