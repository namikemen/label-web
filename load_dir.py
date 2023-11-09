
import cv2
import os
import tkinter as tk
from tkinter import filedialog
# Define function to create sidebar


# Define constants for the sidebar
SIDEBAR_WIDTH = 150
SIDEBAR_IMAGE_SIZE = 100

def create_sidebar(images, current_image_index):
    sidebar = None
    for i, image in enumerate(images):
        # Resize image to fit in sidebar
        resized_image = resize_image(image, SIDEBAR_IMAGE_SIZE)
        # Add border to image
        bordered_image = cv2.copyMakeBorder(resized_image, 10, 10, 10, 10, cv2.BORDER_CONSTANT, None, value=[255, 255, 255])
        # Add image to sidebar
        if sidebar is None:
            sidebar = bordered_image
        else:
            sidebar = cv2.vconcat([sidebar, bordered_image])
        # Add small version of image to sidebar
        small_image = resize_image(image, 50)
        if i == current_image_index:
            small_image = cv2.copyMakeBorder(small_image, 5, 5, 5, 5, cv2.BORDER_CONSTANT, None, value=[0, 255, 0])
        else:
            small_image = cv2.copyMakeBorder(small_image, 5, 5, 5, 5, cv2.BORDER_CONSTANT, None, value=[255, 255, 255])
        sidebar = cv2.hconcat([sidebar, small_image])
    return sidebar
# Define function to resize image to fit in sidebar
def resize_image(image, SIDEBAR_IMAGE_SIZEs):
    height, width, _ = image.shape
    ratio = SIDEBAR_IMAGE_SIZE / max(height, width)
    return cv2.resize(image, (int(width * ratio), int(height * ratio)))


# Define function to update main image and sidebar
def update_images(images, current_image_index, main_image_window, sidebar_window):
    # Update main image
    cv2.imshow(main_image_window, images[current_image_index])
    # Update sidebar
    sidebar = create_sidebar(images, current_image_index)
    cv2.imshow(sidebar_window, sidebar)

# Define function to handle key presses
def handle_key_press(key, images, current_image_index, main_image_window, sidebar_window):
    if key == ord('q'):
        cv2.destroyAllWindows()
    elif key == ord('n'):
        current_image_index = (current_image_index + 1) % len(images)
        update_images(images, current_image_index, main_image_window, sidebar_window)
    elif key == ord('p'):
        current_image_index = (current_image_index - 1) % len(images)
        update_images(images, current_image_index, main_image_window, sidebar_window)
    return current_image_index

# Define function to load images from folder
def load_images_from_folder(folder_path):
    images = []
    for filename in os.listdir(folder_path):
        if filename.endswith('.jpg') or filename.endswith('.png'):
            img = cv2.imread(os.path.join(folder_path, filename))
            if img is not None:
                images.append(img)
    return images

# Define function to open folder dialog
def open_path():
    root = tk.Tk()
    root.withdraw()
    folder_path = filedialog.askdirectory()
    return folder_path

# Load images from folder
folder_path = open_path()
images = load_images_from_folder(folder_path)

# Create main image window
cv2.namedWindow("Image")
cv2.moveWindow("Image", SIDEBAR_WIDTH, 0)

# Create sidebar window
cv2.namedWindow("Sidebar")
cv2.moveWindow("Sidebar", 0, 0)

# Update main image and sidebar
current_image_index = 0
update_images(images, current_image_index, "Image", "Sidebar")

# Handle key presses
while True:
    key = cv2.waitKey(0)
    current_image_index = handle_key_press(key, images, current_image_index, "Image", "Sidebar")
    if key == ord('q'):
        break

cv2.destroyAllWindows()

