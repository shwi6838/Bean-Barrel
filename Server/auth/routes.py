from flask import Blueprint, request, jsonify, session
from brew_data import connection_test
import brew_data as db


auth = Blueprint('auth', __name__)


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
        print(f"userid: {userid}, username:{username}, favlist:{favlist}")
        session['userid'] = userid
        session['username'] = username
        session['name'] = name
        session['favlist'] = favlist
        session['phone'] = phone
        print("Session after setting:", session)
        print("Session dict:", dict(session))
        response = jsonify({"success": True})
        print("Response headers:", response.headers)
        return response
    else:
        return jsonify({"success": False, "error": res[0]})


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


    

@auth.route('/logout', methods=['POST'])
def logout():
    session.clear()  # clean all session data
    print("Session after logout:", session)
    print("Session dict:", dict(session))
    response = jsonify({"success": True})
    print("Response headers:", response.headers)
    return response
    
    