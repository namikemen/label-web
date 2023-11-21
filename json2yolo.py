import json

# Load the data from the JSON file
with open('labels.json') as f:
    data = json.load(f)

# For each key-value pair in the data
for filename, labels in data.items():
    # Create a new text file with the key as the filename
    with open(f'yolo_label/{filename}.txt', 'w') as f:
        # For each label in the list
        for label in labels:
            # Write the label to the file, followed by a newline
            f.write(' '.join(map(str, label)) + '\n')  