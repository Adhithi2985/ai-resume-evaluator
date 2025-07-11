from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import spacy
import re
from datetime import datetime
from firebase_config import db
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# CORS to connect with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load NLP model
nlp = spacy.load("en_core_web_sm")

@app.get("/")
def root():
    return {"message": "Resume Evaluator API running!"}

# Extract name, email, phone, and skills
def extract_details(text):
    doc = nlp(text)
    details = {}

    for ent in doc.ents:
        if ent.label_ == "PERSON":
            details["name"] = ent.text
            break

    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    details["email"] = email_match.group(0) if email_match else ""

    phone_match = re.search(r"\+?\d[\d\s\-\(\)]{8,15}", text)
    details["phone"] = phone_match.group(0) if phone_match else ""

    keywords = ["python", "java", "react", "sql", "excel", "django", "html", "css", "fastapi", "machine learning"]
    details["skills"] = [kw for kw in keywords if kw.lower() in text.lower()]

    return details

# Upload resume and extract text + save to Firestore
@app.post("/upload-resume/")
async def upload_resume(file: UploadFile = File(...)):
    contents = await file.read()
    with open("temp_resume.pdf", "wb") as f:
        f.write(contents)

    doc = fitz.open("temp_resume.pdf")
    text = ""
    for page in doc:
        text += page.get_text()

    extracted_data = extract_details(text)

    # Save to Firestore
    record = {
        "name": extracted_data.get("name", ""),
        "email": extracted_data.get("email", ""),
        "phone": extracted_data.get("phone", ""),
        "skills": extracted_data.get("skills", []),
        "resume_text": text,
        "uploaded_at": datetime.utcnow()
    }

    db.collection("resumes").add(record)

    return {
        "resume_text": text,
        "extracted_data": extracted_data
    }

# Job matching API and save match to Firestore
@app.post("/match-job/")
async def match_job(resume_text: str, job_description: str):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([resume_text, job_description])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    score_percent = round(similarity * 100, 2)

    # Save to Firestore
    db.collection("matches").add({
        "resume_text": resume_text,
        "job_description": job_description,
        "match_score": score_percent,
        "matched_at": datetime.utcnow()
    })

    return {
        "similarity_score": score_percent,
        "message": f"Resume matches {score_percent}% with the job description"
    }




