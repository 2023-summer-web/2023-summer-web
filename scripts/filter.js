const startYearInput = document.getElementById('start-year');
const endYearInput = document.getElementById('end-year');
const startYieldInput = document.getElementById('start-yield'); 
const endYieldInput = document.getElementById('end-yield');

const filterBtn = document.getElementById('filter-button');
const resetBtn = document.getElementById('reset-button');

/// Filter the data
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

    const dataRows = document.querySelectorAll('.data-row');

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

/// Reset the data
resetBtn.addEventListener('click', () => {
    // Clear the text inputs
    startYearInput.value = '';
    endYearInput.value = '';
    startYieldInput.value = '';
    endYieldInput.value = '';

    // Show all the rows
    const dataRows = document.querySelectorAll('.data-row');
    for (const row of dataRows) {
        row.style.display = 'table-row';
    }
});