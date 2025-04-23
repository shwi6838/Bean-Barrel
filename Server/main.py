from flask import Flask
from flask_cors import CORS
from auth.routes import auth
from list.routes import favlist
from Database.brew_data import connection_test

# Flask app setup
app = Flask(__name__)
app.secret_key = "123456"
app.config['SESSION_COOKIE_NAME'] = 'session1'
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  # Dev Environment
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_DOMAIN'] = 'localhost'  # Ensure correct domain

# Enable CORS for frontend at port 5173
cors = CORS(app,
    origins=['http://localhost:5173'],
    supports_credentials=True,
    allow_headers=['Content-Type', 'Authorization'],
    expose_headers=['Content-Type', 'Authorization'],
    methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
)

# Connect MongoDB client
client = connection_test()

# Register blueprints
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(favlist, url_prefix='/list')

# --------- Run Server ---------
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=3080)
