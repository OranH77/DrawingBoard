const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear-button');

// Color Picker Script
const colorPicker = document.getElementById('color-picker');

// Eraser Script
//const eraser = document.getElementById('eraser');

const options = document.querySelectorAll('.option');
var selectedOption = 'pen';

options.forEach(option => {
    option.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedOption = option.id;
        console.log(option.id);
    });
});


let drawing = false;

clearButton.addEventListener('click', clearCanvas);

canvas.addEventListener('mousedown', e => {
    drawing = true;
    if (selectedOption === 'eraser')
        ctx.strokeStyle = 'white';
    else
    // Stroke color is set to the color picker value if the eraser is not selected
        ctx.strokeStyle = colorPicker.value;
    draw(e);
});

canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
});

function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


