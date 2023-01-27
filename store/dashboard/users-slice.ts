import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {User} from "../../server-modules/users/user";
import {dispatchToast} from "../../components/toast/dispatch-toast";

export interface userWrapper {
    users: userState
}

export interface userState {
    usersArray: User[]
}

const initialState:userState = {
    usersArray:[]
}

export const usersSlice = createSlice({
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
            setAllUserData:(state,action) => {
                state.usersArray = action.payload
            },
            setUserData:(state,action:PayloadAction<{index:number, user:User}>) => {
                state.usersArray[action.payload.index] = action.payload.user
                const opt = {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify(state.usersArray[action.payload.index])}
                fetch('/api/user/update-user', opt).then(
                    (res) => {
                        let message = res.ok ? "User updated" : "Error updating user: " + res.statusText
                        dispatchToast({content:message})
                    }
                )
            },
            setUserPermissions:(state, action:PayloadAction<{index:number, key:string, data:{auth:boolean}}>)=> {
                state.usersArray[action.payload.index].permissions[action.payload.key] = action.payload.data
                const opt = {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify(state.usersArray[action.payload.index])}
                fetch('/api/user/update-user', opt).then(
                    (res) => {
                        let message = res.ok ? "User permissions updated" : "Error updating user permissions: " + res.statusText
                        dispatchToast({content:message})
                    }
                )
            },
            deleteUser:(state, action:PayloadAction<{index:number}>)=>{
                const opt = {method:'POST', headers:{"Content-Type":"application/json"}, body: JSON.stringify(state.usersArray[action.payload.index])}
                state.usersArray.splice(action.payload.index, 1)
                fetch('/api/user/delete-user', opt).then((res) => {
                    let message = res.ok ? "User deleted" : "Error deleting user: " + res.statusText
                    dispatchToast({content:message})
                })
            }
        },
    })
;

export const {setUserData, setAllUserData, setUserPermissions, deleteUser} = usersSlice.actions

export const selectUsers = (state:userWrapper) => state.users.usersArray

export default usersSlice.reducer;