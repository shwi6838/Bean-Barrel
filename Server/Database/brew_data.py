import hashlib
import os
import certifi
from datetime import datetime
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("GOOGLE_MAP_API")

"""
Test the connection to MongoDB database and return the client object
"""
def connection_test():
    uri = ("")

    client = MongoClient(uri, server_api=ServerApi('1'),tlsCAFile=certifi.where())

    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(e)

"""
Return the list of all databases in MongoDB
"""
def view_all_database():
    databases = client.list_database_names()
    print("all_database:", databases)
    return databases

"""
View all collections in a specified database and their document counts
"""
def view_all_collections(db_name):
    try:
        db = client[db_name]
        collections = db.list_collection_names()
        
        print(f"\n=== Collections in database {db_name} ===")
        if not collections:
            print("No collections found in this database")
        else:
            print("List of collections:")
            for collection in collections:
                count = db[collection].count_documents({})
                print(f"  - {collection} (document count: {count})")
        
        return collections
    except Exception as e:
        print(f"Error viewing collections in database {db_name}:", e)
        return []

"""
Add one or multiple lines of data to the specified collection in the database
"""
def store_data(db_name, collection_name, data):
    try:
        db = client[db_name]
        collection = db[collection_name]

        if isinstance(data, list):
            collection.insert_many(data)
        else:
            collection.insert_one(data)

        print("Storage success")
    except Exception as e:
        print("Error storing data:", e)

"""
Create a new collection in the specified database
"""
def add_new_collection(db_name, collection_name):
    try:
        db = client[db_name]
        
        existing_collections = db.list_collection_names()
        if collection_name in existing_collections:
            print(f"Collection '{collection_name}' already exists in database '{db_name}'")
            return False
            
        db.create_collection(collection_name)
        print(f"Successfully created collection '{collection_name}' in database '{db_name}'")
        return True
        
    except Exception as e:
        print(f"Error creating collection: {e}")
        return False

"""
Verify user credentials by comparing email and password
"""
def verify(db_name, collection_name, passed_email, passed_password):
    try:
        db = client[db_name]
        collection = db[collection_name]
        
        user = collection.find_one({"email": passed_email})
        
        if user is None:
            return ["Email address and password do not match", "001"]
            
        if user["password"] == passed_password:
            return ["success", str(user["user_id"])]
        else:
            return ["Email address and password do not match", "001"]
            
    except Exception as e:
        print("Error during verification:", e)
        return ["Error during verification", "002"]

"""
View all documents in a specified collection
"""
def view_all_documents(db_name, collection_name):
    try:
        db = client[db_name]
        collection = db[collection_name]
        
        documents = collection.find({})
        
        print(f"\n=== All documents in collection '{collection_name}' ===")
        document_count = 0
        
        for doc in documents:
            document_count += 1
            print(f"\nDocument {document_count}:")
            for key, value in doc.items():
                print(f"  {key}: {value}")
        
        if document_count == 0:
            print("No documents found in this collection")
        else:
            print(f"\nTotal documents found: {document_count}")
            
        return document_count
        
    except Exception as e:
        print(f"Error viewing documents: {e}")
        return 0

"""
Delete a collection from the specified database
"""
def delete_collection(db_name, collection_name):
    try:
        db = client[db_name]
        
        existing_collections = db.list_collection_names()
        if collection_name not in existing_collections:
            print(f"Collection '{collection_name}' does not exist in database '{db_name}'")
            return False
            
        db[collection_name].drop()
        print(f"Successfully deleted collection '{collection_name}' from database '{db_name}'")
        return True
        
    except Exception as e:
        print(f"Error deleting collection: {e}")
        return False

"""
Add a shop to user's favorite list
"""
def add_to_favourite(user_id, new_favourite_id):
    try:
        db = client["brew&barrel"]
        collection = db["user_favourite"]
        
        user = collection.find_one({"user_id": user_id})
        
        if user is None:
            result = collection.insert_one({
                "user_id": user_id,
                "favourite_id": [new_favourite_id]
            })
            print(f"Created new favourite list for user {user_id} with {new_favourite_id}")
            return True
        else:
            if new_favourite_id in user["favourite_id"]:
                print(f"ID {new_favourite_id} is already in user {user_id}'s favourite list")
                return False
            
            result = collection.update_one(
                {"user_id": user_id},
                {"$push": {"favourite_id": new_favourite_id}}
            )
            
            if result.modified_count > 0:
                print(f"Successfully added {new_favourite_id} to user {user_id}'s favourite list")
                return True
            else:
                print("No changes made")
                return False
                
    except Exception as e:
        print(f"Error adding to favourite: {e}")
        return False

"""
Get the list of favorite shop IDs for a user
"""
def search_favourite_list(user_id):
    try:
        db = client["brew&barrel"]
        collection = db["user_favourite"]
        
        try:
            if isinstance(user_id, str):
                user_id = int(user_id)
        except ValueError:
            pass
        
        user = collection.find_one({"user_id": user_id})
        
        if user is None:
            print(f"User {user_id} not found in favourite list")
            return []
            
        favourite_list = user.get("favourite_id", [])
        print(f"Found {len(favourite_list)} favourites for user {user_id}")
        return favourite_list
        
    except Exception as e:
        print(f"Error searching favourite list: {e}")
        return []

