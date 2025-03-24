import os
from flask import Flask, jsonify, session
from flask_cors import CORS
from auth.routes import auth

app = Flask(__name__)
app.secret_key="123456"
app.config['SESSION_COOKIE_NAME'] = 'session1'
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # 开发环境设置为False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_DOMAIN'] = 'localhost'  # 确保cookie域名正确

cors = CORS(app, 
    origins=['http://localhost:5173'],
    supports_credentials=True,
    allow_headers=['Content-Type', 'Authorization'],
    expose_headers=['Content-Type', 'Authorization'],
    methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
)

app.register_blueprint(auth, url_prefix='/auth')

# TEST DATA
@app.route("/api/users", methods=['GET'])
def users():
   print(session)
   if 'userid' in session:
       print("enter first loop")
       return jsonify ({
           "users": [
               {"id": session['userid'], "name": session['username'], 'favlist': session['favlist']}
           ]
       })
   print("enter second loop")
   return jsonify(
        {
            # // Data needs a key/id
            "users": [
                {"id":1, "name": "John", "favlist":"123"},
                {"id":2, "name": "Jane","favlist":"234"},
                {"id":3, "name": "Sam","favlist":"123,234"},
            ]
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=3080)