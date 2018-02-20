import { Map } from 'immutable';
import actions from './actions';

const initState = new Map({
  roomList: [],
  roomsNewConvList: []
});

export default function chatReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_ROOM_SUCCESS:
      state = state.set('roomList', action.roomList);
      return state.set('roomsNewConvList', action.roomsNewConvList);
    default:
      return state;
  }
}
