// import { handleFileUpload } from "./ori_upload";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const saveButton = document.getElementById('saveButton');
const deleteButton = document.getElementById('deleteButton');
const sidebar = document.getElementById('sidebar');
const imageUpload = document.getElementById('imageUpload');
let img; // declare img variable
let drawing = false;
let labels = [];
let startX, startY, endX, endY;
let img2;
let imagesList = [];

// Handle image uploads
function handleFileUpload(event, canvas, ctx) {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        img = new Image(); // create new Image object
        img.src = URL.createObjectURL(file);
        const img2 = img.cloneNode(true); 
        img2.width = 100;  // Or whatever size you want

        img.onload = function() {
            URL.revokeObjectURL(this.src);  // Free memory
            sidebar.appendChild(img2);  // Add image to sidebar here

            // Add onclick event to image
            img2.onclick = function() {
                // Load image onto canvas
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
            }
            
        }
        // img.src = event.target.result;
        img.src = URL.createObjectURL(file);
        
        imagesList.push(img);
    }
}

// Add event listener to file input
imageUpload.addEventListener('change', function(event) {
    handleFileUpload(event, canvas, ctx);
});







// Start drawing bounding box when the mouse is clicked
canvas.addEventListener('mousedown', function(event) {
    // Get the mouse coordinates
    const mouseX = parseInt(event.clientX - $(canvas).offset().left);
    const mouseY = parseInt(event.clientY - $(canvas).offset().top);
    drawing = true;
    startX = mouseX;
    startY = mouseY;
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
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Display coordinates
            ctx.fillStyle = 'red';
            ctx.fillText(`(${box.startX}, ${box.startY})`, box.startX, box.startY - 10);
            ctx.fillText(`(${box.endX}, ${box.endY})`, box.endX, box.endY + 20);
        }

        // Draw the new bounding box
        ctx.beginPath();
        ctx.rect(startX, startY, endX - startX, endY - startY);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Display coordinates for the new bounding box
        ctx.fillStyle = 'red';
        ctx.fillText(`(${startX}, ${startY})`, startX, startY - 10);
        ctx.fillText(`(${endX}, ${endY})`, endX, endY + 20);
 
    }   
});

// Stop drawing bounding box when the mouse is released
canvas.addEventListener('mouseup', function(event) {
    drawing = false;
    // Add a new bounding box
    labels.push({
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY
    });
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
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Draw the coordinates beside the bounding box
            ctx.fillStyle = 'green';
            ctx.font = '12px Arial';
            ctx.fillText(`(${box.startX}, ${box.startY})`, box.startX, box.startY - 5);
            ctx.fillText(`(${box.endX}, ${box.endY})`, box.endX, box.endY + 15);
        }
    }
});