
export function handleLabelSaving(saveButton, labels) {
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
}

export function handleLabelDeletion(deleteButton, labels) {
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
}
