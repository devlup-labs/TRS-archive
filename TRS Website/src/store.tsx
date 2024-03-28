import {legacy_createStore as createStore,combineReducers,applyMiddleware} from 'redux'
import {thunk} from 'redux-thunk'
import {composeWithDevTools} from '@redux-devtools/extension'

import {UserLoginReducer,
        userDetailsReducer,
        userUpdateProfileReducer,
        } from './reducers/userReducers'





const reducer=combineReducers({
    userLogin:UserLoginReducer,
    userDetails:userDetailsReducer,
    userUpdateProfile:userUpdateProfileReducer,


})


const userInfofrom_locStorage=localStorage.getItem('userInfo')?
    JSON.parse(localStorage.getItem('userInfo')):null //this is done to ensure that whenver we reload the it gets info from the local storage


const middleware = [thunk]

const initialState={
    userLogin:{userInfo:userInfofrom_locStorage}
}

const store= createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))


export default store
