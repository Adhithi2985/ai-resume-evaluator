import firebase_admin
from firebase_admin import credentials, firestore

# Replace with your downloaded key path
cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
