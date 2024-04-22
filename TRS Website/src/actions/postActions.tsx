import {

POST_UPLOAD_SUCCESS,
POST_UPLOAD_REQUEST,
POST_UPLOAD_FAIL,
 

} from "../constants/postConstants";
import axios from "axios";
import Swal from "sweetalert2";




export const uploadPost = (email,title,body,category,subCategory,document) => async (dispatch) => {
  try {
    console.log(document)
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