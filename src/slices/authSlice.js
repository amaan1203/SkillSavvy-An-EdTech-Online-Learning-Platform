import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    //  signup data hamaara signup karne ke lie model me jo jo data chahie wo sab store karega
    signupData: null,
    // loading waali state hame bataaegi ki spinner kab dikhaana hai
    loading: false,
    // local storage ke andar agr tab band bhi kar dia tab bhi value saved rehti hai
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
    // initially agr local storage se token mil jaae to use set kar do
}


const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setToken(state, value) {
            state.token = value.payload;
        },
    },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;