export const histogramChoice = document.getElementById('histogram');
export const curveChoice = document.getElementById('curve');

export const yTickAdapter = document.getElementById('yTickAdapter');
export const yTickAdapterInner = document.getElementById('yTickAdapterInner');

let isDragging = false;
let progress = 0.25;

yTickAdapter.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateProgress(e.clientX);
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        updateProgress(e.clientX);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
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
