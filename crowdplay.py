
# hackathon #

""" integrating maps with the website
So, technically this lets the user(host in this case)
decide the range (general location of the party) and display a count
or a boolean value if the party-goer is in range """

# creating a python server

import json

from flask import Flask, request

from operator import itemgetter


app = Flask(__name__)


@app.route('/')
def index():
    return "Flask server"


@app.route('/postdata', methods=['POST'])
def postdata():
    data = request.get_json()
    print(data)
    # do something with this data variable that contains the data from the node server
    return json.dumps({"newdata": "hereisthenewdatayouwanttosend"})


if __name__ == "__main__":
    app.run(port=5000)
# will create a formula and arrange the songs


"""
The formula is the weightd sum with constant relation of 5 factors taken from spotify api
"""

# if the p is 49 return is 0. if it is 51 the return is 100.


def rounding_popularity(p):
    return round(p, -2)


'''round_list is list of list.
The inner list contains 'url of song', popularity, energy, dancea-ability, and loudness in order'''

# the url is a string and other number values are floats


def round_list(mega_list):
    finished_list = []
    counter_list = []
    for L in mega_list:
        counter_list.append(L[0])
        counter_list.append(rounding_popularity(L[1]))
        counter_list.append(rounding_popularity(L[2]))  # assuming energitic is multiplied by 100
        counter_list.append(rounding_popularity(L[3]))  # assuming dance-ability is multiplied by 100
        counter_list.append(rounding_popularity(L[4]))  # assuming loudeness is multiplied by 100
        finished_list.append(counter_list)              # appending the ccunter list to the finishede list
        counter_list = []                               # setting the counter to empty again
    return finished_list


def final_sorted(finished_list):
    final_list = sorted(finished_list, key=itemgetter(1, 2, 3, 4))
    songs_url_list = []
    for s in final_list:
        songs_url_list.append(s[0])
    return songs_url_list




