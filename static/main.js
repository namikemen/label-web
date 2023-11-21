
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const saveButton = document.getElementById('saveButton');
const UndoButton = document.getElementById('UndoButton');
const addLabelButton = document.getElementById('addLabelButton');
const sidebar = document.getElementById('sidebar');
const labelbar = document.getElementById('labelbar');
const imageUpload = document.getElementById('imageUpload');
const selectElement = document.getElementById('labelSelect');
const selectedLabel = document.getElementById('selectElement.value');


let img; // declare img variable
let drawing = false;
let labels = [];
let rect;
let mouseX, mouseY;
let scaleX, scaleY;
let startX, startY, endX, endY;
let xmin, ymin, xmax, ymax;
let img2;
let imagesList = [];
let imageNames = [];
let selectedBox = null;
let labelId = 'label1';
let currentImageIndex = 0; // Keep track of the current image
let imageLabels = {}; // Keep track of the labels for each image
let originalHeight;
let originalWidth;
let colorMap = {};


// Set up the label fields
let labelFields = document.querySelectorAll('.label-field');
function setupLabelField(field) {
    const inputField = field.querySelector('input');

    field.addEventListener('click', function() {
        labelId = inputField.value;
    });

    // Update colorMap when a new value is inputted
    inputField.addEventListener('input', function() {
        // Get the background color of the field
        const backgroundColor = window.getComputedStyle(field).backgroundColor;

        // Get the new value of the input field
        const newLabelValue = this.value;

        // Update the colorMap with the new value
        colorMap[newLabelValue] = backgroundColor;
    });
}

// Set up the existing label fields
labelFields.forEach(setupLabelField);



document.getElementById('imageUpload').addEventListener('change', function(event) {
        const files = event.target.files;
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
        div.textContent = `${box.labelId} (id: ${i}): (${box.xmin}, ${box.ymin}), (${box.xmax}, ${box.ymax})`;

        // Create the 'x' element
        const x = document.createElement('span');
        x.textContent = ' x';
        x.style.cursor = 'pointer';
        x.style.float = 'right';

        // Add a click event listener to the 'x' element
        x.addEventListener('click', function() {
            // Remove the bbox from imageLabels
            imageLabels[currentImageIndex].splice(i, 1);

            // Update the label bar
            updateLabelbar();
            drawAllBoxes();
        });

        // Append the 'x' element to the div
        div.appendChild(x);

        labelbar.appendChild(div);
    }
}

/////////////////////////////////
//////////// DRAWING ////////////
/////////////////////////////////

function drawAllBoxes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = imagesList[currentImageIndex];
    ctx.drawImage(img, 0, 0);
    // Draw all existing bounding boxes
    for (let i = 0; i < imageLabels[currentImageIndex].length; i++) {
        const box = imageLabels[currentImageIndex][i];
        ctx.beginPath();
        ctx.rect(box.xmin, box.ymin, box.xmax - box.xmin, box.ymax - box.ymin);
        ctx.strokeStyle = colorMap[box.labelId];
        ctx.lineWidth = 2;
        ctx.stroke();
        // Draw the coordinates beside the bounding box
        ctx.fillStyle = colorMap[box.labelId];
        ctx.font = '12px Arial';
        ctx.fillText(`id: ${i} (${box.xmin}, ${box.ymin})`, box.xmin, box.ymin - 5);
        ctx.fillText(`(${box.xmax}, ${box.ymax})`, box.xmax, box.ymax + 15);
    }
    
}



