import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

interface quicklinksSlice {
    id: string;
    links: {
        SKU: string;
        SHOPPRICEINCVAT: number;
        TITLE: string;
    }[]
}

export interface quickLinksWrapper {
    quickLinks: quickLinksState
}

export interface quickLinksState {
    quickLinksArray: quicklinksSlice[]
}

const initialState: quickLinksState = {
    quickLinksArray: []
}

export const quickLinksSlice = createSlice({
        name: "quickLinks",
        initialState,
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.quickLinks
                }
            },
        },
        reducers: {
            updateQuickLinks: (state, action) => {
                state.quickLinksArray = action.payload
            },
            addNewQuickLinkMenu:(state, action)=>{
                state.quickLinksArray.push(action.payload)
                const opt = {method: 'POST', body: JSON.stringify(action.payload)}
                fetch('/api/shop-tills/update-quick-links', opt).then(res => console.log(res))
            },
            updateQuickLinkID: (state, action) => {
                state.quickLinksArray[action.payload.id].id = action.payload.data
                const opt = {method: 'POST', body: JSON.stringify(state.quickLinksArray[action.payload.id])}
                fetch('/api/shop-tills/update-quick-links', opt).then(res => console.log(res))
            },
            deleteQuickLink: (state, action) => {
                const opt = {method: 'POST', body: JSON.stringify(state.quickLinksArray[action.payload])}
                fetch('/api/shop-tills/delete-quick-links', opt)
            },
            deleteQuickLinkItem: (state, action) => {
                state.quickLinksArray[action.payload.listIndex].links.splice(action.payload.itemIndex,1)
                const opt = {method: 'POST', body: JSON.stringify(state.quickLinksArray[action.payload.listIndex])}
                fetch('/api/shop-tills/update-quick-links', opt)
            },
            addItemToLinks: (state, action) => {
                let pos = state.quickLinksArray[action.payload.id].links.map(item => item.SKU).indexOf(action.payload.data.SKU)
                if (pos === -1) {
                    state.quickLinksArray[action.payload.id].links.push(action.payload.data)
                    const opt = {method: 'POST', body: JSON.stringify(state.quickLinksArray[action.payload.id])}
                    fetch('/api/shop-tills/update-quick-links', opt).then(res => console.log(res))
                }
            }
        },
    })
;

export const {updateQuickLinks, addNewQuickLinkMenu, updateQuickLinkID, deleteQuickLink,deleteQuickLinkItem, addItemToLinks} = quickLinksSlice.actions

export const selectQuickLinks = (state: quickLinksWrapper) => state.quickLinks.quickLinksArray

export default quickLinksSlice.reducer;