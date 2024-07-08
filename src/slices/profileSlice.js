import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    //  yahaa par fasa tha bahut ganda ! 
    //  jab bhi dashboard me main logged in tha aur refresh kar rha tha to user pehle sirf null par set ho aa rha tha 
    //  but local storage me isko store karnaa bhi padta hai yaha se yeh seekha !! and intervieew me boldena yeh 
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    loading: false,
}

const profileSlice = createSlice({
    name: "profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
    },
});

export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;

 