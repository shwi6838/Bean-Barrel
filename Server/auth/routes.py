from flask import Blueprint, request, jsonify, session
import Database.brew_data as db


auth = Blueprint('auth', __name__)

@auth.route('/api/users', methods=['GET'])
def users():
    if 'userid' in session:
        return jsonify({
            "users": [
                {
                    "id": session['userid'],
                    "name": session['name'],
                    "username": session['username'],
                    "phone": session['phone'],
                    "favlist_name": session['favlist_name']
                }
            ]
        })
    return jsonify({"users": []})


@auth.route('/api/shops', methods=['GET'])
def shopes():
    if 'userid' in session:
        shop_list = []
        favlists = session['favlist']
        for f in favlists:
            res = db.get_shop_info_by_id(f)
            item = {'shop_name':res[1],'rating':res[7],'addr':res[10]}
            shop_list.append(item)
        return jsonify(shop_list)
    return jsonify([])

#Login
@auth.route('/login', methods=['POST'])
def login():
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400
    
    username = data.get("username")
    password = data.get("password")
    
    res = db.verify("brew&barrel", "user", username, password)
    print(res)
    if res[0] == 'success':
        userid, name, phone = db.search_userinfo(username)
        favlist = db.search_favourite_list(user_id=userid)
        print(favlist)
        
        shop_favlist = []
        for i in favlist:
            r = db.get_shop_info_by_id(i)
            if r:
                shop_favlist.append(r[1])

        session['userid'] = userid
        session['username'] = username
        session['name'] = name
        session['favlist'] = favlist
        session['favlist_name'] = shop_favlist
        session['phone'] = phone
        print("Session after setting:", session)
        print("Session dict:", dict(session))
        response = jsonify({"success": True})
        print("Response headers:", response.headers)
        return response
    else:
        return jsonify({"success": False, "error": res[0]})


#Register User
@auth.route('/register', methods=['POST'])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({"error":"Invalid JSON data"}), 400
    name = data.get('name')
    phone = data.get('phone')
    username = data.get('username')
    password = data.get('password')

    if not db.verify_for_registration(username) and not db.verify_for_registration(phone):
        db.add_user(username,password,username,phone,name)
        return jsonify({"success":True})
    return jsonify({"success":False})

# Edit Profile
@auth.route('/update', methods=['POST'])
def update_user_info():

    data = request.get_json()
    print(f"before update profile: {session}")
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400
    user_id = session['userid']
    email = data.get('email')
    phone = data.get('phone')
    name = data.get('name')

    if(db.update_userinfo(user_id, email, phone, name)):
        session['username'] = email
        session['phone'] = phone
        session['name'] = name
        print("Session after update:", session)
        return jsonify(session)
    return jsonify({})

@auth.route('/deleteFavorite', methods=['GET'])
def deleteFavorite():
    data.request.get_json()
     if not data:
        return jsonify({"error": "Invalid JSON data"}), 400
    
    f_shop_name = data.get("favorite_shop_name")
    
 
# Logout
@auth.route('/logout', methods=['POST'])
def logout():
    session.clear()  # clean all session data
    print("Session after logout:", session)
    print("Session dict:", dict(session))
    response = jsonify({"success": True})
    print("Response headers:", response.headers)
    return response
    
    