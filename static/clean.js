const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const saveButton = document.getElementById('saveButton');
const undoButton = document.getElementById('undoButton');
const sidebar = document.getElementById('sidebar');
const labelbar = document.getElementById('labelbar');
const imageUpload = document.getElementById('imageUpload');
const selectElement = document.getElementById('labelSelect');
const colorFields = document.querySelectorAll('.color-field');

const imagesList = [];
const colorMap = new Map([
    ['label1', 'red'],
    ['label2', 'blue'],
    ['label3', 'green'],
]);
const imageLabels = new Map();
let currentImageIndex = 0;
let selectedBox = null;
let labelId = 'label1';
let drawing = false;
let startX, startY, endX, endY;
let originalHeight, originalWidth;

imageUpload.addEventListener('change', async function(event) {
    sidebar.innerHTML = '';
    const files = event.target.files;
    for (const file of files) {
        const img = await loadImage(file);
        imagesList.push(img.src);
        imageLabels.set(img.src, []);
        img.addEventListener('click', function() {
            currentImageIndex = imagesList.indexOf(img.src);
            drawImage();
        });
        sidebar.appendChild(img);
    }
    drawImage();
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') {
        currentImageIndex++;
        if (currentImageIndex >= imagesList.length) {
            currentImageIndex = 0;
        }
    } else if (event.key === 'ArrowLeft') {
        currentImageIndex--;
        if (currentImageIndex < 0) {
            currentImageIndex = imagesList.length - 1;
        }
    }
    drawImage();
});

colorFields.forEach(function(field) {
    field.addEventListener('click', function() {
        labelId = this.id;
    });
});

canvas.addEventListener('mousedown', function(event) {
    const mouseX = parseInt(event.clientX - $(canvas).offset().left);
    const mouseY = parseInt(event.clientY - $(canvas).offset().top);
    if (selectedBox === null) {
        drawing = true;
        startX = mouseX;
        startY = mouseY;
    }
});

canvas.addEventListener('mousemove', function(event) {
    if (drawing) {
        endX = parseInt(event.clientX - $(canvas).offset().left);
        endY = parseInt(event.clientY - $(canvas).offset().top);
        requestAnimationFrame(drawImage);
    }
});

canvas.addEventListener('mouseup', function(event) {
    drawing = false;
    const boxes = imageLabels.get(imagesList[currentImageIndex]);
    boxes.push({
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        labelId: labelId
    });
    updateLabelbar();
});

saveButton.addEventListener('click', function() {
    const labelsToSave = imageLabels.get(imagesList[currentImageIndex]).map(function(box) {
        return {
            xmin: Math.min(box.startX, box.endX),
            ymin: Math.min(box.startY, box.endY),
            xmax: Math.max(box.startX, box.endX),
            ymax: Math.max(box.startY, box.endY)
        };
    });
    const data = {
        labels: labelsToSave
    };
    const file = new Blob([JSON.stringify(data)], {type: 'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = 'labels.json';
    a.click();
});

undoButton.addEventListener('click', function() {
    const boxes = imageLabels.get(imagesList[currentImageIndex]);
    if (boxes && boxes.length > 0) {
        boxes.pop();
        drawImage();
        updateLabelbar();
    }
});

function loadImage(file) {
    return new Promise(function(resolve, reject) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.onload = function() {
            originalWidth = this.width;
            originalHeight = this.height;
            this.height = 100;
            this.width = 100;
            resolve(img);
        };
        img.onerror = reject;
    });
}

function drawImage() {
    const img = new Image();
    img.src = imagesList[currentImageIndex];
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        drawBoxes();
        updateLabelbar();
        updateSidebar();
    };
}

function drawBoxes() {
    const boxes = imageLabels.get(imagesList[currentImageIndex]);
    for (const box of boxes) {
        ctx.beginPath();
        ctx.rect(box.startX, box.startY, box.endX - box.startX, box.endY - box.startY);
        ctx.strokeStyle = colorMap.get(box.labelId);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = colorMap.get(box.labelId);
        ctx.font = '12px Arial';
        ctx.fillText(`(${box.startX}, ${box.startY})`, box.startX, box.startY - 5);
        ctx.fillText(`(${box.endX}, ${box.endY})`, box.endX, box.endY + 15);
    }
}

function updateSidebar() {
    sidebar.innerHTML = '';
    for (const src of imagesList) {
        const img = document.createElement('img');
        img.src = src;
        img.width = 100;
        img.height = 100;
        if (imageLabels.get(src) && imageLabels.get(src).length > 0) {
            img.style.border = '3px solid green';
        }
        if (src === imagesList[currentImageIndex]) {
            img.style.border = '3px solid red';
        }
        sidebar.appendChild(img);
    }
}

function updateLabelbar() {
    labelbar.innerHTML = '';
    const boxes = imageLabels.get(imagesList[currentImageIndex]);
    for (const box of boxes) {
        const div = document.createElement('div');
        div.style.color = colorMap.get(box.labelId);
        div.textContent = `${box.labelId}: (${box.startX}, ${box.startY}), (${box.endX}, ${box.endY})`;
        labelbar.appendChild(div);
    }
}
