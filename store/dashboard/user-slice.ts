import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {User} from "../../server-modules/users/user";

export interface userWrapper {
    users: userState
}

export interface userState {
    usersArray: User[]
}

const initialState:userState = {
    usersArray:[]
}

export const userSlice = createSlice({
        name: "users",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return{
                    ...state,
                    ...action.payload.users
                }
            },
        },
        reducers:{
            setAllUserData:(state,action) => {state.usersArray = action.payload},
            setUserData:(state,action:PayloadAction<{index:number, user:User}>) => {
                state.usersArray[action.payload.index] = action.payload.user
                const opt = {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify(state.usersArray[action.payload.index])}
                fetch('/api/user/update-user', opt).then(res=>console.log(res))
            },
            setUserPermissions:(state, action:PayloadAction<{index:number, key:string, data:{auth:boolean}}>)=> {
                state.usersArray[action.payload.index].permissions[action.payload.key] = action.payload.data
                const opt = {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify(state.usersArray[action.payload.index])}
                fetch('/api/user/update-user', opt).then(res=>console.log(res))
            },
            deleteUser:(state, action:PayloadAction<{index:number}>)=>{
                const opt = {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify(state.usersArray[action.payload.index])}
                fetch('/api/user/delete-user', opt).then(()=>window.location.reload())
            }
        },
    })
;

export const {setUserData, setAllUserData, setUserPermissions, deleteUser} = userSlice.actions

export const selectUsers = (state:userWrapper) => state.users.usersArray

export default userSlice.reducer;