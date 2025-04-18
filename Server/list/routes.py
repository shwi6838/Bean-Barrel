from flask import Blueprint, Response, request, jsonify, session
import Database.brew_data as db
from bson.json_util import dumps
favlist = Blueprint('list', __name__)

@favlist.route("/all", methods=["GET"])
def get_all_list():
    res = db.get_all_shop_info()
    formatted_res = []
    for item in res:
        formatted_res.append({
            "_id": str(item[0]),  # 转换 ObjectId
            "name": item[1],
            "lat": item[2],
            "lng": item[3],
            "place_id":item[4],
            "types":item[5],
            "img":db.get_shop_photo_by_reference(item[6]),
            "rating":item[7],
            "address": item[10],
            "opening_hours":item[11],
            "phone": item[12],
            "url": item[13]
            # 可选加更多字段
        })
    return jsonify(formatted_res)

@favlist.route("/favorites", methods=["GET"])
def get_favorites_list():
    if "userid" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session["userid"]
    fav_ids = db.search_favourite_list(user_id)

    return jsonify(fav_ids)

@favlist.route("/favorites", methods=["POST"])
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


@favlist.route("/favorites/<store_id>", methods=["DELETE"])
def remove_favorite_list(store_id):
    if "userid" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user_id = session["userid"]
    success = db.delete_from_favourite(user_id, store_id)

    if success:
        return jsonify({"message": "Favorite removed"}), 200
    else:
        return jsonify({"error": "Store not found in favorites or failed to remove"}), 404
