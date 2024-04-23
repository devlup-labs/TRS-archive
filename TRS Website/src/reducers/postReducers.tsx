import {

  POST_UPLOAD_SUCCESS,
  POST_UPLOAD_REQUEST,
  POST_UPLOAD_FAIL,
 
} from "../constants/postConstants";




export const postUploadReducer = (state = {}, actions) => {
  switch (actions.type) {
    case POST_UPLOAD_REQUEST:
      return { loading: true };

    case POST_UPLOAD_SUCCESS:
      console.log("from reducer");
      console.log(actions.payload);
      return { loading: false, success: true };

    case POST_UPLOAD_FAIL:
      return { loading: false, error: actions.payload };

    // case USER_LOGOUT:
    //     return {}

    default:
      return state;
  }
}