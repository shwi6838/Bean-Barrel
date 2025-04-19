import os
import certifi
import csv
import requests
# Press Ctrl+F8 to toggle the breakpoint.
from datetime import datetime
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv("GOOGLE_MAP_API")
## also check the api lines under function MapPage in Client/src/Pages/Map.jsx
## and the api line of Client/src/Pages/List.jsx

def connection_test():  # connect to the database and return the client object
    uri = ("mongodb+srv://ziwa8314:X7iJVIeXiOpsRxad@googlecluster.8k1hr.mongodb.net/?retryWrites=true&w=majority"
           "&appName=googlecluster")

    client = MongoClient(uri, server_api=ServerApi('1'),tlsCAFile=certifi.where())

    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(e)


def view_all_database():  # return the list of database

    databases = client.list_database_names()
    print("all_database:", databases)
    return databases

def view_all_collections(db_name):
    try:
        # Get specified database
        db = client[db_name]
        # Get all collections in the database
        collections = db.list_collection_names()
        
        print(f"\n=== Collections in database {db_name} ===")
        if not collections:
            print("No collections found in this database")
        else:
            print("List of collections:")
            for collection in collections:
                # Get document count for each collection
                count = db[collection].count_documents({})
                print(f"  - {collection} (document count: {count})")
        
        return collections
    except Exception as e:
        print(f"Error viewing collections in database {db_name}:", e)
        return []

def store_data(db_name, collection_name, data):  # add 1 line of data to the database
    try:
        db = client[db_name]  # Select database
        collection = db[collection_name]  # Select collection

        # Insert data (single document or multiple documents)
        if isinstance(data, list):
            collection.insert_many(data)
        else:
            collection.insert_one(data)

        print("Storage success")
    except Exception as e:
        print("Error storing data:", e)

def add_new_collection(db_name, collection_name):
    try:
        # Get or create database
        db = client[db_name]
        
        # Check if collection already exists
        existing_collections = db.list_collection_names()
        if collection_name in existing_collections:
            print(f"Collection '{collection_name}' already exists in database '{db_name}'")
            return False
            
        # Create new collection by inserting a dummy document and then deleting it
        db.create_collection(collection_name)
        print(f"Successfully created collection '{collection_name}' in database '{db_name}'")
        return True
        
    except Exception as e:
        print(f"Error creating collection: {e}")
        return False

def verify(db_name, collection_name, passed_email, passed_password):#to compare the username and the pwd to see if they are the same
    try:
        db = client[db_name]
        collection = db[collection_name]
        
        # find the user with the same email
        user = collection.find_one({"email": passed_email})
        
        if user is None:
            return ["Email address and password do not match", "001"]
            
        # find the user with the same password
        if user["password"] == passed_password:
            return ["success", str(user["user_id"])]
        else:
            return ["Email address and password do not match", "001"]
            
    except Exception as e:
        print("Error during verification:", e)
        return ["Error during verification", "002"]

def view_all_documents(db_name, collection_name):
    try:
        # Get database and collection
        db = client[db_name]
        collection = db[collection_name]
        
        # Find all documents in the collection
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

def delete_collection(db_name, collection_name):
    try:
        # Get database
        db = client[db_name]
        
        # Check if collection exists
        existing_collections = db.list_collection_names()
        if collection_name not in existing_collections:
            print(f"Collection '{collection_name}' does not exist in database '{db_name}'")
            return False
            
        # Delete the collection
        db[collection_name].drop()
        print(f"Successfully deleted collection '{collection_name}' from database '{db_name}'")
        return True
        
    except Exception as e:
        print(f"Error deleting collection: {e}")
        return False

def add_to_favourite(user_id, new_favourite_id):#untested function
    try:
        # Get database and collection
        db = client["brew&barrel"]
        collection = db["user_favourite"]
        
        # Check if user exists
        user = collection.find_one({"user_id": user_id})
        
        if user is None:
            # If user doesn't exist, create new document
            result = collection.insert_one({
                "user_id": user_id,
                "favourite_id": [new_favourite_id]
            })
            print(f"Created new favourite list for user {user_id} with {new_favourite_id}")
            return True
        else:
            # Check if the favourite_id already exists in the list
            if new_favourite_id in user["favourite_id"]:
                print(f"ID {new_favourite_id} is already in user {user_id}'s favourite list")
                return False
            
            # Add new favourite_id to the list using $push operator
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


def search_favourite_list(user_id):#return the list of favourite_id of the user
    try:
        # Get database and collection
        db = client["brew&barrel"]
        collection = db["user_favourite"]
        
        # Try to convert user_id to integer if it's a string
        try:
            if isinstance(user_id, str):
                user_id = int(user_id)
        except ValueError:
            pass  # Keep it as string if conversion fails
        
        # Find the user document
        user = collection.find_one({"user_id": user_id})
        
        if user is None:
            print(f"User {user_id} not found in favourite list")
            return []
            
        # Return the favourite_id list
        favourite_list = user.get("favourite_id", [])
        print(f"Found {len(favourite_list)} favourites for user {user_id}")
        return favourite_list
        
    except Exception as e:
        print(f"Error searching favourite list: {e}")
        return []
    
