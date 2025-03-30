import os
from flask import Flask, jsonify, session
from flask_cors import CORS
from auth.routes import auth

app = Flask(__name__)
app.secret_key="123456"
app.config['SESSION_COOKIE_NAME'] = 'session1'
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  #Dev Enviornment set to False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_DOMAIN'] = 'localhost'  #Ensure Cookie Domain correct

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
   if 'userid' in session:
       return jsonify ({
           "users": [
               {"id": session['userid'], "name": session['name'],
                "username": session['username'], "phone":session['phone'], 'favlist': session['favlist']}
           ]
       })
   return jsonify(
        {
            # // Data needs a key/id
            "users": []
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=3080)