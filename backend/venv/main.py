# 📁 main.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
from pydantic import BaseModel

app = FastAPI()

# Allow frontend access (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_resume(file: UploadFile = File(...), mode: str = Form(...)):
    try:
        # Read file contents
        reader = PdfReader(file.file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

        # Dummy resume scoring logic
        score = 0
        if "Python" in text: score += 2
        if "React" in text: score += 2
        if "Machine Learning" in text: score += 3
        if "Intern" in text: score += 1
        if "Project" in text: score += 2

        return { "text": text, "score": score }

    except Exception as e:
        return { "error": str(e) }

@app.get("/")
async def root():
    return { "message": "Resume Evaluator API running!" }








