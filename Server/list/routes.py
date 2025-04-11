from flask import Blueprint, request, jsonify, session
import Database.brew_data as db


list = Blueprint('list', __name__)

@app.route("/api/favorites", methods=["GET"])
def get_favorites_list():
    if "userid" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session["userid"]
    fav_ids = db.search_favourite_list(user_id)

    return jsonify(fav_ids)

@app.route("/api/favorites", methods=["POST"])
def add_favorite_list():
    if "userid" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session["userid"]
    data = request.get_json()
    store_id = data.get("store_id")

    if not store_id:
        return jsonify({"error": "Missing store_id"}), 400

    success = db.add_to_favourite(user_id, store_id)

    if success:
        return jsonify({"message": "Favorite added"}), 200
    else:
        return jsonify({"error": "Already exists or failed to add"}), 400


@app.route("/api/favorites/<store_id>", methods=["DELETE"])
def remove_favorite_list(store_id):
    if "userid" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session["userid"]
    success = db.delete_from_favourite(user_id, store_id)

    if success:
        return jsonify({"message": "Favorite removed"}), 200
    else:
        return jsonify({"error": "Store not found in favorites or failed to remove"}), 404
