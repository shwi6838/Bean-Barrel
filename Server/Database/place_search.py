import requests
import pandas as pd
from typing import List, Dict, Any

def search_beverage_shops(api_key: str, location: str, radius: int = 8000) -> pd.DataFrame:
    """
    Search for beverage shops near a specified location
    
    Args:
        api_key (str): Google Places API key
        location (str): Search center location in "latitude,longitude" format
        radius (int): Search radius in meters, default 8000m (covers entire Boulder area)
    
    Returns:
        pd.DataFrame: Table containing shop information
    """
    base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    all_results = []

    # Define different search combinations
    search_combinations = [
        {
            'type': ['bar'],
            'keyword': 'beer OR brewery OR pub OR wine OR cocktail'
        },
        {
            'type': ['cafe'],
            'keyword': 'coffee OR tea OR boba'
        },
        {
            'type': ['restaurant'],
            'keyword': 'brewery OR wine bar OR cocktail bar'
        }
    ]
    
    try:
        print("Sending API requests...")
        print(f"Search radius: {radius/1000:.1f} km from city center")
        
        # Perform multiple searches with different combinations
        for combo in search_combinations:
            params = {
                'key': api_key,
                'location': location,
                'radius': radius,
                'type': combo['type'],
                'keyword': combo['keyword']
            }
            
            # Send request
            print(f"\nSearching for {combo['type']} with keywords: {combo['keyword']}")
            response = requests.get(base_url, params=params, timeout=10)
            print(f"API response status code: {response.status_code}")
            
            response.raise_for_status()
            data = response.json()
            
            if data.get('error_message'):
                print(f"API error message: {data.get('error_message')}")
                continue
                
            # Process results
            for place in data.get('results', []):
                # Get photo reference (if available)
                photo_ref = place.get('photos', [{}])[0].get('photo_reference') if place.get('photos') else None
                
                # Get shop type
                types = place.get('types', [])
                shop_type = 'unknown'
                if 'bar' in types:
                    shop_type = 'bar'
                elif 'cafe' in types:
                    shop_type = 'cafe'
                elif 'restaurant' in types:
                    shop_type = 'restaurant'
                
                result = {
                    'name': place.get('name', ''),
                    'lat': place.get('geometry', {}).get('location', {}).get('lat'),
                    'lng': place.get('geometry', {}).get('location', {}).get('lng'),
                    'place_id': place.get('place_id', ''),
                    'types': shop_type,
                    'photo_reference': photo_ref,
                    'rating': place.get('rating', 0),
                    'user_ratings_total': place.get('user_ratings_total', 0),
                    'price_level': place.get('price_level', 0),
                    'vicinity': place.get('vicinity', '')
                }
                
                # Only add if not already in results (checking by place_id)
                if not any(r.get('place_id') == result['place_id'] for r in all_results):
                    all_results.append(result)
        
        # Convert to DataFrame
        df = pd.DataFrame(all_results)
        
        # If DataFrame is not empty, sort by rating
        if not df.empty:
            df = df.sort_values(by=['rating', 'user_ratings_total'], ascending=[False, False])
        
        print(f"\nTotal unique places found: {len(df)}")
        return df
        
    except requests.exceptions.Timeout:
        print("Request timeout. Please check your network connection or try again later")
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return pd.DataFrame()
    except Exception as e:
        print(f"Unknown error occurred: {e}")
        return pd.DataFrame()

def get_place_photo(api_key: str, photo_reference: str, max_width: int = 400) -> str:
    """
    Get the photo URL for a place
    
    Args:
        api_key (str): Google Places API key
        photo_reference (str): Photo reference string
        max_width (int): Maximum photo width
    
    Returns:
        str: Photo URL
    """
    if not photo_reference:
        return ""
        
    base_url = "https://maps.googleapis.com/maps/api/place/photo"
    params = {
        'key': api_key,
        'photo_reference': photo_reference,
        'maxwidth': max_width
    }
    
    try:
        response = requests.get(base_url, params=params)
        return response.url
    except Exception as e:
        print(f"Error getting photo URL: {e}")
        return ""

# Usage example
if __name__ == "__main__":
    # Replace with your API key
    API_KEY = input("Please enter your Google Places API key: ")
    
    # Boulder city center (near Pearl Street Mall)
    location = "40.0150,-105.2705"
    
    print("\nSearching for beverage shops across Boulder...")
    print("Search center: Pearl Street Mall")
    print("Coverage area: Entire Boulder area (8km radius)")
    print("Connecting to Google Places API...")
    
    try:
        shops_df = search_beverage_shops(API_KEY, location)
        
        if shops_df.empty:
            print("No shops found or an error occurred. Please check:")
            print("1. If the API key is correct")
            print("2. If your network connection is working")
            print("3. If Places API is enabled")
            print("4. If billing is set up")
        else:
            # Remove duplicates based on name
            original_count = len(shops_df)
            shops_df = shops_df.drop_duplicates(subset=['name'], keep='first')
            removed_count = original_count - len(shops_df)
            
            print(f"\nFound {len(shops_df)} unique shops in Boulder:")
            if removed_count > 0:
                print(f"(Removed {removed_count} duplicate entries)")
            
            # Display shop information
            print(shops_df[['name', 'types', 'rating', 'user_ratings_total']].sort_values(by='rating', ascending=False))
            
            # Get and display photo for the first shop
            if not shops_df.empty and shops_df.iloc[0]['photo_reference']:
                print(f"\nGetting photo for top-rated shop '{shops_df.iloc[0]['name']}'...")
                photo_url = get_place_photo(API_KEY, shops_df.iloc[0]['photo_reference'])
                if photo_url:
                    print(f"Photo URL: {photo_url}")
                else:
                    print("Unable to get photo URL")
            
            # Set pandas display options to show all columns and rows
            pd.set_option('display.max_rows', None)
            pd.set_option('display.max_columns', None)
            pd.set_option('display.width', None)
            pd.set_option('display.max_colwidth', None)
            
            print("\n=== Complete Shop Data ===")
            print("All shops sorted by rating and number of reviews:")
            print(shops_df.sort_values(by=['rating', 'user_ratings_total'], ascending=[False, False]).to_string())
            
            # Save to CSV file
            timestamp = pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')
            filename = f'boulder_beverage_shops_{timestamp}.csv'
            # Save with UTF-8-BOM encoding for Excel compatibility
            shops_df.to_csv(filename, index=False, encoding='utf-8-sig')
            print(f"\nData saved to {filename}")
            print(f"Total unique shops saved: {len(shops_df)}")
            print("File saved with UTF-8-BOM encoding for Excel compatibility")
        
    except requests.exceptions.Timeout:
        print("Request timeout. Please check your network connection or try again later")
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
    except Exception as e:
        print(f"Unknown error occurred: {e}") 