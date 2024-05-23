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
  SUBCAT_GET_ALL_REQUEST,
  SUBCAT_GET_ALL_SUCCESS,
  SUBCAT_GET_ALL_FAIL,
  SUBCAT_GET_ALL_RESET,

 
} from "../constants/postConstants";



export const postListReducers=(state = {posts:[]},actions) =>{
  switch (actions.type) {
    case POST_LIST_REQUEST:
      return { loading: true ,posts:[]};

    case POST_LIST_SUCCESS:
      return { loading: false,
        posts:actions.payload,

      };

    case POST_LIST_FAIL:
      return { loading: false, error: actions.payload };


    default:
      return state;
  }
}


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
}

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
}




export const getSubCatReducer = (state = {}, actions) => {
  switch (actions.type) {
    case SUBCAT_GET_ALL_REQUEST:
      return { ...state, loadingsubCat: true };
    case SUBCAT_GET_ALL_SUCCESS:
      return {
        loadingSubCat: false,
        successSubCat: true,
        sub_categoriesInfo: actions.payload,
      };
    case SUBCAT_GET_ALL_FAIL:
      return { loadingSubCat: false, error: actions.payload };
    case SUBCAT_GET_ALL_RESET:
      return {};

    default:
      return state;
  }
};