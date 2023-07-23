//import index from 'index.js'

function handleFile() {
    let fileInput = document.getElementById("fileInput");
    let file = fileInput.files[0];
    let fileExtension = file.name.split(".").pop().toLowerCase();
  
    if (fileExtension === "csv" || fileExtension === "xls" || fileExtension === "xlsx") {
      parseFile(file, fileExtension);
    } else {
      alert("请上传CSV、XLS或XLSX文件");
    }
}
  
function parseFile(file, fileExtension) {
    let fileReader = new FileReader();
    
    fileReader.onload = function (e) {
      let fileContent = e.target.result;
  
      if (fileExtension === "csv") {
        processData(Papa.parse(fileContent).data);
      } else if (fileExtension === "xls" || fileExtension === "xlsx") {
        let workbook = XLSX.read(fileContent, { type: "binary" });
        let worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let data = XLSX.utils.sheet_to_csv(worksheet);
        processData(Papa.parse(data).data);
      }
    };
  
    fileReader.readAsBinaryString(file);
  }
  
function processData(getdata) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let sum = 0;
    let data = [];
    
    for (let i = 0; i < getdata.length; i++) { // 不跳过表头
        let year = parseInt(getdata[i][0]);
        let production = parseInt(getdata[i][1]);

        if (year === '' || production === '' || isNaN(year) || isNaN(production)) {
            continue;
        } else {
            data.push([Number(year), Number(production)]);
            sum += production;
        }
    }
  
    document.getElementById("result").innerHTML = "产量总和为：" + sum;

    // 按照年份升序排序
    data.sort((a, b) => a[0] - b[0]);

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
}