def search_userinfo(email):#return the user_id, name, and phone_number of the user based on the email
    try:
        # Get database and collection
        db = client["brew&barrel"]
        collection = db["user"]
        
        # Find user by email
        user = collection.find_one({"email": email})
        
        if user is None:
            print(f"No user found with email: {email}")
            return None, None, None
            
        # Extract user information
        user_id = user.get("user_id")
        name = user.get("name")
        phone_number = user.get("Phone_number")
        
        print(f"Found user: {name} (ID: {user_id}, Phone: {phone_number})")
        return user_id, name, phone_number
        
    except Exception as e:
        print(f"Error searching user info: {e}")
        return None, None, None


#print(verify(client, "brew&barrel", "user", "12345@colorado.edu", "23456"))
def verify_for_registration(rigister_str):#return true if the user is registered（email or phone number）, otherwise return false
    try:
        # Get database and collection
        db = client["brew&barrel"]
        collection = db["user"]
        
        # Check if the input contains '@' to determine if it's an email
        if '@' in rigister_str:
            # Search by email
            user = collection.find_one({"email": rigister_str})
            if user is not None:
                print(f"Email {rigister_str} is already registered")
                return True
            else:
                print(f"Email {rigister_str} is available")
                return False
        else:
            # Search by phone number
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
    
def add_user(user_name, password, email, Phone_number, name):
    try:
        # Get database and collection
        db = client["brew&barrel"]
        collection = db["user"]
        
        # Find the maximum user_id in the collection
        max_user = collection.find_one(sort=[("user_id", -1)])
        new_user_id = 1 if max_user is None else max_user["user_id"] + 1
        
        # Create new user document
        new_user = {
            "user_id": new_user_id,
            "user_name": user_name,
            "password": password,
            "email": email,
            "Phone_number": Phone_number,
            "name": name
        }
        
        # Insert the new user
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
        
def delete_from_favourite(user_id, favourite_id_to_remove):
    try:
        # Get database and collection
        db = client["brew&barrel"]
        collection = db["user_favourite"]
        
        # Try to convert user_id to integer if it's a string
        try:
            if isinstance(user_id, str):
                user_id = int(user_id)
        except ValueError:
            pass  # Keep it as string if conversion fails
        
        # Check if user exists
        user = collection.find_one({"user_id": user_id})
        
        if user is None:
            print(f"User {user_id} not found in favourite list")
            return False
            
        # Check if the favourite_id exists in the list
        if favourite_id_to_remove not in user.get("favourite_id", []):
            print(f"ID {favourite_id_to_remove} is not in user {user_id}'s favourite list")
            return False
            
        # Remove favourite_id from the list using $pull operator
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

def get_shop_photo_by_reference(photo_reference):#modified function
    """
    Get shop photo URL by photo reference with maximum possible size
    
    Args:
        photo_reference (str): Photo reference from Google Places API
        
    Returns:
        str: Photo URL, returns None if failed
    """
    try:
        if not photo_reference:
            print("Photo reference is empty")
            return None
            
        # Build Google Places API URL with maximum width
        # Note: Google Places API requires at least one size parameter
        photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=1920&photo_reference={photo_reference}&key={api_key}"
        
        return photo_url
            
    except Exception as e:
        print(f"Error getting shop photo URL: {e}")
        return None
    
def get_shop_info_by_id(shop_id):#modified function
    """
    Get all shop information by shop ID
    
    Args:
        shop_id (str): Shop ID (place_id)
        
    Returns:
        list: A list containing all field values of the shop, returns empty list if failed
    """
    try:
        # Get shop information from database
        db = client["brew&barrel"]
        collection = db["stores"]
        
        # Query shop information
        shop = collection.find_one({"place_id": shop_id})
        
        if not shop:
            print(f"Shop {shop_id} not found")
            return []
            
        # Convert shop document to list of values
        shop_info = list(shop.values())
        
        return shop_info
            
    except Exception as e:
        print(f"Error getting shop info: {e}")
        return []

def get_all_shop_info():#modified function
    """
    Get all shop information from the database
    
    Returns:
        list: A list containing all shops' information, returns empty list if failed
    """
    try:
        db = client["brew&barrel"]
        collection = db["stores"]
        
        shops = collection.find({})
        
        all_shops_info = [list(shop.values()) for shop in shops]
        
        return all_shops_info
            
    except Exception as e:
        print(f"Error getting all shop info: {e}")
        return []
    

client = connection_test()
    

