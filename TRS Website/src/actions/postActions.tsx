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
CATEGORIES_GET_ALL_REQUEST,
CATEGORIES_GET_ALL_REQUEST_SUCCESS,
CATEGORIES_GET_ALL_REQUEST_FAIL,
SUBCAT_GET_ALL_REQUEST,
SUBCAT_GET_ALL_SUCCESS,
SUBCAT_GET_ALL_FAIL
 

} from "../constants/postConstants";

import axios from "axios";
import Swal from "sweetalert2";

export const listPosts = () => async (dispatch) => {
  try {
    dispatch({ type: POST_LIST_REQUEST });
    const { data } = await axios.get(`/api/posts/allpost/`);
    console.log(data);

    dispatch({
      type: POST_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: POST_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message, //passing the error
    });
  }
};

export const uploadPost =
  (email, title, body, category, subCategory, document) => async (dispatch) => {
    try {
      console.log(document);
      dispatch({
        type: POST_UPLOAD_REQUEST,
      });

    const formData = new FormData();
    formData.append('user', email);
    formData.append('title', title);
    formData.append('body', body);
    formData.append('category', category);
    formData.append('sub_category', subCategory);
    formData.append('document', document); // Assuming document is a File object

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };

    const { data } = await axios.post(
      "/api/posts/upload/",
      formData,
      config
    );
    dispatch({
      type: POST_UPLOAD_SUCCESS,
      payload: data,
    });

    Swal.fire({
      title: "Your paper has been successfully uploaded ",
      icon: "success",
      toast: true,
      timer: 3000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });

    
  } catch (error) {
    dispatch({
      type: POST_UPLOAD_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message, //passing the error
    });
    

    Swal.fire({
      title: { error },
      icon: "error",
      toast: true,
      timer: 3000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });

  }
};




export const getCategoriesAction = () => async (dispatch) => {
  try {
    dispatch({
      type: CATEGORIES_GET_ALL_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.get(`/api/categories/getCategories/`, config);
    dispatch({
      type: CATEGORIES_GET_ALL_REQUEST_SUCCESS,
      payload: data,
    });
    
  } catch (error) {
    dispatch({
      type: CATEGORIES_GET_ALL_REQUEST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message, //passing the error
    });
  }
};



export const getSubCategoriesAction = (cat) => async (dispatch) => {
  try {
    dispatch({
      type: SUBCAT_GET_ALL_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
        
      }
    };
    console.log(cat)
    const { data } = await axios.post(`/api/categories/getSubCat/`, {cat}, config);
    dispatch({
      type: SUBCAT_GET_ALL_SUCCESS,
      payload: data,
    });

    console.log(data)
    
  } catch (error) {
    dispatch({
      type: SUBCAT_GET_ALL_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message, //passing the error
    });
  }
};










// for getting info for a particular post
export const getuserPostDetails = (id: string) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_POSTS_REQUEST,
    });

    const {
      userLogin: { authToken },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken.access}`, //giving the token of the logged in user
      },
    };

    const { data } = await axios.get(`/api/posts/${id}/posts/`, config);
    dispatch({
      type: USER_POSTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_POSTS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message, //passing the error
    });
  }
};



export const getAssignedPosts = (id: string) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_POSTS_REQUEST,
    });

    const {
      userLogin: { authToken },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken.access}`, //giving the token of the logged in user
      },
    };

    const { data } = await axios.get(`/api/posts/${id}/posts/`, config);
    dispatch({
      type: USER_POSTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_POSTS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message, //passing the error
    });
  }
};



export const getUnAssignedPosts = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: POST_UNASSIGNED_REQUEST,
    });
    const {
      userLogin: { authToken },
    } = getState();
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken.access}`, //giving the token of the logged in user
      },
    };
    const { data } = await axios.get(`/api/posts/${id}/posts/`, config); //route chnage is required
    dispatch({
      type: POST_UNASSIGNED_REQUEST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: POST_UNASSIGNED_REQUEST_FAILURE,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message, //passing the error
    });
  }
};

