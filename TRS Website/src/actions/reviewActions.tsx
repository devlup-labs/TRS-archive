import {
REVIEW_ASSIGN_REQUEST,
REVIEW_ASSIGN_SUCCESS,
REVIEW_ASSIGN_FAIL,
REVIEW_ASSIGN_RESET,


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