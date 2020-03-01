import googlemaps
import math


# gets the latitude and longitude of the address by Google geocode api

def lat_lon(address):
    gmaps_key = googlemaps.Client(key = "your_google_API_key")
    geocode_result = gmaps_key.geocode(address)

    lat = geocode_result[0]['geometry']['location']['lat']
    lon = geocode_result[0]['geometry']['location']['lng']

    return lat, lon


length = 10.55   # a variable used in calculating the range for users.


def meters_to_lat_lon():
    lat_range = 10.55/111111  # in y direction
    lon_range = 10.55/(111111*math.cos(lat_range))  # in x direction
    return lat_range, lon_range

# for checking whether the user in range or not

# checks for the
def main():
    address = '17007 Boulder Drive, Northville, Michigan'
    lat, lon = lat_lon(address)
    lat_range, lon_range = meters_to_lat_lon()
    users_address = '17007 Boulder Drive, Northville, Michigan'
    lat_u, lon_u = lat_lon(users_address)
    if (lat-lat_range) < lat_u < (lat + lat_range) and (lon - lon_range) < lon_u < (lon + lon_range):
        print('True')
    else:
        print('False')

main()

