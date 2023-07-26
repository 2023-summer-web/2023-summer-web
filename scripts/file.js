import { dataInputTable } from './main.js';

const loadDataFromFileBtn = document.getElementById('loadDataFromFileBtn');

loadDataFromFileBtn.addEventListener('click', () => {
    let fileInput = document.getElementById("fileInput");
    let file = fileInput.files[0];
    let fileExtension = file.name.split(".").pop().toLowerCase();
  
    if (fileExtension === "csv" || fileExtension === "xls" || fileExtension === "xlsx") {
      parseFile(file, fileExtension);
    } else {
      alert("请上传CSV、XLS或XLSX文件");
    }
});
  
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

    //完成后清空文件输入框
    fileInput.value = '';
  }
  
function processData(getdata) {
    let data = [];
    
    for (let i = 0; i < getdata.length; i++) { // 不跳过表头
        let year = parseInt(getdata[i][0]);
        let production = parseInt(getdata[i][1]);

        if (year === '' || production === '' || isNaN(year) || isNaN(production)) {
            continue;
        } else {
            addEventListener(year, production);
        }
    }
}

function addEventListener(year = '', yieldInput = '') {
    const newRow = document.createElement('tr');
    newRow.className = 'dataRow';
    newRow.innerHTML = `
        <td><input type="number" class="year" value="${year}"></td>
        <td><input type="number" class="yield" value="${yieldInput}"></td>
    `;
    newRow.querySelector('.year').value = year; // 设置年份输入框的值
    newRow.querySelector('.yield').value = yieldInput; // 设置产量输入框的值

    dataInputTable.appendChild(newRow);
}