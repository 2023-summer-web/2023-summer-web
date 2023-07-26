export const canvas = document.getElementById('chartCanvas');
export const ctx = canvas.getContext('2d');

export const dataInputTable = document.getElementById('dataInputTable').getElementsByTagName('tbody')[0];
export const drawChartBtn = document.getElementById('drawChartBtn');

const addRowBtn = document.getElementById('addRowBtn');
var saveButton = document.getElementById("saveButton");

/// Add a new row to the table
addRowBtn.addEventListener('click', () => {
    const lastRow = dataInputTable.lastElementChild;
    const lastYear = lastRow.querySelector('.year').value;
    const defaultValue = (lastYear === '') ? '' : Number(lastYear) + 1;

    const newRow = document.createElement('tr');
    newRow.className = 'dataRow';
    newRow.innerHTML = `
        <td><input type="number" class="year" value="${defaultValue} style="border: none !important;"></td>
        <td><input type="number" class="yield style="border: none !important;"></td>
        <td><button class="deleteBtn" style="display: flex;
        align-items: center;
        position: relative;
        background-color: #550000;
        color: #fff;
        font-weight: bold;
        font-size: large;
        border: none;
        border-radius: 50%;">×</button></td>
    `;
    dataInputTable.appendChild(newRow);

    // 添加删除按钮的点击事件监听器
    const deleteBtn = newRow.querySelector('.deleteBtn');
    deleteBtn.addEventListener('click', () => {
        newRow.remove(); 
    });
});

saveButton.addEventListener("click", function() {
  var imgURL = canvas.toDataURL("image/png");

  // 创建一个虚拟的下载链接
  var downloadLink = document.createElement("a");
  downloadLink.href = imgURL;
  downloadLink.target = "_blank";

  var filename = prompt("请输入文件名", "chart.png");
  if (filename !== null && filename.trim() !== "") {
    downloadLink.download = filename;
    downloadLink.click();
  }
});