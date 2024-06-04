import {
REVIEW_ASSIGN_REQUEST,
REVIEW_ASSIGN_SUCCESS,
REVIEW_ASSIGN_FAIL,
REVIEW_ASSIGN_RESET,
EDITOR_REVIEWS_REQUEST,
EDITOR_REVIEWS_SUCCESS,
EDITOR_REVIEWS_FAIL,
EDIT_REVIEW_REQUEST,
EDIT_REVIEW_SUCCESS,
EDIT_REVIEW_FAIL,
REVIEWS_REVIEWED_REQUEST,
REVIEWS_REVIEWED_SUCCESS,
REVIEWS_REVIEWED_FAILURE,



} from "../constants/reviewConstants"

import axios from "axios";
import Swal from "sweetalert2";


export const assignReviewer=(postId,reviewer)=>async(dispatch,getState)=>{
  try{
    console.log(postId) 
    console.log(reviewer)
    dispatch({type:REVIEW_ASSIGN_REQUEST})
    const {
      userLogin: { authToken },
    } = getState();

     const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };


    const {data}=await axios.post(`/api/reviews/Editor/review/${postId}/create/`,{reviewer},config);
    console.log(data)
    Swal.fire({
      title: "Reviewer assigned ",
      icon: "success",
      toast: true,
      timer: 3000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });

    dispatch({
      type: REVIEW_ASSIGN_SUCCESS,
      payload:data
    })
    
  }
  catch(error){
    console.log(error)
    dispatch({
      type: REVIEW_ASSIGN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message, //passing the error
    });
  }
}







export const listEditorReviewAction = () => async (dispatch,getState) => {
  try {
    const url = `/api/reviews/Editor/reviews/`;

    dispatch({ type: EDITOR_REVIEWS_REQUEST });
    const {
      userLogin: { authToken },
    } = getState();


    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    const {data}=await axios.get(url,config);

    console.log(data);

    dispatch({
      type: EDITOR_REVIEWS_SUCCESS,
      payload: data,
    });
  } 
  catch (error) {
    dispatch({
      type: EDITOR_REVIEWS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message, //passing the error
    });
  }
};



export const updateReview = (review) => async (dispatch, getState) => {
  try {
    dispatch({
      type: EDIT_REVIEW_REQUEST,
    });

    // console.log("the pdf path is :")
    review['reviewed_pdf'] = review['reviewed_pdf'] !== undefined ? review['reviewed_pdf'] : null;
    console.log(review['reviewed_pdf'])

    const {
      userLogin: { authToken },
    } = getState();

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: `Bearer ${authToken.access}`, //giving the token of the logged in user
      },
    };

    const { data } = await axios.put(
      `/api/reviews/review/:${review['id']}/`,
      review,
      config
    );
    dispatch({
      type: EDIT_REVIEW_SUCCESS,
      payload: data,
    });
     Swal.fire({
      title: "Review edited successfully",
      icon: "success",
      toast: true,
      timer: 3000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });

  } catch (error) {
    dispatch({
      type: EDIT_REVIEW_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message, //passing the error
    });
  }
};



export const getReviewedReviews = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: REVIEWS_REVIEWED_REQUEST,
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

    const { data } = await axios.get(`/api/reviews/Reviewer/reviews/reviewed/`, config);
    console.log(data)
    dispatch({
      type: REVIEWS_REVIEWED_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REVIEWS_REVIEWED_FAILURE,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message, //passing the error
    });
  }
};