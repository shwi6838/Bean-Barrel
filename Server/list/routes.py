from flask import Blueprint, request, jsonify, session
import Database.brew_data as db


list = Blueprint('list', __name__)

@app.route("/api/favorites", methods=["GET"])
def get_favorites_list():
    if "userid" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session["userid"]
    fav_ids = db.search_favourite_list(user_id)

    # Convert string IDs to match store schema (assuming they're store_id, not _id)
    stores = list(store_collection.find({"store_id": {"$in": fav_ids}}))

    # Convert ObjectId to string for frontend
    for s in stores:
        s["_id"] = str(s["_id"])

    return jsonify(stores)


@app.route("/api/favorites", methods=["POST"])
def add_favorite_list():
    if "userid" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session["userid"]
    data = request.json
    store_id = data.get("store_id")

    if not store_id:
        return jsonify({"error": "Missing store_id"}), 400

    success = brew_data.add_to_favourite(user_id, store_id)
    if success:
        return jsonify({"message": "Favorite added"}), 200
    else:
        return jsonify({"message": "Already exists or error"}), 400

@app.route("/api/favorites/<store_id>", methods=["DELETE"])
def remove_favorite_list(store_id):
    if "userid" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session["userid"]

    # Remove store_id from favourite_id list
    result = favourite_collection.update_one(
        {"user_id": user_id},
        {"$pull": {"favourite_id": store_id}}
    )

    if result.modified_count == 0:
        return jsonify({"error": "Store not found in favorites"}), 404

    return jsonify({"message": "Favorite removed"}), 200


