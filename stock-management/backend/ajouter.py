from flask import Flask, request, jsonify, send_from_directory
import pandas as pd
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../frontend')
CORS(app)

FILE_PATH = "data.csv"
IMAGE_FOLDER = os.path.join(os.path.dirname(__file__), "images")

# Charger les données du CSV
def load_data():
    return pd.read_csv(FILE_PATH, sep=';')

# Sauvegarder les données dans le CSV
def save_data(df):
    df.to_csv(FILE_PATH, sep=';', index=False)

# Servir la page HTML
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

# Servir les images
@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(IMAGE_FOLDER, filename)

# Récupérer les données des produits
@app.route('/stock', methods=['GET'])
def get_stock():
    df = load_data()
    df["Image Path"] = df["Image Path"].apply(lambda img: f"http://127.0.0.1:5000/images/{os.path.basename(img)}")
    stock = df.to_dict(orient='records')
    return jsonify(stock)

if __name__ == '__main__':
    app.run(debug=True)
