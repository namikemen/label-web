
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const saveButton = document.getElementById('saveButton');
const UndoButton = document.getElementById('UndoButton');
const sidebar = document.getElementById('sidebar');
const labelbar = document.getElementById('labelbar');
const imageUpload = document.getElementById('imageUpload');
const selectElement = document.getElementById('labelSelect');
const selectedLabel = document.getElementById('selectElement.value');


let img; // declare img variable
let drawing = false;
let labels = [];
let startX, startY, endX, endY;
let img2;
let imagesList = [];
let imageNames = [];
let selectedBox = null;
let labelId = 'label1';
let colorMap = {
    'label1': 'red',
    'label2': 'blue',
    'label3': 'green',
}
let currentImageIndex = 0; // Keep track of the current image
let imageLabels = {}; // Keep track of the labels for each image
let originalHeight;
let originalWidth;

document.getElementById('imageUpload').addEventListener('change', function(event) {
        const files = event.target.files;
        const colorFields = document.querySelectorAll('.color-field');
        colorFields.forEach(function(field) {
            field.addEventListener('click', function() {
                labelId = this.id;
            });
        });
        sidebar.innerHTML = '';
        for (let i = 0; i < files.length; i++) {
                const file = files[i];
                imageLabels[i] = [];
                img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                // Set a standard width for the images in the sidebar
                img.onload = function() {
                    // Store the original dimensions of the image
                    originalWidth = this.width;
                    originalHeight = this.height;
            
                    // Resize the image for the sidebar
                    this.height = 100;
                    this.width = 100;
            
                    this.onclick = function() {
                        // Use the original dimensions of the image for the canvas
                        canvas.width = originalWidth;
                        canvas.height = originalHeight;
                        ctx.drawImage(this, 0, 0, originalWidth, originalHeight);
                        currentImageIndex = i; 
                        drawAllBoxes();
                        updateLabelbar();
                        updateSidebar();
                        }
                    sidebar.appendChild(this);
                    };
                    
                    imagesList.push(img.src);
                    imageNames.push(file.name);
                };
                
        },
        
);


document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') {
        // Move to the next image

        currentImageIndex++;
        
        if (currentImageIndex >= imagesList.length) {
            currentImageIndex = 0; // Loop back to the first image
        }
    } else if (event.key === 'ArrowLeft') {
        // Move to the previous image
        currentImageIndex--;
        if (currentImageIndex < 0) {
            currentImageIndex = imagesList.length - 1; // Loop back to the last image
        }
    }
    const img = new Image();
    img.src = imagesList[currentImageIndex];
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        labelbar.innerHTML = '';
        updateLabelbar();
        updateSidebar();
        
    };
});


function updateSidebar() {
    // Clear the sidebar
    sidebar.innerHTML = '';

    // Add each image to the sidebar
    for (let i = 0; i < imagesList.length; i++) {
        const img = document.createElement('img');
        img.src = imagesList[i];
        img.width = 100;
        img.height = 100;

        // If the image has been drawn on, give it a green border
        if (imageLabels[i] && imageLabels[i].length > 0) {
            img.style.border = '3px solid green';
        }

        // If the image is the current image, give it a red border
        if (i === currentImageIndex) {
            img.style.border = '3px solid red';
        }

        // Add a click event to the image
        img.addEventListener('click', function() {
            ctx.drawImage(img, 0, 0, originalWidth, originalHeight);
            currentImageIndex = i;
            drawAllBoxes();
            updateLabelbar();
            updateSidebar();
        });

        sidebar.appendChild(img);
    }
}

function updateLabelbar() {
    // Clear the sidebar
    labelbar.innerHTML = '';
    // Add a div for each bounding box
    for (let i = 0; i < imageLabels[currentImageIndex].length; i++) {
        const box = imageLabels[currentImageIndex][i];
        const div = document.createElement('div');
        div.style.color = colorMap[box.labelId];
        div.textContent = `${box.labelId}: (${box.startX}, ${box.startY}), (${box.endX}, ${box.endY})`;
        labelbar.appendChild(div);
    }
}


/////////////////////////////////
//////////// DRAWING ////////////
/////////////////////////////////

function drawAllBoxes() {
    // Draw all existing bounding boxes
    for (let i = 0; i < imageLabels[currentImageIndex].length; i++) {
        const box = imageLabels[currentImageIndex][i];
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




// Start drawing bounding box when the mouse is clicked
canvas.addEventListener('mousedown', function(event) {
    // Get the mouse coordinates
    const mouseX = parseInt(event.clientX - $(canvas).offset().left);
    const mouseY = parseInt(event.clientY - $(canvas).offset().top);

    // Check if the mouse is inside an existing bounding box
    
    // for (let i = 0; i < imageLabels[currentImageIndex].length; i++) {
    //     const box = imageLabels[currentImageIndex][i];
    //     if (mouseX >= box.startX && mouseX <= box.endX && mouseY >= box.startY && mouseY <= box.endY) {
    //         selectedBox = i;
    //         startX = box.startX;
    //         startY = box.startY;
    //         endX = box.endX;
    //         endY = box.endY;
    //         drawing = true;
    //         break;
    //     }
    // }

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
        const img = new Image();
        img.src = imagesList[currentImageIndex];
        ctx.drawImage(img, 0, 0);

        // Draw all existing bounding boxes
        drawAllBoxes()
        

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
    
    // Push the new label into the array
    imageLabels[currentImageIndex].push({
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        labelId: labelId
    });
    updateLabelbar();
});


////////////
// BUTTON //
////////////


saveButton.addEventListener('click', function() {
    const output = {};

    for (let i = 0; i < imageNames.length; i++) {
        const yoloLabels = [];
        for (let j = 0; j < imageLabels[i].length; j++) {  
             
            const box = imageLabels[i][j];
            const width = box.endX - box.startX;
            const height = box.endY - box.startY;
            const centerX = box.startX + width / 2;
            const centerY = box.startY + height / 2;

            // Normalize the coordinates
            const normalizedWidth = width / originalWidth;
            const normalizedHeight = height / originalHeight;
            const normalizedCenterX = centerX / originalWidth;
            const normalizedCenterY = centerY / originalHeight;
    
            yoloLabels.push([box.labelId, normalizedCenterX, normalizedCenterY, normalizedWidth, normalizedHeight]);
        }
        output[imageNames[i]] = yoloLabels;
    }
    console.log(output);
    // Create a .json file
    const a = document.createElement('a');
    const file = new Blob([JSON.stringify(output)], {type: 'application/json'});
    a.href = URL.createObjectURL(file);
    a.download = 'labels.json';
    a.click();
});

// Delete last bounding box when the delete button is clicked
UndoButton.addEventListener('click', function() {
    if (imageLabels[currentImageIndex] && imageLabels[currentImageIndex].length > 0) {
        imageLabels[currentImageIndex].pop();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.src = imagesList[currentImageIndex];
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            // Draw all remaining bounding boxes
            drawAllBoxes();
        }

        // Remove the last label from the label bar
        if (labelbar.lastChild) {
            labelbar.removeChild(labelbar.lastChild);
        }
    }
});