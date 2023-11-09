// Handle image uploads
function handleFileUpload(event, canvas, ctx) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(event) {
            img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(file);
    }
}

export { handleFileUpload }

// Add event listener to file input
// imageUpload.addEventListener('change', function(event) {
//     handleFileUpload(event, canvas, ctx);
// });



