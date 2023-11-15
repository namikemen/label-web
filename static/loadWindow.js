
window.onload = function() {
        const canvas = document.getElementById('canvas'); // replace with your canvas id
        const ctx = canvas.getContext('2d');
        const sidebar = document.getElementById('sidebar');

        // Load the HTML of the sidebar from local storage
        sidebar.innerHTML = localStorage.getItem('sidebarHTML');
        // labelbar.innerHTML = localStorage.getItem('labelbarHTML');

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