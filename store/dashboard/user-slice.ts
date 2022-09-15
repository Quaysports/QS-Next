import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {user} from "../../server-modules/users/user";

export interface userWrapper {
    users: userState
}

export interface userState {
    activeUser:user | null
    usersArray: user[]
}

const initialState:userState = {
    activeUser:null,
    usersArray:[]
}

export const userSlice = createSlice({
        name: "users",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                state.usersArray = action.payload.users.usersArray
            },
        },
        reducers:{
            setActiveUser:(state, action)=> {state.activeUser = action.payload},
            setAllUserData:(state,action) => {state.usersArray = action.payload},
            setUserData:(state,action:PayloadAction<{index:string, key:string, data:string}>) => {
                state.usersArray[action.payload.index][action.payload.key] = action.payload.data
                const opt = {method:'POST', body: JSON.stringify(state.usersArray[action.payload.index])}
                fetch('/api/user/update-user', opt).then(res=>console.log(res))
            },
            setUserPermissions:(state, action:PayloadAction<{index:string, key:string, data:{auth:boolean}}>)=> {
                state.usersArray[action.payload.index].permissions[action.payload.key] = action.payload.data
                const opt = {method:'POST', body: JSON.stringify(state.usersArray[action.payload.index])}
                fetch('/api/user/update-user', opt)
            },
            deleteUser:(state, action:PayloadAction<{index:string}>)=>{
                const opt = {method:'POST', body: JSON.stringify(state.usersArray[action.payload.index])}
                fetch('/api/user/delete-user', opt).then(()=>window.location.reload())
            }
        },
    })
;

export const {setActiveUser, setUserData, setAllUserData, setUserPermissions, deleteUser} = userSlice.actions

export const selectUsers = (state:userWrapper) => state.users.usersArray
export const activeUser = (state:userWrapper) => state.users.activeUser
export const activeUserPermissions = (state:userWrapper) => state.users.activeUser.permissions

export default userSlice.reducer;