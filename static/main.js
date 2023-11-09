
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const saveButton = document.getElementById('saveButton');
const deleteButton = document.getElementById('deleteButton');
const sidebar = document.getElementById('sidebar');
const imageUpload = document.getElementById('imageUpload');
const selectElement = document.getElementById('labelSelect');
const selectedLabel = document.getElementById('selectElement.value');

let img; // declare img variable
let drawing = false;
let labels = [];
let startX, startY, endX, endY;
let img2;
let imagesList = [];
let selectedBox = null;
let labelId='label1';
let colorMap = {
    'label1': 'red',
    'label2': 'blue',
    'label3': 'green',
}



document.getElementById('imageUpload').addEventListener('change', function(event) {
        const files = event.target.files;
        const sidebar = document.getElementById('sidebar');

        for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.height = 100; // Set a standard height for the images in the sidebar
                img.width = 100; // Set a standard width for the images in the sidebar
                img.onclick = function() {
                        localStorage.setItem('selectedImage', img.src);
                        window.location.reload();
                };
                sidebar.appendChild(img);
        }

        // Store the HTML of the sidebar in local storage
        localStorage.setItem('sidebarHTML', sidebar.innerHTML);
});

window.onload = function() {
        const canvas = document.getElementById('canvas'); // replace with your canvas id
        const ctx = canvas.getContext('2d');
        const sidebar = document.getElementById('sidebar');

        // Load the HTML of the sidebar from local storage
        sidebar.innerHTML = localStorage.getItem('sidebarHTML');

        // Add the onclick event to the images in the sidebar
        const images = sidebar.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++) {
                images[i].onclick = function() {
                        localStorage.setItem('selectedImage', this.src);
                        window.location.reload();
                };
        }

        img = new Image();
        img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                }

        // Retrieve the image source from local storage
        const selectedImage = localStorage.getItem('selectedImage');
        if (selectedImage) {
                img.src = selectedImage;

        const colorFields = document.querySelectorAll('.color-field');
        colorFields.forEach(function(field) {
            field.addEventListener('click', function() {
                labelId = this.id;
            });
        });

        }
}




// Start drawing bounding box when the mouse is clicked
canvas.addEventListener('mousedown', function(event) {
    // Get the mouse coordinates
    const mouseX = parseInt(event.clientX - $(canvas).offset().left);
    const mouseY = parseInt(event.clientY - $(canvas).offset().top);

    // Check if the mouse is inside an existing bounding box
    for (let i = 0; i < labels.length; i++) {
        const box = labels[i];
        if (mouseX >= box.startX && mouseX <= box.endX && mouseY >= box.startY && mouseY <= box.endY) {
            selectedBox = i;
            startX = box.startX;
            startY = box.startY;
            endX = box.endX;
            endY = box.endY;
            drawing = true;
            break;
        }
    }

    // If the mouse is not inside an existing bounding box, start drawing a new one
    if (selectedBox === null) {
        drawing = true;
        startX = mouseX;
        startY = mouseY;
    }
});


// Draw bounding box when the mouse is moved
canvas.addEventListener('mousemove', function(event) {
    if (drawing) {
        endX = parseInt(event.clientX - $(canvas).offset().left);
        endY = parseInt(event.clientY - $(canvas).offset().top);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Draw all existing bounding boxes
        for (let i = 0; i < labels.length; i++) {
            const box = labels[i];
            ctx.beginPath();
            ctx.rect(box.startX, box.startY, box.endX - box.startX, box.endY - box.startY);
            ctx.strokeStyle = colorMap[box.labelId];
            ctx.lineWidth = 2;
            ctx.stroke();
            // Draw the coordinates beside the bounding box
            ctx.fillStyle = colorMap[box.labelId];
            ctx.font = '12px Arial';
            ctx.fillText(`(${box.startX}, ${box.startY})`, box.startX, box.startY - 5);
            ctx.fillText(`(${box.endX}, ${box.endY})`, box.endX, box.endY + 15);
        }

        // Draw the new or selected bounding box
        ctx.beginPath();
        ctx.rect(startX, startY, endX - startX, endY - startY);
        ctx.strokeStyle = colorMap[labelId];
        ctx.lineWidth = 2;
        ctx.stroke();
        // Draw the coordinates beside the new or selected bounding box
        ctx.fillStyle = colorMap[labelId];
        ctx.font = '12px Arial';
        ctx.fillText(`(${startX}, ${startY})`, startX, startY - 5);
        ctx.fillText(`(${endX}, ${endY})`, endX, endY + 15);
    }   
});

// Stop drawing bounding box when the mouse is released
canvas.addEventListener('mouseup', function(event) {
    drawing = false;

    // If a bounding box was selected, update its coordinates
    if (selectedBox !== null) {
        labels[selectedBox].startX = startX;
        labels[selectedBox].startY = startY;
        labels[selectedBox].endX = endX;
        labels[selectedBox].endY = endY;
        selectedBox = null;
    } else {
        // Otherwise, add a new bounding box
        labels.push({
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
            labelId: labelId
        });
    }
});


////////////
// BUTTON //
////////////


saveButton.addEventListener('click', function() {
    const labelsToSave = labels.map(function(label) {
        return {
            xmin: Math.min(label.startX, label.endX),
            ymin: Math.min(label.startY, label.endY),
            xmax: Math.max(label.startX, label.endX),
            ymax: Math.max(label.startY, label.endY)
        };
    });

    const data = {
        labels: labelsToSave
    };

    const jsonData = JSON.stringify(data);

    const a = document.createElement('a');
    const file = new Blob([jsonData], {type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = 'labels.json';
    a.click();
});


// Delete last bounding box when the delete button is clicked
deleteButton.addEventListener('click', function() {
    if (labels.length > 0) {
        labels.pop();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Draw all remaining bounding boxes
        for (let i = 0; i < labels.length; i++) {
            const box = labels[i];
            ctx.beginPath();
            ctx.rect(box.startX, box.startY, box.endX - box.startX, box.endY - box.startY);
            ctx.strokeStyle = colorMap[box.labelId];
            ctx.lineWidth = 2;
            ctx.stroke();
            // Draw the coordinates beside the bounding box
            ctx.fillStyle = colorMap[box.labelId];
            ctx.font = '12px Arial';
            ctx.fillText(`(${box.startX}, ${box.startY})`, box.startX, box.startY - 5);
            ctx.fillText(`(${box.endX}, ${box.endY})`, box.endX, box.endY + 15);
        }
    }
});