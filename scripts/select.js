const filterBtn = document.getElementById('filterBtn');
const resetBtn = document.getElementById('resetBtn');
const startYearInput = document.getElementById('startYear');
const endYearInput = document.getElementById('endYear');
const startYieldInput = document.getElementById('startYield'); 
const endYieldInput = document.getElementById('endYield');

// 筛选
filterBtn.addEventListener('click', () => {
    const startYear = parseInt(startYearInput.value);
    const endYear = parseInt(endYearInput.value);
    const startYield = parseInt(startYieldInput.value);
    const endYield = parseInt(endYieldInput.value);

    const dataRows = document.getElementsByClassName('dataRow');
    for (const row of dataRows) {
        const yearInput = row.querySelector('.year');
        const yieldInput = row.querySelector('.yield');
        const yearValue = parseInt(yearInput.value);
        const yieldValue = parseFloat(yieldInput.value);

        // 根据筛选条件显示/隐藏行
        if ((yearValue >= startYear || !startYear) && (yearValue <= endYear || !endYear) && (yieldValue >= startYield || !startYield) && (yieldValue <= endYield || !endYield)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
});

// 取消筛选
resetBtn.addEventListener('click', () => {
    const dataRows = document.getElementsByClassName('dataRow');
    for (const row of dataRows) {
        row.style.display = ''; // 显示所有的行
    }
});