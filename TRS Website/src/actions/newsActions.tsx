import axios from "axios";
import {
  NEWS_GET_ALL_REQUEST,
  NEWS_GET_ALL_REQUEST_FAIL,
  NEWS_GET_ALL_REQUEST_SUCCESS,
} from "../constants/newsConstants";

export const getNewsFromBackend = () => async (dispatch) => {
  try {
    dispatch({ type: NEWS_GET_ALL_REQUEST });
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.get(`/api/news/`, config);
    dispatch({
      type: NEWS_GET_ALL_REQUEST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEWS_GET_ALL_REQUEST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message, //passing the error
    });
  }
};
