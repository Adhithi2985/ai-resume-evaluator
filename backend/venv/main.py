from fastapi import FastAPI, File, UploadFile, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz  # PyMuPDF
import re

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Extract text from uploaded PDF
async def extract_text_from_pdf(file: UploadFile) -> str:
    try:
        contents = await file.read()
        doc = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        print("❌ PDF extraction failed:", e)
        return ""

# Score resume based on JD match
def evaluate_resume(resume_text, jd_text=None):
    resume_words = set(re.findall(r"\w+", resume_text.lower()))
    if jd_text:
        jd_words = set(re.findall(r"\w+", jd_text.lower()))
        matched = resume_words & jd_words
        similarity = round((len(matched) / len(jd_words)) * 100, 2) if jd_words else 0
        score = min(10, max(1, int(similarity // 10)))
        suggestions = [word for word in jd_words if word not in resume_words]
        return score, similarity, suggestions[:5]
    else:
        score = min(10, max(1, len(resume_words) // 100))
        return score, None, ["Add more keywords from job descriptions."]

# Route for file upload and evaluation
@app.post("/upload/")
async def upload(resume: UploadFile = File(...), jd: UploadFile = File(None), mode: str = Form(...)):
    resume_text = await extract_text_from_pdf(resume)
    if not resume_text:
        return {"error": "Failed to extract text from resume."}

    jd_text = await extract_text_from_pdf(jd) if jd else None
    score, similarity, suggestions = evaluate_resume(resume_text, jd_text)

    return {
        "score": score,
        "similarity": similarity,
        "suggestions": suggestions,
        "text": resume_text[:1000]  # Send preview text
    }

# Chat support route (if you keep chatbot)
@app.post("/chat/")
async def chat_endpoint(request: Request):
    data = await request.json()
    message = data.get("message", "")
    if "resume" in message.lower():
        return {"reply": "Use strong action verbs and tailor your resume to each job."}
    elif "skills" in message.lower():
        return {"reply": "Add technical + soft skills relevant to the job description."}
    elif "jd" in message.lower() or "job description" in message.lower():
        return {"reply": "Include role summary, key responsibilities, and required skills in your JD."}
    else:
        return {"reply": "Try asking about resumes, skills, or JD tips."}
















