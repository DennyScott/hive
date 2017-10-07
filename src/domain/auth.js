import {OAuthTokensModel, OAuthClientsModel, OAuthUsersModel} from '../data/auth';

const registerUser = (username, password, email, firstname, lastname) => {
  if(!isString(username) || !isString(password)){
    return;
  }

  const userInstance = new OAuthUsersModel({
    email,
    firstname,
    lastname,
    password,
    username
  });

  try{
    userInstance.save(err => {
      if(err)
        console.error(`User instance failed to save ${err}`);
    });
  } catch(e) {
    console.error(`There was an error saving user instance ${e}`);
  }

  return userInstance;
}

/**
 * Get access token.
 */

const getAccessToken = function(bearerToken) {
  // Adding `.lean()`, as we get a mongoose wrapper object back from `findOne(...)`, and oauth2-server complains.
  return OAuthTokensModel.findOne({ accessToken: bearerToken }).lean();
};

/**
 * Get client.
 */

const getClient = function(clientId, clientSecret) {
  const client = {
        clientId,
        clientSecret,
        grants: ['password'],
        redirectUris: null
    }

  return client
};

/**
 * Get refresh token.
 */

const getRefreshToken = function(refreshToken) {
  return OAuthTokensModel.findOne({ refreshToken: refreshToken }).lean();
};

/**
 * Get user.
 */

const getUser = function(username, password) {
  return OAuthUsersModel.findOne({ username: username, password: password }).lean();
};

/**
 * Save token.
 */

const saveToken = function(token, client, user) {
  var accessToken = new OAuthTokensModel({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    client : client,
    clientId: client.clientId,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    user : user,
    userId: user._id,
  });
  // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
  return new Promise( function(resolve,reject){
    accessToken.save(function(err,data){
      if( err ) reject( err );
      else resolve( data );
    }) ;
  }).then(function(saveResult){
    // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
    saveResult = saveResult && typeof saveResult == 'object' ? saveResult.toJSON() : saveResult;

    // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
    var data = new Object();
    for( var prop in saveResult ) data[prop] = saveResult[prop];

    // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
    data.client = data.clientId;
    data.user = data.userId;

    return data;
  });
};

/**
 * the node-oauth2-server uses this method to save an authorization code.
 * @param {Object} code - the authorization code object
 * @param {String} code.authorizationCode - the authorization code string
 * @param {Date} code.expiresAt - the time when the code should expire
 * @param {String} code.redirectUri - where to redirect to with the code
 * @param {String} [code.scope] - the authorized access scope
 * @param {Object} client - the client object
 * @param {String} client.id - the client id
 * @param {Object} user - the user object
 * @param {String} user.username - the user identifier
 * @return {Object} code - the code object saved
 */
const saveAuthorizationCode = function(code, client, user){
  var self = this,
    codeToSave;

  codeToSave = {
    'authorizationCode': code.authorizationCode,
    'expiresAt': code.expiresAt,
    'redirectUri': code.redirectUri,
    'scope': code.scope,
    'client': client.id,
    'user': user.username
  };

  self.authorizationCodeStore.setExpiration(codeToSave.authorizationCode, codeToSave, codeToSave.expiresAt);

  code = Object.assign({}, code, {
    'client': client.id,
    'user': user.username
  });

  return code;
};

function isString(parameter) {

  return parameter != null && (typeof parameter === "string"
    || parameter instanceof String) ? true : false
}

export {
  getAccessToken,
  getClient,
  getRefreshToken,
  getUser,
  saveToken,
  saveAuthorizationCode,
  registerUser,
};
