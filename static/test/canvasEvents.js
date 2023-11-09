export function handleDrawing(canvas, ctx, labels) {
    let drawing = false;
    let startX, startY, endX, endY;
    let selectedBox = null;

    canvas.addEventListener('mousedown', function(event) {
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
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 2;
                ctx.stroke();
                // Draw the coordinates beside the bounding box
                ctx.fillStyle = 'green';
                ctx.font = '12px Arial';
                ctx.fillText(`(${box.startX}, ${box.startY})`, box.startX, box.startY - 5);
                ctx.fillText(`(${box.endX}, ${box.endY})`, box.endX, box.endY + 15);
            }

            // Draw the new or selected bounding box
            ctx.beginPath();
            ctx.rect(startX, startY, endX - startX, endY - startY);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Draw the coordinates beside the new or selected bounding box
            ctx.fillStyle = 'red';
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
                endY: endY
            });
        }
    });
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
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 5;
            ctx.stroke();
            // Draw the coordinates beside the bounding box
            ctx.fillStyle = 'green';
            ctx.font = '12px Arial';
            ctx.fillText(`(${box.startX}, ${box.startY})`, box.startX, box.startY - 5);
            ctx.fillText(`(${box.endX}, ${box.endY})`, box.endX, box.endY + 15);
        }

        // Draw the new or selected bounding box
        ctx.beginPath();
        ctx.rect(startX, startY, endX - startX, endY - startY);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.stroke();
        // Draw the coordinates beside the new or selected bounding box
        ctx.fillStyle = 'red';
        ctx.font = '12px Arial';
        ctx.fillText(`(${startX}, ${startY})`, startX, startY - 5);
        ctx.fillText(`(${endX}, ${endY})`, endX, endY + 15);
    }   
});
