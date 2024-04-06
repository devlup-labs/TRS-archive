
import {
    USER_LOGIN_SUCCESS,
    USER_LOGIN_REQUEST,
    USER_LOGOUT,
    USER_LOGIN_FAIL,

    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_RESET,


    USER_VERIFY_REQUEST,
    USER_VERIFY_EMAIL,
    USER_VERIFY_SUCCESS,
    USER_VERIFY_FAIL,
    USER_VERIFY_RESET,

    USER_REGISTER_SUCCESS,
    USER_REGISTER_REQUEST,
    USER_REGISTER_FAIL,


    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_FAIL,
} from '../constants/userConstants'

import axios from 'axios'
import Swal from "sweetalert2";
import {useNavigate} from 'react-router-dom'



export const verify=(id)=>async(dispatch)=>{
    try{
    
        
        const config={
            headers:{
                'Content-type':'application/json'
            }
        }

        const {data} = await axios.post(
            '/api/users/verify/',
            {'key':id},
            config
        )

        const { message, email } = data;


        dispatch({
            type:USER_VERIFY_SUCCESS,
            payload:email

        })

        console.log("prinitng data after verification is complete")
        console.log(email)
        

    }
     catch(error){
        dispatch({
            type: USER_VERIFY_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail
            :error.message, //passing the error 
        })
    }
}

// export const register
export const send_email=(email) => async (dispatch) => {
    try{
        dispatch({
            type:USER_VERIFY_REQUEST
        })

        const config={
            headers:{
                'Content-type':'application/json'
            }
        }

        const {data} = await axios.post(
            '/api/users/send_email/',
            {'email':email},
            config
        )

        Swal.fire({
        title: "Check your email to complete registration",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });

        dispatch({
            type:USER_VERIFY_EMAIL,
            payload:data
        })  


        // console.log(data)

        
    }

    catch(error){
        dispatch({
            type: USER_VERIFY_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail
            :error.message, //passing the error 
        })
    }

}


export const register=(email,name,password) => async (dispatch) => {
    try{
        dispatch({
            type:USER_REGISTER_REQUEST

        })

        const config={
            headers:{
                'Content-type':'application/json'
            }
        }
        

        const {data} = await axios.post(
            '/api/users/register/',
            {'name':name, 'email':email,'password':password},
            config
        )
        dispatch({
            type:USER_REGISTER_SUCCESS,
            payload:data
        })  

        Swal.fire({
            title: "Registration Successful \nRedirecting to Login Page",
            icon: "success",
            toast: true,
            timer: 3000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
        })

        // dispatch({
        //     type:USER_LOGIN_SUCCESS,
        //     payload:data
        // })  
        
        // localStorage.setItem('userInfo',JSON.stringify(data))
    }
    catch(error){
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail
            :error.message, //passing the error 
        })
        Swal.fire({
        title: {error},
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
}



export const login=(email,password) => async (dispatch) => {
    try{
        dispatch({
            type:USER_LOGIN_REQUEST

        })

        const config={
            headers:{
                'Content-type':'application/json'
            }
        }
        const {data} = await axios.post(
            '/api/users/token/',
            {
                email,
                password,
            },
            config
        )
        dispatch({
            type:USER_LOGIN_SUCCESS,
            payload:data
        })
        console.log(data)
       
        Swal.fire({
            title: "Login Successful \nRedirecting to Dashboard",
            icon: "success",
            toast: true,
            timer: 3000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
    })

        
    localStorage.setItem('authToken',JSON.stringify(data))
    }

    
    catch(error){
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail
            :error.message, //passing the error 
        })
        Swal.fire({
        title: "Username or password does not exist",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
        
    }

}


export const logout=()=>(dispatch) => {
    localStorage.removeItem('authToken') //removing from the local storage
    dispatch({type: USER_LOGOUT}) //changing state of the userLogin to null
    dispatch({type:USER_DETAILS_RESET}) //changing state of the userDetails to null
}


export const getUserDetails=(id: string) => async (dispatch,getState) => {
    try{
        dispatch({
            type:USER_DETAILS_REQUEST

        })

        const {
            userLogin:{authToken},
        } = getState()

        const config={
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${authToken.access}`  //giving the token of the logged in user

            }
        }

        const {data} = await axios.get(
            `/api/users/${id}`,
            config
        )
        dispatch({
            type:USER_DETAILS_SUCCESS,
            payload:data
        })  

    }
    catch(error){
        dispatch({
            type: USER_DETAILS_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail
            :error.message, //passing the error 
        })
    }
}

export const updateUserProfile=(user) => async (dispatch,getState) => {
    try{
        dispatch({
            type:USER_UPDATE_PROFILE_REQUEST

        })

        const {
            userLogin:{authToken},
        } = getState()

        const config={
            headers:{
                'Content-type':'application/json',
                Authorization: `Bearer ${authToken.access}`  //giving the token of the logged in user

            }
        }

        const {data} = await axios.put(
            `/api/users/profile/update/`,
            user,
            config
        )
        dispatch({
            type:USER_UPDATE_PROFILE_SUCCESS,
            payload:data
        })  

        dispatch({
            type:USER_LOGIN_SUCCESS,
            payload:data
        })

        localStorage.setItem('authToken',JSON.stringify(data)) //to update the local storage with the new data

    }
    catch(error){
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload:error.response && error.response.data.detail 
            ? error.response.data.detail
            :error.message, //passing the error 
        })
    }
}