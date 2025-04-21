from pymongo import MongoClient
from pymongo.server_api import ServerApi
import certifi

uri = "mongodb+srv://ziwa8314:X7iJVIeXiOpsRxad@googlecluster.8k1hr.mongodb.net/?retryWrites=true&w=majority"

try:
    client = MongoClient(
        uri,
        server_api=ServerApi('1'),
        tls=True,
        tlsCAFile=certifi.where()
    )
    client.admin.command("ping")
    print("MongoDB connection successful.")
except Exception as e:
    print(f"MongoDB connection failed: {e}")
