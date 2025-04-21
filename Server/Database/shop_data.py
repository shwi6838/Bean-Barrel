# Server/Database/shop_data.py

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi

# Establish MongoDB connection
def connect_db():
    uri = "mongodb+srv://ziwa8314:X7iJVIeXiOpsRxad@googlecluster.8k1hr.mongodb.net/?retryWrites=true&w=majority"
    client = MongoClient(
        uri,
        server_api=ServerApi('1'),
        tls=True,
        tlsCAFile=certifi.where()
    )
    return client["brew&barrel"]

# Fetch all shop info
def get_all_shop_info():
    try:
        db = connect_db()
        collection = db["stores"]
        shops = collection.find({})
        result = []

        for shop in shops:
            shop["_id"] = str(shop["_id"])
            result.append(shop)

        return result
    except Exception as e:
        print(f"Error fetching shops: {e}")
        return []
