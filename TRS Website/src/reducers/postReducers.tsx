import {
  POST_UPLOAD_SUCCESS,
  POST_UPLOAD_REQUEST,
  POST_UPLOAD_FAIL,
  USER_POSTS_REQUEST,
  USER_POSTS_SUCCESS,
  USER_POSTS_FAIL,
  POST_LIST_REQUEST,
  POST_LIST_SUCCESS,
  POST_LIST_FAIL,
  POST_ASSIGNED_REQUEST,
  POST_ASSIGNED_REQUEST_SUCCESS,
  POST_ASSIGNED_REQUEST_FAILURE,
} from "../constants/postConstants";

export const postListReducers = (state = { posts: [] }, actions) => {
  switch (actions.type) {
    case POST_LIST_REQUEST:
      return { loading: true, posts: [] };

    case POST_LIST_SUCCESS:
      return { loading: false, posts: actions.payload };

    case POST_LIST_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const postUploadReducer = (state = {}, actions) => {
  switch (actions.type) {
    case POST_UPLOAD_REQUEST:
      return { loading: true };

    case POST_UPLOAD_SUCCESS:
      return { loading: false, success: true };

    case POST_UPLOAD_FAIL:
      return { loading: false, error: actions.payload };

    // case USER_LOGOUT:
    //     return {}

    default:
      return state;
  }
};

export const userPostReducer = (state = {}, actions) => {
  switch (actions.type) {
    case USER_POSTS_REQUEST:
      return { loading: true };

    case USER_POSTS_SUCCESS:
      return { loading: false, success: true, user_posts: actions.payload };

    case USER_POSTS_FAIL:
      return { loading: false, error: actions.payload };

    // case USER_LOGOUT:
    //     return {}

    default:
      return state;
  }
};

export const postAssignedReducer = (state = {}, actions) => {
  switch (actions.type) {
    case POST_ASSIGNED_REQUEST:
      return { loading: true };
    case POST_ASSIGNED_REQUEST_SUCCESS:
      return { loading: false, success: true, assigned_posts: actions.payload };
    case POST_ASSIGNED_REQUEST_FAILURE:
      return { loading: false, success: false, error: actions.payload };
    // case USER_LOGOUT:
    default:
      return state;
  }
};
