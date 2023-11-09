from fastapi import FastAPI, WebSocket, UploadFile, File
from fastapi.staticfiles import StaticFiles
from typing import List
import os
import shutil
import json

app = FastAPI()

# Serve static files 
app.mount("/static", StaticFiles(directory="static"), name="static")
 
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):     
    await websocket.accept()
    while True: 
        data = await websocket.receive_text() 
        await websocket.send_text(f"Message text was: {data}")  

@app.post("/uploadfiles/")
async def create_upload_files(files: List[UploadFile] = File(...)): 
    for file in files:
        with open(os.path.join("static", file.filename), "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    return {"filenames": [file.filename for file in files]}
 
@app.post("/savelabels/")   
async def save_labels(labels: List[dict]): 
    with open('labels.json', 'w') as f:
        json.dump(labels, f) 
    return {"message": "Labels saved successfully"}  
 
 
 