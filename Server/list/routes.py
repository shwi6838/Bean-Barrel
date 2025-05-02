from flask import Blueprint, request, jsonify, session
import Database.brew_data as db
favlist = Blueprint('list', __name__)

@favlist.route("/all", methods=["GET"])
def get_all_list():
    res = db.get_all_shop_info()
    formatted_res = []
    for item in res:
        formatted_res.append({
            "_id": str(item[0]), 
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
    print(data)
    store_id = data.get("store_id")

    if not store_id:
        return jsonify({"error": "Missing store_id"}), 400

    success = db.add_to_favourite(user_id, store_id)
    favlist = db.search_favourite_list(user_id) 
    session['favlist'] = favlist

    shop_favlist = []
    for i in favlist:
        r = db.get_shop_info_by_id(i)
        if r:
            shop_favlist.append(r[1])
    session['favlist_name'] = shop_favlist

    if success:
        return jsonify({"message": "Favorite added"}), 200
    else:
        return jsonify({"error": "Already exists or failed to add"}), 400


@favlist.route("/delete", methods=["DELETE"])
def remove_favorite_list():
    
    if "userid" not in session:
        return jsonify({"error": "Unauthorized"}), 401
    print(session)
    user_id = session['userid']
    data = request.get_json()


    if data['id'] not in session['favlist_name']:
        return jsonify({"error": "Shop not found in favorites."}), 400
    
    index = session['favlist_name'].index(data['id'])
    shop_id = session['favlist'][index]

    success = db.delete_from_favourite(user_id, shop_id)
    favlist = db.search_favourite_list(user_id) 
    session['favlist'] = favlist

    shop_favlist = []
    for i in favlist:
        r = db.get_shop_info_by_id(i)
        if r:
            shop_favlist.append(r[1])
    session['favlist_name'] = shop_favlist

    if not success:
        return jsonify({"error": "Already exists or failed to add"}), 400
    
    return jsonify({"message": "Favorite Delete"}), 200
    
        
