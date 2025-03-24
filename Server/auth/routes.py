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
        userid = db.search_userinfo(username)
        favlist = db.search_favourite_list(user_id=userid)
        print(f"userid: {userid}, username:{username}, favlist:{favlist}")
        session['userid'] = userid
        session['username'] = username
        session['favlist'] = ','.join(favlist)
        print("Session after setting:", session)
        print("Session dict:", dict(session))
        response = jsonify({"success": True})
        print("Response headers:", response.headers)
        return response

@auth.route('/logout', methods=['POST'])
def logout():
    session.clear()  # 清除所有session数据
    print("Session after logout:", session)
    print("Session dict:", dict(session))
    response = jsonify({"success": True})
    print("Response headers:", response.headers)
    return response
    
    