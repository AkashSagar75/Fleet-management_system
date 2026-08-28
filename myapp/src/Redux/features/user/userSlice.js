import { createSlice }  from "@reduxjs/toolkit"

const getUserInfo = () => {
    const data = sessionStorage.getItem('user');
    if(!data)
    {
         return null;
    }

    try {

        return data ? JSON.parse(data) : null;
    } catch (error) {
       console.error("Invalid user data in sessionStorage");
    return null;
    }
};
const  userSlice = createSlice(
    {
         name: "user",
         initialState:getUserInfo() || null,
         reducers:{}
    }
)

export  default  userSlice.reducer