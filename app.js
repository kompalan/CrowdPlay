/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = '300359a5c21342d68050dea1f4815dc0'; // Your client id
var client_secret = '3fb4df6a4eb2410b90d087950be207da'; // Your secret
var redirect_uri = 'http://anuragkompalli.com:8888/callback'; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();
var role;
app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login/:role', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  role = req.params.role
  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if ((state === null || state !== storedState)) {
  } else {

    if(role === "host"){

      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
  
      request.post(authOptions, function(error, response, body) {
        res.redirect('test.html\?auth=' + body.access_token)
      });

    }else{
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
  
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
  
          var access_token = body.access_token,
              refresh_token = body.refresh_token;
  
          var options = {
            url: 'https://api.spotify.com/v1/me/top/tracks',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };
  
          
  
          request.get(options, function(error, response, body) {
            
            final_data = []
            var processItems = function(body,index, final_data) {
  
              if(index < body.items.length){
                var options_2 = {
                  url: 'https://api.spotify.com/v1/audio-features/'+body.items[index].id,
                  headers: { 'Authorization': 'Bearer ' + access_token },
                  json: true
                };
                
                request.get(options_2, function(error, response, result) {
                  final_data.push({
                    song:body.items[index].name,
                    album:body.items[index].album.name,
                    id: body.items[index].id,
                    uri: body.items[index].uri,
                    features: result
                  })
                  processItems(body, index+1, final_data)
                });
              }else{
                queue.push([final_data])
                
                res.redirect('anurag.html')
              }
              
            }
            
            processItems(body, 0, final_data);
            final_data.push(role)
          });
        } else {
        }
      });
    }
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});
queue = []

app.get('/querySongs', function(req, res) {
  res.send(queue.pop())
  
});

app.post('/queueUp', function(req, res){
  console.log(req.body.token)
});
console.log('Listening on 8888');
app.listen(8888);
