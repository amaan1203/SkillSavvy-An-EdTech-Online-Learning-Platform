import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice";
import courseReducer from "../slices/courseSlice"
import viewCourseReducer from "../slices/viewCourseSlice"

const rootReducer= combineReducers({

    //  isme hamaare saare reducers stored hai
  
    //  ab yeh saare reducers create kaise hote hai ?
    //  these reducers are created by slices jisme initial state pass karni hoti hai 
    // , name pass karna hota hai and reducer pass kara hota hia 
    //  to import this reducer from the slices created for it 
    auth: authReducer,
    profile: profileReducer,
    cart: cartReducer,
    //  interview me bataana yaha par course reducer export nahi kia tha bahut tima laga tha yaha par bhi
    
    course: courseReducer,
    viewCourse:viewCourseReducer


})

export default rootReducer;