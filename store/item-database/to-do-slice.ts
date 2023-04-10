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
}

const initialState: toDoState = {
    items: [],
    threshold: 30,
    searchTodoItem: []
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
            const searchedTodoItem: Pick<schema.Item, "SKU" | "title" | "checkboxStatus">[] = []
            state.items.forEach(item => {
                if (item.SKU.includes(action.payload.toUpperCase())) {
                    searchedTodoItem.push(item)
                }
            });
            state.searchTodoItem = searchedTodoItem
            console.log(current(state))
        }
    },
});

export const {setToDoItems, setThreshold, setSearchTodoItems} = toDoSlice.actions

export const selectItems = (state: toDoWrapper) => state.todo.items

export const selectThreshold = (state: toDoWrapper) => state.todo.threshold

export const selectSearchedTodoItem = (state: toDoWrapper) => state.todo.searchTodoItem