// Start drawing bounding box when the mouse is clicked
canvas.addEventListener('mousedown', function(event) {
    // Get the mouse coordinates
    rect = canvas.getBoundingClientRect();
    scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    mouseX = parseInt((event.clientX - rect.left) * scaleX);  // scale mouse coordinates after they have
    mouseY = parseInt((event.clientY - rect.top) * scaleY); 

    

    // Check if the mouse is inside an existing bounding box
    
    for (let i = 0; i < imageLabels[currentImageIndex].length; i++) {
        const box = imageLabels[currentImageIndex][i];
        const midX = (box.xmin + box.xmax) / 2;
        const midY = (box.ymin + box.ymax) / 2;

        if (mouseX >= box.xmin && mouseX <= box.xmax && mouseY >= box.ymin && mouseY <= box.ymax) {
            selectedBox = i;
            drawing = true;

            // Remove the previous bounding box from imageLabels
            imageLabels[currentImageIndex].splice(i, 1);

            // Determine which quadrant the mouse is in and fix the opposite corner
            if (mouseX <= midX && mouseY <= midY) {
                // Top left quadrant, fix bottom right corner
                startX = box.xmax;
                startY = box.ymax;
            } else if (mouseX > midX && mouseY <= midY) {
                // Top right quadrant, fix bottom left corner
                startX = box.xmin;
                startY = box.ymax;
            } else if (mouseX <= midX && mouseY > midY) {
                // Bottom left quadrant, fix top right corner
                startX = box.xmax;
                startY = box.ymin;
            } else {
                // Bottom right quadrant, fix top left corner
                startX = box.xmin;
                startY = box.ymin;
            }

            drawAllBoxes();
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
        
        endX = parseInt((event.clientX - rect.left) * scaleX);  // scale mouse coordinates after they have
        endY = parseInt((event.clientY - rect.top) * scaleY)

        // Calculate xmin, ymin, xmax, ymax
        xmin = Math.min(startX, endX);
        ymin = Math.min(startY, endY);
        xmax = Math.max(startX, endX);
        ymax = Math.max(startY, endY);


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.src = imagesList[currentImageIndex];
        ctx.drawImage(img, 0, 0);

        // Draw all existing bounding boxes
        drawAllBoxes();

        // Draw the new or selected bounding box
        ctx.beginPath();
        ctx.rect(startX, startY, endX - startX, endY - startY);
        ctx.strokeStyle = colorMap[labelId];
        ctx.lineWidth = 2;
        ctx.stroke();
        // Draw the coordinates beside the new or selected bounding box
        ctx.fillStyle = colorMap[labelId];
        ctx.font = '12px Arial';
        ctx.fillText(`(${xmin}, ${ymin})`, xmin, ymin - 5);
        ctx.fillText(`(${xmax}, ${ymax})`, xmax, ymax + 15);

        selectedBox = null;
    }   
});

document.addEventListener('keydown', function(event) {
    console.log(colorMap);
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
        drawAllBoxes();
        
    };
});

// Stop drawing bounding box when the mouse is released
canvas.addEventListener('mouseup', function(event) {
    drawing = false;

    const xmin = Math.min(startX, endX);
    const ymin = Math.min(startY, endY);
    const xmax = Math.max(startX, endX);
    const ymax = Math.max(startY, endY);

    // If a bounding box was selected, update its coordinates
    // Push the new label into the array
    imageLabels[currentImageIndex].push({
        xmin: xmin,
        ymin: ymin,
        xmax: xmax,
        ymax: ymax,
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
            const width = box.xmax - box.xmin;
            const height = box.ymax - box.ymin;
            const centerX = box.xmin + width / 2;
            const centerY = box.ymin + height / 2;

            // Normalize the coordinates
            const normalizedWidth = width / originalWidth;
            const normalizedHeight = height / originalHeight;
            const normalizedCenterX = centerX / originalWidth;
            const normalizedCenterY = centerY / originalHeight;
    
            yoloLabels.push([box.labelId, normalizedCenterX, normalizedCenterY, normalizedWidth, normalizedHeight]);
        }
        output[imageNames[i]] = yoloLabels;
    }
    
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

addLabelButton.addEventListener('click', function() {
    // Create a new label field
    const labelField = document.createElement('div');
    labelField.className = 'label-field';

    // Create an input field inside the label field
    const inputField = document.createElement('input');
    inputField.type = 'text';
    labelField.appendChild(inputField);

    // Create a color picker inside the label field
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    labelField.appendChild(colorPicker);

    colorPicker.addEventListener('input', function() {
        // Set the background color of the label field to the chosen color
        labelField.style.backgroundColor = this.value;

        // Add the chosen color to the colorMap for the current label
        colorMap[inputField.value] = this.value;
    });
    // Append the label field to the .Tools div
    document.querySelector('.Tools').appendChild(labelField);
    setupLabelField(labelField);
    // Add event listeners to the new label field and input field
    // Similar to the ones you added to the existing label fields...
});


let lastKey = null;
let lastKeyTime = null;

window.addEventListener('keydown', function(event) {
    if (lastKey === event.key && Date.now() - lastKeyTime < 500) {
        switch (event.key.toUpperCase()) {
            case 'U':
                // Trigger undo button
                UndoButton.click();
                break;
            case 'A':
                // Trigger add label
                addLabelButton.click();
                // Replace with your actual function to add label
                break;
            case 'S':
                // Trigger save label
                saveButton.click();
                // Replace with your actual function to save label
                break;
        }
    }

    lastKey = event.key;
    lastKeyTime = Date.now();
});