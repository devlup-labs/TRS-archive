import {
  NEWS_GET_ALL_REQUEST,
  NEWS_GET_ALL_REQUEST_FAIL,
  NEWS_GET_ALL_REQUEST_RESET,
  NEWS_GET_ALL_REQUEST_SUCCESS,
} from "../constants/newsConstants";

export const getNewsReducer = (state = {}, actions) => {
  switch (actions.type) {
    case NEWS_GET_ALL_REQUEST:
      return { ...state, loading: true };
    case NEWS_GET_ALL_REQUEST_SUCCESS:
      return { loading: false, success: true, newsInfo: actions.payload };
    case NEWS_GET_ALL_REQUEST_FAIL:
      return { loading: false, error: actions.payload };
    case NEWS_GET_ALL_REQUEST_RESET:
      return {};

    default:
      return state;
  }
};
