export const filterBtn = document.getElementById('filterBtn');
export const resetBtn = document.getElementById('resetBtn');

const startYearInput = document.getElementById('startYear');
const endYearInput = document.getElementById('endYear');
const startYieldInput = document.getElementById('startYield'); 
const endYieldInput = document.getElementById('endYield');

// Filter the data
filterBtn.addEventListener('click', () => {
    let startYear = parseInt(startYearInput.value);
    let endYear = parseInt(endYearInput.value);
    let startYield = parseInt(startYieldInput.value);
    let endYield = parseInt(endYieldInput.value);

    // Resolve input exceptions for filtering
    if (endYear < startYear) {
        const temp = endYear;
        endYear = startYear;
        startYear = temp;
    }

    if (startYield > endYield) {
        const temp = endYield;
        endYield = startYield;
        startYield = temp;
    }

    const dataRows = document.getElementsByClassName('dataRow');

    for (const row of dataRows) {
        const yearInput = row.querySelector('.year');
        const yieldInput = row.querySelector('.yield');
        const yearValue = parseInt(yearInput.value);
        const yieldValue = parseFloat(yieldInput.value);

        if ((yearValue >= startYear || !startYear) && (yearValue <= endYear || !endYear) && (yieldValue >= startYield || !startYield) && (yieldValue <= endYield || !endYield)) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    }
});

// Reset the data
resetBtn.addEventListener('click', () => {
    // Clear the text inputs
    startYearInput.value = '';
    endYearInput.value = '';
    startYieldInput.value = '';
    endYieldInput.value = '';

    // Show all the rows
    const dataRows = document.getElementsByClassName('dataRow');
    for (const row of dataRows) {
        row.style.display = 'table-row';
    }
});