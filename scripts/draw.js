import { canvas, canvasContainer, ctx, dataInputTable } from './main.js';
import { 
    histogramChoice, curveChoice, yTickAdapterInner, shouldBeAdapted, colorWheels,
    radioInputs, subRadioInputs, lineDashInputs, lineWidthInputs, pointShapeInputs, pointSizeInputs,
} from './sidebar.js';

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

/// Draw the chart when the data inputs are changed
dataInputTable.addEventListener('change', drawChart);
dataInputTable.addEventListener('click', function(event) {
    if (event.target.classList.contains('deleteBtn') && !event.target.classList.contains('disabled')) {
        const row = event.target.parentNode.parentNode;
        row.remove();

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

        // Draw the chart
        drawChart();
    }
});

/// Render the chart when the settings are changed
histogramChoice.addEventListener('change', drawChart);
curveChoice.addEventListener('change', drawChart);
radioInputs.forEach(input => input.addEventListener('change', drawChart));
subRadioInputs.forEach(input => input.addEventListener('change', drawChart));
lineDashInputs.forEach(input => input.addEventListener('change', drawChart));
lineWidthInputs.forEach(input => input.addEventListener('change', drawChart));
pointShapeInputs.forEach(input => input.addEventListener('change', drawChart));
pointSizeInputs.forEach(input => input.addEventListener('change', drawChart));

const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
        if (mutation.attributeName === 'style') {
            drawChart();
            break;
        }
    }
});

observer.observe(yTickAdapterInner, { attributes: true });
colorWheels.forEach(colorWheel => observer.observe(colorWheel, { attributes: true }));

/// Draw the chart
export function drawChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get data from table
    const dataRows = dataInputTable.getElementsByClassName('dataRow');
    const data = [];

    for (const row of dataRows) {
        const year = parseInt(row.querySelector('.year').value);
        const yieldInput = parseInt(row.querySelector('.yield').value);

        if (isNaN(year) || isNaN(yieldInput) || row.style.display === 'none') {
            continue;
        } else {
            data.push([year, yieldInput]);
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

    // Adapt and draw the Y-axis ticks
    const shouldBeAdaptedFlag = data.length > 1 && shouldBeAdapted(yieldGap, maxYield); // If there is only one data point, don't adapt
    const tickUnit = Math.ceil(shouldBeAdaptedFlag ? yieldGap / (numberOfTicks - 1) : maxYield / numberOfTicks);
    const tickSpacing = chartMaxHeight / numberOfTicks;
    const barHeightPerUnit = tickSpacing / tickUnit;
    const barHeightOffset = shouldBeAdaptedFlag ? (minYield - tickUnit) * barHeightPerUnit : 0;

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
        // Set the fill style
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
            const year = data[i][0];
            const yieldInput = data[i][1];

            const pointX = xAxisLeftPostion[0] + xAxisChartSpacing + i * (xTickSpacing + barWidth);
            const pointY = xAxisLeftPostion[1];
            const barHeight = yieldInput * barHeightPerUnit - barHeightOffset;

            // Draw the bar
            ctx.fillRect(pointX, pointY, barWidth, -barHeight);
        }

        // Draw the ticks and values
        setCtxStyle('black', '14px Arial', 'center');
        for (let i = 0; i < data.length; i++) {
            const year = data[i][0];
            const yieldInput = data[i][1];

            const pointX = xAxisLeftPostion[0] + xAxisChartSpacing + i * (xTickSpacing + barWidth);
            const pointY = xAxisLeftPostion[1];
            const barHeight = yieldInput * barHeightPerUnit - barHeightOffset;

            // Show the value
            ctx.fillText(yieldInput, pointX + barWidth / 2, pointY - barHeight - barTextSpacing);
            // Show the year
            ctx.fillText(year, pointX + barWidth / 2, pointY + xTickLineHeight);
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

            console.log(pointRadius);

            // Draw the point
            if (pointShapeInputs[0].checked) {
                drawSolidCircle(pointX, pointY, pointRadius, pointColor);
            } else if (pointShapeInputs[1].checked) {
                ctx.fillStyle = pointColor;
                ctx.fillRect(pointX - pointRadius, pointY - pointRadius, pointRadius * 2, pointRadius * 2);
            }
        }

        // Draw the ticks and values
        setCtxStyle('black', '14px Arial', 'center');
        for (let i = 0; i < data.length; i++) {
            const yieldInput = data[i][1];
            const yieldRatio = yieldInput / yieldSum;

            const pointX = xAxisLeftPostion[0] + xAxisChartSpacing + i * (xTickSpacing + barWidth) + barWidth / 2;
            const pointY = xAxisLeftPostion[1] - yieldInput * barHeightPerUnit + barHeightOffset - barCurveSpacing;

            // Show the value in the form of ratio
            ctx.fillText((yieldRatio * 100).toFixed(0) + '%', pointX, pointY - pointRadius - xTickLineHeight / 2);
        }
    } 
}

function setCtxStyle(fillStyle='black', font='14px Arial', textAlign='right') {
    ctx.fillStyle = fillStyle;
    ctx.font = font;
    ctx.textAlign = textAlign;
}

function drawAxes() {
    // Set the color and width of axes
    setCtxStyle();
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
    const yieldInfo = "产量\n（万吨）"; // TODO: How to make line break?
    ctx.fillText(yieldInfo, yAxisTopPostion[0] + 50, yAxisTopPostion[1] - 20);
    const yearInfo = "年份";
    ctx.fillText(yearInfo, xAxisRightPostion[0] + 40, xAxisRightPostion[1] + 10);
}

/// Draw a solid circle
function drawSolidCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}
