import {legacy_createStore as createStore,combineReducers,applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import {composeWithDevTools} from '@redux-devtools/extension'

import {userVerifyReducer,
        userRegisterReducer,
        UserLoginReducer,
        userDetailsReducer,
        userUpdateProfileReducer,
        } from './reducers/userReducers'





const reducer=combineReducers({
    userVerify:userVerifyReducer,
    userRegister:userRegisterReducer,
    userLogin:UserLoginReducer,
    userDetails:userDetailsReducer,
    userUpdateProfile:userUpdateProfileReducer,


})


const userInfofrom_locStorage=localStorage.getItem('authToken')?
    JSON.parse(localStorage.getItem('authToken')):null //this is done to ensure that whenver we reload the it gets info from the local storage


const middleware = [thunk]

const initialState={
    userLogin:{authToken:userInfofrom_locStorage}
}

const store= createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))


export default store
