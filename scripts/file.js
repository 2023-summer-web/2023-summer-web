import { dataInputTable } from './main.js';

const loadDataFromFileBtn = document.getElementById('loadDataFromFileBtn');

loadDataFromFileBtn.addEventListener('change', () => {
    let file = loadDataFromFileBtn.files[0];
    let fileExtension = file.name.split(".").pop().toLowerCase();
  
    if (fileExtension === "csv" || fileExtension === "xls" || fileExtension === "xlsx") {
      parseFile(file, fileExtension);
    } else {
      alert("请上传CSV、XLS或XLSX文件");
    }
});
  
function parseFile(file, fileExtension) {
    // Clear the existing data rows
    const dataRows = Array.from(dataInputTable.querySelectorAll('.dataRow'));
    for (let i = 0; i < dataRows.length; i++) {
        dataRows[i].remove();
    }

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

    // Reset the file input
    loadDataFromFileBtn.value = '';
}
  
function processData(data) {
    for (let i = 0; i < data.length; i++) {
        let year = parseInt(data[i][0]);
        let yieldValue = parseInt(data[i][1]);

        if (isNaN(year) || isNaN(yieldValue)) {
            continue;
        } else {
            const newRow = document.createElement('tr');
            newRow.className = 'dataRow';
            newRow.innerHTML = `
                <td><input type="number" class="year" value="${year}"></td>
                <td><input type="number" class="yield" value="${yieldValue}"></td>
                <td><button class="deleteBtn">×</button></td>
            `;
            dataInputTable.appendChild(newRow);
        }
    }
}
