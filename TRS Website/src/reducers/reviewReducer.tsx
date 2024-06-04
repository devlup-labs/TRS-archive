import {
REVIEW_ASSIGN_REQUEST,
REVIEW_ASSIGN_SUCCESS,
REVIEW_ASSIGN_FAIL,
REVIEW_ASSIGN_RESET,
EDITOR_REVIEWS_REQUEST,
EDITOR_REVIEWS_SUCCESS,
EDITOR_REVIEWS_FAIL,
EDITOR_REVIEWS_RESET,
EDIT_REVIEW_RESET,
REVIEWS_REVIEWED_REQUEST,
REVIEWS_REVIEWED_SUCCESS,
REVIEWS_REVIEWED_FAILURE,


} from "../constants/reviewConstants"


export const assignReviewerReducer = (state = {}, actions) => {
  switch (actions.type) {
    case REVIEW_ASSIGN_REQUEST:
      return { ...state, loading: true };
    case REVIEW_ASSIGN_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case REVIEW_ASSIGN_FAIL:
      return { loading: false, error: actions.payload };
    case REVIEW_ASSIGN_RESET:
      return {};

    default:
      return state;
  }
};

export const editorReviewsReducer = (state = {reviewsInfo: []}, actions) => {
  switch (actions.type) {
    case EDITOR_REVIEWS_REQUEST:
      return { loading: true,reviewsInfo:[]};
    case EDITOR_REVIEWS_SUCCESS:
      return { loading: false, reviewsInfo: actions.payload };
    case EDITOR_REVIEWS_FAIL:
      return {  loading: false, error: actions.payload };
    case EDITOR_REVIEWS_RESET:
      return {};
    default:
      return state;
  }
};



export const editReviewReducer = (state = {}, actions) => {
  switch (actions.type) {
    case EDITOR_REVIEWS_REQUEST:
      return { ...state, loading: true };

    case EDITOR_REVIEWS_SUCCESS:
      return { loading: false, success: true, response: actions.payload };

    case EDITOR_REVIEWS_FAIL:
      return { loading: false, error: actions.payload };

    case EDIT_REVIEW_RESET:
      return {};

    default:
      return state;
  }
};



export const reviewReviewedReducer = (state = {reviews:[]}, actions) => {
  switch (actions.type) {
    case REVIEWS_REVIEWED_REQUEST:
      return { loading: true };
    case REVIEWS_REVIEWED_SUCCESS:
      return { loading: false, success: true, reviews: actions.payload };
    case REVIEWS_REVIEWED_FAILURE:
      return { loading: false, success: false, error: actions.payload };
    // case USER_LOGOUT:
    default:
      return state;
  }
};