// import { handleImageUpload } from './imageUpload.js';
import { handleDrawing } from './canvasEvents.js';
import { handleLabelSaving,handleLabelDeletion } from './buttonEvents.js';
import { handleImageUpload } from './imageUpload.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageUpload = document.getElementById('imageUpload');
const saveButton = document.getElementById('saveButton');
const deleteButton = document.getElementById('deleteButton');
let labels = [];
let img; 

// Handle image uploads
imageUpload.addEventListener('change', function() {
    const reader = new FileReader();

    reader.onload = function(event) {
        img = new Image(); // assign img variable
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(this.files[0]);
});

// handleImageUpload(canvas, ctx, imageUpload);
handleDrawing(canvas, ctx, labels);
handleLabelSaving(saveButton, labels);
handleLabelDeletion(deleteButton, labels, canvas, ctx, img);