import { Map } from 'immutable';
import { getToken, setToken, clearToken } from '../../helpers/utility';
import actions from './actions';
import { siteConfig } from '../../config.js';

const initState = new Map({
  idToken: null,
  avatarUrl: siteConfig.defaultAvatar,
  userInfo: null
});

export default function authReducer(
  state = initState.merge(getToken()),
  action
) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      setToken(action.user.email);
      state = state.set('idToken', action.user.email);
      if (action.user.avatar !== undefined && action.user.avatar !== "") {
        state = state.set('avatarUrl', action.user.avatar);
      }
      state = state.set('userInfo', action.user);
      return state;
    case actions.LOGOUT:
      clearToken();
      return initState;
    default:
      return state;
  }
}
