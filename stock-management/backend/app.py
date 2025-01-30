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

# Servir les images
@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(IMAGE_FOLDER, filename)

# Récupérer tous les produits avec leurs détails
@app.route('/stock', methods=['GET'])
def get_stock():
    df = load_data()
    df["Image Path"] = df["Image Path"].apply(lambda img: f"http://127.0.0.1:5000/images/{os.path.basename(img)}")
    stock = df.to_dict(orient='records')
    return jsonify(stock)

# Mettre à jour la quantité d'un produit
@app.route('/update_quantity', methods=['POST'])
def update_quantity():
    data = request.json
    vegetable = data.get('vegetable')
    quantity_change = int(data.get('quantity_change', 0))

    df = load_data()

    if vegetable not in df['Vegetable'].values:
        return jsonify({"error": "Produit non trouvé"}), 404

    index = df[df['Vegetable'] == vegetable].index[0]
    df.at[index, 'Quantity'] = max(0, df.at[index, 'Quantity'] + quantity_change)  # Empêcher quantité négative
    save_data(df)

    return jsonify({"message": "Mise à jour réussie", "new_quantity": df.at[index, 'Quantity']})

# Ajouter un produit
@app.route('/add_product', methods=['POST'])
def add_product():
    data = request.json
    vegetable = data.get('vegetable')
    quantity = int(data.get('quantity', 0))
    expiration_date = data.get('expiration_date')
    image_path = data.get('image_path')

    df = load_data()
    new_product = {
        "Vegetable": vegetable,
        "Quantity": quantity,
        "Expiration Date": expiration_date,
        "Image Path": image_path
    }

    df = df.append(new_product, ignore_index=True)
    save_data(df)

    return jsonify({"message": "Produit ajouté avec succès!"})

# Mettre à jour les informations d'un produit
@app.route('/update_product', methods=['POST'])
def update_product():
    data = request.json
    vegetable = data.get('vegetable')
    quantity = int(data.get('quantity', 0))
    expiration_date = data.get('expiration_date')
    image_path = data.get('image_path')

    df = load_data()

    if vegetable not in df['Vegetable'].values:
        return jsonify({"error": "Produit non trouvé"}), 404

    index = df[df['Vegetable'] == vegetable].index[0]
    df.at[index, 'Quantity'] = quantity
    df.at[index, 'Expiration Date'] = expiration_date
    df.at[index, 'Image Path'] = image_path
    save_data(df)

    return jsonify({"message": "Produit mis à jour avec succès!"})

if __name__ == '__main__':
    app.run(debug=True)
