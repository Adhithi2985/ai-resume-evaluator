# 📁 main.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
import difflib

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text(file: UploadFile):
    reader = PdfReader(file.file)
    return "\n".join(page.extract_text() or "" for page in reader.pages)

@app.post("/upload/")
async def upload_resume(
    resume: UploadFile = File(...),
    mode: str = Form(...),
    jd: UploadFile = File(None)
):
    try:
        resume_text = extract_text(resume)

        # Basic keyword-based scoring
        keywords = ["Python", "React", "Machine Learning", "SQL", "API", "Intern"]
        score = sum(1 for kw in keywords if kw.lower() in resume_text.lower())

        # If HR uploads a JD, calculate similarity
        if mode == "HR" and jd:
            jd_text = extract_text(jd)
            matcher = difflib.SequenceMatcher(None, jd_text.lower(), resume_text.lower())
            similarity = round(matcher.ratio() * 100, 2)
            return { "text": resume_text, "score": score, "similarity": similarity }

        return { "text": resume_text, "score": score }

    except Exception as e:
        return { "error": str(e) }

@app.get("/")
async def root():
    return { "message": "AI Resume Evaluator API is live!" }