"""
Get user information (ID, name, phone number) based on email
"""
def search_userinfo(email):
    try:
        db = client["brew&barrel"]
        collection = db["user"]
        
        user = collection.find_one({"email": email})
        
        if user is None:
            print(f"No user found with email: {email}")
            return None, None, None
            
        user_id = user.get("user_id")
        name = user.get("name")
        phone_number = user.get("Phone_number")
        
        print(f"Found user: {name} (ID: {user_id}, Phone: {phone_number})")
        return user_id, name, phone_number
        
    except Exception as e:
        print(f"Error searching user info: {e}")
        return None, None, None

"""
Check if a user is already registered by email or phone number
"""
def verify_for_registration(rigister_str):
    try:
        db = client["brew&barrel"]
        collection = db["user"]
        
        if '@' in rigister_str:
            user = collection.find_one({"email": rigister_str})
            if user is not None:
                print(f"Email {rigister_str} is already registered")
                return True
            else:
                print(f"Email {rigister_str} is available")
                return False
        else:
            user = collection.find_one({"Phone_number": rigister_str})
            if user is not None:
                print(f"Phone number {rigister_str} is already registered")
                return True
            else:
                print(f"Phone number {rigister_str} is available")
                return False
                
    except Exception as e:
        print(f"Error verifying registration: {e}")
        return False

"""
Add a new user to the database
"""
def add_user(user_name, password, email, Phone_number, name):
    try:
        db = client["brew&barrel"]
        collection = db["user"]
        
        max_user = collection.find_one(sort=[("user_id", -1)])
        new_user_id = 1 if max_user is None else max_user["user_id"] + 1
        
        new_user = {
            "user_id": new_user_id,
            "user_name": user_name,
            "password": password,
            "email": email,
            "Phone_number": Phone_number,
            "name": name
        }
        
        result = collection.insert_one(new_user)
        
        if result.inserted_id:
            print(f"Successfully added new user with ID: {new_user_id}")
            return True
        else:
            print("Failed to add new user")
            return False
            
    except Exception as e:
        print(f"Error adding new user: {e}")
        return False

"""
Remove a shop from user's favorite list
"""
def delete_from_favourite(user_id, favourite_id_to_remove):
    try:
        db = client["brew&barrel"]
        collection = db["user_favourite"]
        
        try:
            if isinstance(user_id, str):
                user_id = int(user_id)
        except ValueError:
            pass
        
        user = collection.find_one({"user_id": user_id})
        
        if user is None:
            print(f"User {user_id} not found in favourite list")
            return False
            
        if favourite_id_to_remove not in user.get("favourite_id", []):
            print(f"ID {favourite_id_to_remove} is not in user {user_id}'s favourite list")
            return False
            
        result = collection.update_one(
            {"user_id": user_id},
            {"$pull": {"favourite_id": favourite_id_to_remove}}
        )
        
        if result.modified_count > 0:
            print(f"Successfully removed {favourite_id_to_remove} from user {user_id}'s favourite list")
            return True
        else:
            print("No changes made")
            return False
            
    except Exception as e:
        print(f"Error removing from favourite: {e}")
        return False

"""
Get shop photo URL by photo reference with maximum possible size
"""
def get_shop_photo_by_reference(photo_reference):
    try:
        if not photo_reference:
            print("Photo reference is empty")
            return None
            
        photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=1920&photo_reference={photo_reference}&key={api_key}"
        
        return photo_url
            
    except Exception as e:
        print(f"Error getting shop photo URL: {e}")
        return None

"""
Get all shop information by shop ID
"""
def get_shop_info_by_id(shop_id):
    try:
        db = client["brew&barrel"]
        collection = db["stores"]
        
        shop = collection.find_one({"place_id": shop_id})
        
        if not shop:
            print(f"Shop {shop_id} not found")
            return []
            
        shop_info = list(shop.values())
        
        return shop_info
            
    except Exception as e:
        print(f"Error getting shop info: {e}")
        return []

"""
Get all shop information from the database
"""
def get_all_shop_info():
    try:
        db = client["brew&barrel"]
        collection = db["stores"]
        
        shops = collection.find({})
        
        all_shops_info = [list(shop.values()) for shop in shops]
        
        return all_shops_info
            
    except Exception as e:
        print(f"Error getting all shop info: {e}")
        return []

"""
Update user information by user_id
"""
def update_userinfo(user_id, email, Phone_number, name):
    try:
        db = client["brew&barrel"]
        collection = db["user"]
        
        try:
            if isinstance(user_id, str):
                user_id = int(user_id)
        except ValueError:
            pass
        
        update_data = {}
        if email:
            update_data["email"] = email
        if Phone_number:
            update_data["Phone_number"] = Phone_number
        if name:
            update_data["name"] = name
            
        if not update_data:
            print("No information provided for update")
            return False
            
        result = collection.update_one(
            {"user_id": user_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            print(f"Successfully updated information for user ID {user_id}")
            return True
        else:
            print(f"User with ID {user_id} not found or no information needs to be updated")
            return False
            
    except Exception as e:
        print(f"Error updating user information: {e}")
        return False

"""
Hash the password using SHA-256 algorithm
"""
def pwd_hashing(pwd):
    pwd_bytes = pwd.encode('utf-8')
    hash_obj = hashlib.sha256(pwd_bytes)
    hashed_pwd = hash_obj.hexdigest()
    return hashed_pwd
    
client = connection_test()
    

