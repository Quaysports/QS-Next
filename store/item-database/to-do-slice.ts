import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {RootState} from "../store";
import {schema} from "../../types"

export const hydrate = createAction<RootState>(HYDRATE);

export interface toDoWrapper {
    todo: toDoState
}

export interface toDoState {
    items: Pick<schema.Item, "SKU" | "title" | "checkboxStatus">[],
    threshold: number,
    channel: string,
    status: string
}

const initialState: toDoState = {
    items: [],
    threshold: 30,
    channel: "",
    status: ""
}

export const toDoSlice = createSlice({
        name: "todo",
        initialState,
        extraReducers: (builder) => {
            builder
                .addCase(hydrate, (state, action) => {
                    return {
                        ...state,
                        ...action.payload.todo
                    };
                })
                .addDefaultCase(() => {
                })
        },
        reducers: {
            setToDoItems: (state, action: PayloadAction<schema.Item[]>) => {
                state.items = action.payload
            },
            setThreshold: (state, action: PayloadAction<number>) => {
                state.threshold = action.payload
            }
        },
    })
;

export const {setToDoItems, setThreshold} = toDoSlice.actions

export const selectItems = (state: toDoWrapper) => state.todo.items

export const selectThreshold = (state: toDoWrapper) => state.todo.threshold