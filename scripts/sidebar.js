export const histogramChoice = document.getElementById('histogram');
export const curveChoice = document.getElementById('curve');

export const barFillStyleInputs = document.querySelectorAll("input[type=radio][name=option]");
export const barGrandientStyleInputs = document.querySelectorAll("input[type=radio][name=gradient-option]");
export const lineDashInputs = document.querySelectorAll("input[type=radio][name=line-dash]");
export const lineWidthInputs = document.querySelectorAll("input[type=radio][name=line-width]");
export const pointShapeInputs = document.querySelectorAll("input[type=radio][name=point-shape]");
export const pointSizeInputs = document.querySelectorAll("input[type=radio][name=point-radius]");

export const yTickAdapter = document.getElementById('y-tick-adapter');
export const yTickAdapterInner = document.getElementById('y-tick-adapter-inner');

let isDraggingProgress = false;
let progress = 0.25;

export const colorWheels = document.querySelectorAll('.color-wheel');

let isDraggingColorWheels = new Array(colorWheels.length).fill(false);

colorWheels.forEach(colorWheel => {
    colorWheel.style.backgroundColor = '#4693E0';   // default color
    if (colorWheel.id === 'line-color' || colorWheel.id === 'point-color') {
        colorWheel.style.backgroundColor = '#39C5BB';   // The representative color of YOU-KNOW-WHO
    }
});

/// Sidebar functions ///
barFillStyleInputs.forEach(input => {
    input.addEventListener("change", showDropdownContent.bind(null, input));
});

barGrandientStyleInputs.forEach(input => {
    input.addEventListener("change", showSubDropdownContent.bind(null, input));
});

function showDropdownContent(selectedOption) {
    const dropdownContents = document.querySelectorAll(".dropdown-content");

    dropdownContents.forEach(content => {
        content.style.display = "none";
    });

    if (selectedOption.checked) {
        const selectedOptionValue = selectedOption.value;
        const selectedContent = document.getElementById(`${selectedOptionValue}-option`);
        if (selectedContent) {
            selectedContent.style.display = "block";
        }
    }
}

function showSubDropdownContent(selectedOption) {
    const subDropdownContents = document.querySelectorAll(".sub-dropdown-content");

    subDropdownContents.forEach(content => {
        content.style.display = "none";
    });

    if (selectedOption.checked) {
        const selectedOptionValue = selectedOption.value;
        const selectedContent = document.getElementById(`${selectedOptionValue}-option`);
        if (selectedContent) {
            selectedContent.style.display = "block";
        }
    }
}

yTickAdapter.addEventListener('mousedown', (e) => {
    isDraggingProgress = true;
    updateProgress(e.clientX);
});

colorWheels.forEach((colorWheel, index) => {
    colorWheel.addEventListener('mousedown', (e) => {
        isDraggingColorWheels[index] = true;
        updateColorWheel(index, e.clientX, e.clientY);
    });
});

document.addEventListener('mousemove', (e) => {
    if (isDraggingProgress) {
        updateProgress(e.clientX);
    }
    isDraggingColorWheels.forEach((isDragging, index) => {
        if (isDragging) {
            updateColorWheel(index, e.clientX, e.clientY);
        }
    });
});

document.addEventListener('mouseup', () => {
    isDraggingProgress = false;
    isDraggingColorWheels = new Array(colorWheels.length).fill(false);
});

function updateProgress(clientX) {
    const rect = yTickAdapter.getBoundingClientRect();
    const newWidth = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    progress = newWidth / rect.width;
    yTickAdapterInner.style.width = `${newWidth}px`;
}

function updateColorWheel(wheelIndex, clientX, clientY) {
    // Get the mouse position relative to the color wheel center
    const rect = colorWheels[wheelIndex].getBoundingClientRect();
    const x = clientX - rect.left - colorWheels[wheelIndex].clientWidth / 2;
    const y = clientY - rect.top - colorWheels[wheelIndex].clientHeight / 2;
      
    const angle = Math.atan2(y, x);
    const radius = Math.sqrt(x * x + y * y);
      
    let hue = angle * (180 / Math.PI) + 180;
    if (hue < 0) hue += 360;
      
    const saturation = Math.min(100, radius / (colorWheels[wheelIndex].clientWidth / 2) * 100);
    const lightness = 50;
      
    const selectedColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    colorWheels[wheelIndex].style.backgroundColor = selectedColor;
}

export function shouldBeAdapted(gapValue, maxValue) {
    if (gapValue / maxValue < progress && gapValue !== 0) {
        return true;
    } else {
        return false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    showDropdownContent(barFillStyleInputs[0]);
    showSubDropdownContent(barGrandientStyleInputs[0]);
});
