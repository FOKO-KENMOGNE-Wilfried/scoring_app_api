import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import face_recognition
import psycopg2
import numpy as np
load_dotenv()

app = Flask(__name__)

# Connexion à la base de données PostgreSQL
def get_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_DATABASE"),
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )


# Dictionnaire pour stocker les données des utilisateurs (id et encodages faciaux)
user_faces = {}

@app.route('/verify', methods=['POST'])
def verify_user():
    try:
        connection = get_connection()
        cursor = connection.cursor()
    except Exception as e:
        return jsonify({'error': f'Erreur de connexion à la base de données : {str(e)}'}), 500

    user_id = request.form['user_id']
    image_file = request.files['profile']
    image = face_recognition.load_image_file(image_file)

    face_encoding = face_recognition.face_encodings(image)
    if face_encoding:
        input_encoding = face_encoding[0]

        # Charger les encodages existants
        cursor.execute("SELECT face_encodings FROM employee WHERE id = %s", (user_id,))
        result = cursor.fetchone()
        cursor.close()
        connection.close()

        if result and result[0]:
            existing_encodings = json.loads(result[0])  # Convertir JSON en liste

            # Comparer avec tous les encodages existants
            matches = face_recognition.compare_faces(existing_encodings, input_encoding)
            if any(matches):
                return jsonify({'message': 'Utilisateur reconnu avec succès !'}), 200
        return jsonify({'error': 'Utilisateur non reconnu !'}), 400
    return jsonify({'error': 'Aucun visage détecté !'}), 400


import json

@app.route('/train', methods=['POST'])
def train_user():
    try:
        connection = get_connection()
        cursor = connection.cursor()
        print("Connection established")
    except Exception as e:
        return jsonify({'error': f'Erreur de connexion à la base de données : {str(e)}'}), 500

    user_id = request.form['user_id']
    image_file = request.files['image']
    image = face_recognition.load_image_file(image_file)

    face_encoding = face_recognition.face_encodings(image)
    if face_encoding:
        new_encoding = face_encoding[0].tolist()

        # Charger les encodages existants
        cursor.execute("SELECT face_encodings FROM employee WHERE id = %s", (user_id,))
        result = cursor.fetchone()

        if result and result[0]:
            existing_encodings = json.loads(result[0])  # Convertir JSON en liste
        else:
            existing_encodings = []

        # Ajouter le nouvel encodage et limiter le nombre total
        existing_encodings.append(new_encoding)
        if len(existing_encodings) > 5:  # Maximum 5 encodages
            existing_encodings.pop(0)

        # Enregistrer les encodages mis à jour
        cursor.execute(
            "UPDATE employee SET face_encodings = %s WHERE id = %s",
            (json.dumps(existing_encodings), user_id)
        )
        connection.commit()
        connection.close()

        return jsonify({'message': 'Encodage facial mis à jour avec succès !'})
    return jsonify({'error': 'Aucun visage détecté !'}), 400



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
