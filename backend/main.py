from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import music21

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CHORDS = ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim']
CHORD_FUNCTIONS = {'C': 'I', 'Dm': 'ii', 'Em': 'iii', 'F': 'IV', 'G': 'V', 'Am': 'vi', 'Bdim': 'vii°'}
MOOD_WEIGHTS = {
    'happy': [0.3, 0.1, 0.1, 0.2, 0.2, 0.1, 0.0],
    'melancholic': [0.1, 0.3, 0.2, 0.1, 0.1, 0.2, 0.1],
    'intense': [0.1, 0.2, 0.3, 0.1, 0.1, 0.1, 0.1]
}
GENRE_WEIGHTS = {
    'pop': [0.4, 0.2, 0.1, 0.2, 0.1, 0.0, 0.0],
    'jazz': [0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.1],
    'classical': [0.2, 0.2, 0.2, 0.1, 0.1, 0.1, 0.1]
}

def generate_theory_explanation(progression, mood, genre, key):
    explanation = f"Progression ({' -> '.join(progression)}) for {mood} mood in {genre}.\n\n"
    if key != 'None':
        explanation += f"Key: {key}\n"
    explanation += "Theory:\n"
    for chord in progression:
        function = CHORD_FUNCTIONS[chord]
        explanation += f"- {chord} ({function}): Serves as the {function.lower()} chord.\n"
    return explanation

def generate_progression(mood, genre, key, tempo, length=4):
    weights = np.array(MOOD_WEIGHTS[mood]) * np.array(GENRE_WEIGHTS[genre])
    weights = weights / weights.sum()
    progression = [CHORDS[np.random.choice(len(CHORDS), p=weights)] for _ in range(length)]
    if key != 'None':
        scale = music21.scale.MajorScale(key.split()[0]) if 'Major' in key else music21.scale.MinorScale(key.split()[0])
    theory = generate_theory_explanation(progression, mood, genre, key)
    return progression, theory

@app.post("/api/generate")
async def generate(data: dict):
    mood = data.get("mood", "happy")
    genre = data.get("genre", "pop")
    key = data.get("key", "None")
    tempo = data.get("tempo", "120")
    if mood not in MOOD_WEIGHTS:
        return {"error": "Invalid mood: {mood}"}
    if genre not in GENRE_WEIGHTS:
        return {"error": "Invalid genre: {genre}"}
    chords, theory = generate_progression(mood, genre, key, tempo)
    return {"chords": chords, "theory": theory}