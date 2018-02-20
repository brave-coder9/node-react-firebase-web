const chatActons = {
  FETCH_ROOM_SUCCESS: 'FETCH_ROOM_SUCCESS',
  fetch_room_success: (roomList,roomsNewConvList) => {
    return {
      type: chatActons.FETCH_ROOM_SUCCESS,
      roomList: roomList,
      roomsNewConvList: roomsNewConvList
    }
  }
};
export default chatActons;
