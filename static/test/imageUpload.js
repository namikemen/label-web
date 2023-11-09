export function handleImageUpload(canvas, ctx, imageUpload) {
    let img = new Image();

    imageUpload.addEventListener('change', function() {
        const reader = new FileReader();

        reader.onload = function(event) {
            
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(this.files[0]);
    });

    return img;
}