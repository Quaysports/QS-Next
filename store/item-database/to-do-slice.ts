import {createAction, createSlice, current, PayloadAction} from "@reduxjs/toolkit";
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
    searchTodoItem: Pick<schema.Item, "SKU" | "title" | "checkboxStatus">[]
    searchTerm: string
}

const initialState: toDoState = {
    items: [],
    threshold: 50,
    searchTodoItem: [],
    searchTerm: ""
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
        },
        setSearchTodoItems: (state, action: PayloadAction<string>) => {
            state.searchTodoItem = state.items.filter(item => {
                return item.SKU.includes(action.payload.toUpperCase())
            })
            console.log(current(state))
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload.toUpperCase()
        }
    },
});

export const {
    setToDoItems, setThreshold, setSearchTodoItems,
    setSearchTerm
} = toDoSlice.actions

export const selectItems = (state: toDoWrapper) => state.todo.items

export const selectThreshold = (state: toDoWrapper) => state.todo.threshold

export const selectSearchedTodoItem = (state: toDoWrapper) => state.todo.searchTodoItem
export const selectSearchTerm = (state: toDoWrapper) => state.todo.searchTerm