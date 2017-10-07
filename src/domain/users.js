import { OAuthTokensModel, OAuthUsersModel } from '../data/auth';

const getUserFromAuthToken = authToken => {
  //Get userId here, then look up value in users model. Only return needed data (not password)
  return OAuthTokensModel.findOne({accessToken: authToken}).then(res => {
    return {
      firstname: res.user.firstname,
      lastname: res.user.lastname,
      username: res.user.username,
      email: res.user.email,
      _id: res.user._id,
    };
  });

}

export { getUserFromAuthToken }
