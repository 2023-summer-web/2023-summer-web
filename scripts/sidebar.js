import { canvas, canvasContainer } from "./main.js";

const sidebar = document.querySelector('.sidebar');

export const histogramChoice = document.getElementById('histogram');
export const curveChoice = document.getElementById('curve');

export const radioInputs = document.querySelectorAll("input[type=radio][name=option]");
export const subRadioInputs = document.querySelectorAll("input[type=radio][name=gradientOption]");
export const lineDashInputs = document.querySelectorAll("input[type=radio][name=lineDash]");
export const lineWidthInputs = document.querySelectorAll("input[type=radio][name=lineWidth]");
export const pointShapeInputs = document.querySelectorAll("input[type=radio][name=pointShape]");
export const pointSizeInputs = document.querySelectorAll("input[type=radio][name=pointRadius]");

export const colorWheels = document.querySelectorAll('.colorWheel');
colorWheels.forEach(colorWheel => {
    colorWheel.style.backgroundColor = '#4693E0';   // default color
    if (colorWheel.id === 'curveColor' || colorWheel.id === 'pointColor') {
        colorWheel.style.backgroundColor = '#39C5BB';   // The representative color of YOU-KNOW-WHO
    }
});

let isDraggingColorWheels = new Array(colorWheels.length).fill(false);

export const yTickAdapter = document.getElementById('yTickAdapter');
export const yTickAdapterInner = document.getElementById('yTickAdapterInner');

let isDraggingProgress = false;
let progress = 0.25;

let scale = 1.0;

document.addEventListener('wheel', (event) => {
    const sidebarRect = sidebar.getBoundingClientRect();
    const canvasContainerRect = canvasContainer.getBoundingClientRect();
    if (event.clientX >= sidebarRect.left && event.clientX <= sidebarRect.right &&
        event.clientY >= sidebarRect.top && event.clientY <= sidebarRect.bottom) {
        sidebar.scrollTop += event.deltaY;
    } else if (event.clientX >= canvasContainerRect.left && event.clientX <= canvasContainerRect.right &&
        event.clientY >= canvasContainerRect.top && event.clientY <= canvasContainerRect.bottom) {
        // Zoom the canvas
        const delta = Math.max(-1, Math.min(1, event.deltaY));
        const zoomStep = 0.003;
    
        // Scaling range: [0.75, 1.5]
        // Canvas size range: [600, 450] ~ [1200, 900] (initial size: 800, 600)
        scale = Math.max(0.75, Math.min(1.5, scale + delta * zoomStep));
    
        // Scale the canvas with the center point as the origin
        canvas.style.transformOrigin = 'center center';
        canvas.style.transform = `scale(${scale})`;
    
        // Adjust the canvas container size
        canvasContainer.style.width = `${800 * scale}px`;
        canvasContainer.style.height = `${600 * scale}px`;
    } else {
        window.scrollBy(0, event.deltaY);
    }
});

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

export function shouldBeAdapted(gapValue, maxValue) {
    if (gapValue / maxValue < progress && gapValue !== 0) {
        return true;
    } else {
        return false;
    }
}

// onchange event listener for radio inputs
radioInputs.forEach(input => {
    input.addEventListener("change", showDropdownContent.bind(null, input));
});

subRadioInputs.forEach(input => {
    input.addEventListener("change", showSubDropdownContent.bind(null, input));
});

document.addEventListener("DOMContentLoaded", () => {
    showDropdownContent(radioInputs[0]);
    showSubDropdownContent(subRadioInputs[0]);
});

function showDropdownContent(selectedOption) {
    const dropdownContents = document.querySelectorAll(".dropdown-content");

    dropdownContents.forEach(content => {
        content.style.display = "none";
    });

    if (selectedOption.checked) {
        const selectedOptionValue = selectedOption.value;
        const selectedContent = document.getElementById(`${selectedOptionValue}Choice`);
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
        const selectedContent = document.getElementById(`${selectedOptionValue}Choice`);
        if (selectedContent) {
            selectedContent.style.display = "block";
        }
    }
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