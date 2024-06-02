import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_REQUEST,
  USER_LOGOUT,
  USER_LOGIN_FAIL,
  USER_VERIFY_REQUEST,
  USER_VERIFY_SUCCESS,
  USER_VERIFY_EMAIL,
  USER_VERIFY_FAIL,
  USER_VERIFY_RESET,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_REQUEST,
  USER_REGISTER_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_RESET,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_REQUEST,
  USER_DETAILS_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_RESET,
  USERS_GET_ALL_REQUEST,
  USERS_GET_ALL_REQUEST_SUCCESS,
  USERS_GET_ALL_REQUEST_FAIL,
  USERS_GET_ALL_REQUEST_RESET,

  TOKEN_REFRESH_REQUEST,
  TOKEN_REFRESH_SUCCESS,
  UPDATE_AUTH_TOKEN,
  TOKEN_REFRESH_FAIL,
  EDITORS_GET_ALL_REQUEST,
  EDITORS_GET_ALL_SUCCESS,
  EDITORS_GET_ALL_FAIL,
  EDITORS_GET_ALL_RESET,
  REVIEWERS_GET_ALL_REQUEST,
  REVIEWERS_GET_ALL_SUCCESS,
  REVIEWERS_GET_ALL_FAIL,
} from "../constants/userConstants";

export const userVerifyReducer = (state = { email: null }, actions) => {
  switch (actions.type) {
    case USER_VERIFY_REQUEST:
      return { ...state, loading: true, esent: false };

    case USER_VERIFY_EMAIL:
      return { ...state, loading: true, success: false, esent: true };

    case USER_VERIFY_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        email: actions.payload,
      };

    case USER_VERIFY_FAIL:
      return { ...state, loading: false, error: actions.payload };

    case USER_VERIFY_RESET:
      return {};

    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, actions) => {
  switch (actions.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };

    case USER_REGISTER_SUCCESS:
      console.log("from reducer");
      console.log(actions.payload);
      return { loading: false, success: true, userInfo: actions.payload };

    case USER_REGISTER_FAIL:
      return { loading: false, error: actions.payload };

    // case USER_LOGOUT:
    //     return {}

    default:
      return state;
  }
};

export const userProfileReducer = (state = {}, actions) => {
  switch (actions.type) {
    case USER_PROFILE_REQUEST:
      return { loading: true };

    case USER_PROFILE_SUCCESS:
      console.log("from reducer");
      console.log(actions.payload);
      return { loading: false, userProfile: actions.payload };

    case USER_PROFILE_FAIL:
      return { loading: false, error: actions.payload };

    case USER_PROFILE_RESET:
      return {};

    default:
      return state;
  }
};



export const TokenRefreshReducer = (state = {},actions) => {
  switch(actions.type){
      case TOKEN_REFRESH_REQUEST:
          return {loading:true}
      
      case TOKEN_REFRESH_SUCCESS:
          return {loading:false,success:true}

      case TOKEN_REFRESH_FAIL:
          return {loading:false,error:actions.payload}

      default:
          return state
  }
}


export const UserLoginReducer = (state = {}, actions) => {
  switch (actions.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };

    case USER_LOGIN_SUCCESS:
      return { loading: false, authToken: actions.payload };

    case USER_LOGIN_FAIL:
      return { loading: false, error: actions.payload };

    case UPDATE_AUTH_TOKEN:
        return {
            ...state,
            authToken:{
                ...state.authToken,
                access:actions.payload
            }
        }

    case USER_LOGOUT:
      return {};

    default:
      return state;
  }
};




export const userDetailsReducer = (state = {}, actions) => {
  switch (actions.type) {
    case USER_DETAILS_REQUEST:
      return { ...state, loading: true };

    case USER_DETAILS_SUCCESS:
      return { loading: false, user: actions.payload };

    case USER_DETAILS_FAIL:
      return { loading: false, error: actions.payload };

    // case USER_DETAILS_RESET:
    //     return {user:{}}

    default:
      return state;
  }
};

export const userUpdateProfileReducer = (state = {}, actions) => {
  switch (actions.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true };

    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, userInfo: actions.payload };

    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: actions.payload };

    case USER_UPDATE_PROFILE_RESET:
      return {};

    default:
      return state;
  }
};

export const getAllUsersReducer = (state = {}, actions) => {
  switch (actions.type) {
    case USERS_GET_ALL_REQUEST:
      return { ...state, loading: true };
    case USERS_GET_ALL_REQUEST_SUCCESS:
      return { loading: false, success: true, usersInfo: actions.payload };
    case USERS_GET_ALL_REQUEST_FAIL:
      return { loading: false, error: actions.payload };
    case USERS_GET_ALL_REQUEST_RESET:
      return {};

    default:
      return state;
  }
};

export const getCategoriesReducer = (state = {}, actions) => {
  switch (actions.type) {
    case CATEGORIES_GET_ALL_REQUEST:
      return { ...state, loadingCat: true };
    case CATEGORIES_GET_ALL_REQUEST_SUCCESS:
      return {
        loadingCat: false,
        successCat: true,
        categoriesInfo: actions.payload,
      };
    case CATEGORIES_GET_ALL_REQUEST_FAIL:
      return { loadingCat: false, error: actions.payload };
    case CATEGORIES_GET_ALL_REQUEST_RESET:
      return {};

    default:
      return state;
  }
};




export const getAllEditorReducer = (state = {}, actions) => {
  switch (actions.type) {
    case EDITORS_GET_ALL_REQUEST:
      return { ...state, loading: true };
    case EDITORS_GET_ALL_SUCCESS:
      return { loading: false, success: true, editorsInfo: actions.payload };
    case EDITORS_GET_ALL_FAIL:
      return { loading: false, error: actions.payload };
    case EDITORS_GET_ALL_RESET:
      return {};

    default:
      return state;
  }
};



export const getAllReviewerReducer = (state = {}, actions) => {
  switch (actions.type) {
    case REVIEWERS_GET_ALL_REQUEST:
      return { ...state, loading: true };
    case REVIEWERS_GET_ALL_SUCCESS:
      return { loading: false, success: true, reviewersInfo: actions.payload };
    case REVIEWERS_GET_ALL_SUCCESS:
      return { loading: false, error: actions.payload };
    case REVIEWERS_GET_ALL_FAIL:
      return {};

    default:
      return state;
  }
};