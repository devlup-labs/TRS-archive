import {
REVIEW_ASSIGN_REQUEST,
REVIEW_ASSIGN_SUCCESS,
REVIEW_ASSIGN_FAIL,
REVIEW_ASSIGN_RESET,


} from "../constants/reviewConstants"


export const assignReviewerReducer = (state = {}, actions) => {
  switch (actions.type) {
    case REVIEW_ASSIGN_REQUEST:
      return { ...state, loadingCat: true };
    case REVIEW_ASSIGN_SUCCESS:
      return {
        loadingCat: false,
        successCat: true,
        categoriesInfo: actions.payload,
      };
    case REVIEW_ASSIGN_FAIL:
      return { loadingCat: false, error: actions.payload };
    case REVIEW_ASSIGN_RESET:
      return {};

    default:
      return state;
  }
};

