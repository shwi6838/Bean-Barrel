from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins='*')

# TEST DATA
@app.route("/api/users", methods=['GET'])
def users():
    return jsonify(
        {
            # // Data needs a key/id
            "users": [
                {"id":1, "name": "John"},
                {"id":2, "name": "Jane"},
                {"id":3, "name": "Sam"},
                {"id":4, "name": "Sara"}
            ]
        }
    )

if __name__ == "__main__":
    app.run(debug=True, port=3080)