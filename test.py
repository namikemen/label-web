from tkinter import *
from PIL import Image, ImageTk
import os
import json
from PIL import ImageDraw, ImageFont

class AutoScrollbar(Scrollbar):
    # a scrollbar that hides itself if it's not needed.  only
    # works if you use the grid geometry manager.
    def set(self, lo, hi):
        if float(lo) <= 0.0 and float(hi) >= 10:
            # grid_remove is currently missing from Tkinter!
            self.pack_forget()
        else:
            if self.cget("orient") == HORIZONTAL:
                self.pack(fill=X)
            else:
                self.pack(fill=Y)
        Scrollbar.set(self, lo, hi)
    def grid(self, **kw):
        raise TclError
    def place(self, **kw):
        raise TclError

def load_images(folder_path):
    images = []
    for filename in os.listdir(folder_path):
        if filename.endswith(".jpg") or filename.endswith(".png"):
            image_path = os.path.join(folder_path, filename)
            image = Image.open(image_path)
            
            # images.append(resized_image)
            images.append(image)
    return images

def show_image(image):
    # update the label with the original image
    photo = ImageTk.PhotoImage(image)
    image_label.configure(image=photo)
    image_label.image = photo

def button_click(image):
    # show the image in the right frame
    show_image(image)
    
    # create a text box for the label
    label_entry.delete(0, END)
    label_entry.pack(fill=X)
    
    # save the label when the user presses Enter
    def save_label(event):
        labels[image.filename] = label_entry.get()
        label_entry.delete(0, END)
    label_entry.bind("<Return>", save_label)

def save_labels():
    # save the labels dictionary to a JSON file
    with open("labels.json", "w") as f:
        json.dump(labels, f)

# create scrolled canvas
root = Tk()
root.geometry("1000x600")

# create left frame for buttons
left_frame = Frame(root, width=1)
left_frame.pack(side=LEFT, fill=BOTH, expand=True)

vscrollbar = AutoScrollbar(left_frame)
canvas = Canvas(left_frame, yscrollcommand=vscrollbar.set)
canvas.pack(side=LEFT, fill=BOTH, expand=True)
vscrollbar.pack(side=RIGHT, fill=Y)
vscrollbar.config(command=canvas.yview)

# make the canvas expandable
left_frame.grid_rowconfigure(0, weight=1)
left_frame.grid_columnconfigure(0, weight=1)

# create canvas contents
frame = Frame(canvas)
frame.rowconfigure(1, weight=1)
frame.columnconfigure(1, weight=1)

# load images from folder
images = load_images("data/testing_images")

# create buttons for each image
rows = len(images)
for i in range(rows):
    image = images[i]
    resized_image = image.resize((int(image.width/5), int(image.height/5)))
    photo = ImageTk.PhotoImage(resized_image)
    button = Button(frame, padx=2, pady=2, image=photo, command=lambda image=image: button_click(image))
    button.image = photo
    button.grid(row=i, column=0, sticky='news')
    # store the filename of the image as a button attribute
    button.filename = os.path.basename(image.filename)

canvas.create_window(0, 0, anchor=NW, window=frame)
frame.update_idletasks()
canvas.config(scrollregion=canvas.bbox("all"))

# create right frame for image display and labeling
right_frame = Frame(root)
right_frame.pack(side=RIGHT, fill=BOTH, expand=True)

# create label for image display
image_label = Label(right_frame)
image_label.pack(fill=BOTH, expand=True)

# create label and text box for image labeling
label_text = Label(right_frame, text="Enter label:")
label_text.pack(fill=X)
label_entry = Entry(right_frame)

# create dictionary to store labels
labels = {}

# create "Save" button to save labels to JSON file
save_button = Button(right_frame, text="Save", command=save_labels)
save_button.pack(side=BOTTOM)

root.mainloop()
def show_image(image, label=None):
    # create a copy of the original image
    image_copy = image.copy()
    
    # draw the label on the image if provided
    if label:
        draw = ImageDraw.Draw(image_copy)
        font = ImageFont.truetype("arial.ttf", 16)
        draw.text((10, 10), label, fill=(255, 0, 0), font=font)
    
    # update the label with the modified image
    photo = ImageTk.PhotoImage(image_copy)
    image_label.configure(image=photo)
    image_label.image = photo
