# main.py — FastAPI Backend with Resume Scoring and OpenAI Suggestions
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
import io
import re
import openai
import os
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# Allow frontend access (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Extract text from PDF

def extract_text_from_pdf(file_bytes):
    pdf_reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text() or ""
    return text.strip()

# Basic resume scoring function
def score_resume(text):
    keywords = ["Python", "JavaScript", "React", "Django", "SQL", "AWS", "Node.js", "Machine Learning"]
    score = sum(1 for kw in keywords if re.search(rf"\\b{kw}\\b", text, re.IGNORECASE))
    return min(score, 10)

# Similarity score
def calculate_similarity(resume_text, jd_text):
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([resume_text, jd_text])
    similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
    return round(similarity * 100, 2)

# Generate suggestions using OpenAI
def generate_openai_suggestions(resume_text):
    try:
        prompt = (
            "You are a resume evaluator AI. Analyze the following resume text and provide suggestions "
            "to improve formatting, keywords, and relevance for technical job applications.\n\n"
            f"Resume Text:\n{resume_text}\n\nSuggestions:"
        )

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful resume assistant."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=300,
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("OpenAI Error:", e)
        return "Could not generate suggestions at this time."

@app.post("/upload/")
async def upload_resume(
    resume: UploadFile = File(...),
    jd: UploadFile = File(None),
    mode: str = Form("Candidate")
):
    try:
        resume_bytes = await resume.read()
        resume_text = extract_text_from_pdf(resume_bytes)
        score = score_resume(resume_text)

        result = {
            "score": score,
            "text": resume_text
        }

        if mode == "HR" and jd:
            jd_bytes = await jd.read()
            jd_text = extract_text_from_pdf(jd_bytes)
            similarity = calculate_similarity(resume_text, jd_text)
            result["similarity"] = similarity

        if mode == "Candidate":
            result["suggestions"] = generate_openai_suggestions(resume_text)

        return result

    except Exception as e:
        print("Error:", e)
        return {"error": "Failed to process file."}









