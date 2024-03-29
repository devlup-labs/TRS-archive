
import {
    USER_LOGIN_SUCCESS,
    USER_LOGIN_REQUEST,
    USER_LOGOUT,
    USER_LOGIN_FAIL,

    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_RESET,


    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_FAIL,
} from '../constants/userConstants'

import axios from 'axios'
import Swal from "sweetalert2";



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