export const canvas = document.getElementById('chartCanvas');
export const ctx = canvas.getContext('2d');

export const canvasContainer = document.getElementById('canvas-container');

let scale = 1.0;

export const dataInputTable = document.getElementById('dataInputTable').getElementsByTagName('tbody')[0];

export const sidebar = document.getElementById('sidebar');

export const addRowBtn = document.getElementById('addRowBtn');
export const saveChartBtn = document.getElementById("saveChartBtn");

/// Mouse wheel event listener
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
        const zoomStep = 0.005;
    
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