window.onload = function() {
    const canvas = document.getElementById('your-canvas-id'); // replace with your canvas id
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
    }

    // Retrieve the image source from the local storage
    img.src = localStorage.getItem('selectedImage');
}