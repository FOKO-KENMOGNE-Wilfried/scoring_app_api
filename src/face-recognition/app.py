from flask import Flask, jsonify, request
import face_recognition
import numpy as np

app = Flask(__name__)

@app.route("/extract_embedding", methods=["POST"])
def extract_embedding():
    image_data = request.files['image']  # On attend une image
    image = face_recognition.load_image_file(image_data)

    # Extraire les embeddings du visage
    face_encoding = face_recognition.face_encodings(image)

    if len(face_encoding) > 0:
        embedding = face_encoding[0].tolist()  # Convertir l'array numpy en liste
        return jsonify({"embedding": embedding})
    else:
        return jsonify({"error": "Aucun visage détecté"}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
