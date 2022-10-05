import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {QuickLinkItem, QuickLinks} from "../../server-modules/shop/shop";

export interface quickLinksWrapper {
    quickLinks: quickLinksState
}

export interface quickLinksState {
    quickLinksArray: QuickLinks[]
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
            updateQuickLinks: (state, action: PayloadAction<QuickLinks[]>) => {
                state.quickLinksArray = action.payload
            },
            addNewQuickLinkMenu: (state, action: PayloadAction<QuickLinks>) => {
                state.quickLinksArray.push(action.payload)
                const opt = {method: 'POST', body: JSON.stringify(action.payload)}
                fetch('/api/shop-tills/update-quick-links', opt).then(res => console.log(res))
            },
            updateQuickLinkID: (state, action: PayloadAction<{ linksIndex: number, data: string }>) => {
                state.quickLinksArray[action.payload.linksIndex].id = action.payload.data
                const opt = {method: 'POST', body: JSON.stringify(state.quickLinksArray[action.payload.linksIndex])}
                fetch('/api/shop-tills/update-quick-links', opt).then(res => console.log(res))
            },

            deleteQuickLink: (state, action: PayloadAction<number>) => {
                const opt = {method: 'POST', body: JSON.stringify(state.quickLinksArray[action.payload])}
                fetch('/api/shop-tills/delete-quick-links', opt).then(res => console.log(res))
                state.quickLinksArray.splice(action.payload, 1)
            },

            updateQuickLinkItemColour: (state, action: PayloadAction<{ linksIndex: number, itemIndex: number, colour: string }>) => {
                state.quickLinksArray[action.payload.linksIndex].links[action.payload.itemIndex].COLOUR = action.payload.colour
                const opt = {method: 'POST', body: JSON.stringify(state.quickLinksArray[action.payload.linksIndex])}
                fetch('/api/shop-tills/update-quick-links', opt).then(res => console.log(res))
            },
            swapQuickLinkItems: (state, action: PayloadAction<{ linksIndex: number, itemIndex: number, targetIndex: number }>) => {
                const from = action.payload.itemIndex;
                const to = action.payload.targetIndex;
                [state.quickLinksArray[action.payload.linksIndex].links[from], state.quickLinksArray[action.payload.linksIndex].links[to]] = [state.quickLinksArray[action.payload.linksIndex].links[to], state.quickLinksArray[action.payload.linksIndex].links[from]];
                const opt = {method: 'POST', body: JSON.stringify(state.quickLinksArray[action.payload.linksIndex])}
                fetch('/api/shop-tills/update-quick-links', opt).then(res => console.log(res))
            },
            deleteQuickLinkItem: (state, action: PayloadAction<{ linksIndex: number, itemIndex: number }>) => {
                state.quickLinksArray[action.payload.linksIndex].links[action.payload.itemIndex] = {SKU: ""}
                const opt = {method: 'POST', body: JSON.stringify(state.quickLinksArray[action.payload.linksIndex])}
                fetch('/api/shop-tills/update-quick-links', opt).then(res => console.log(res))
            },
            addItemToLinks: (state, action: PayloadAction<{ linksIndex: number, itemIndex: number, data: QuickLinkItem }>) => {
                state.quickLinksArray[action.payload.linksIndex].links[action.payload.itemIndex] = action.payload.data
                const opt = {method: 'POST', body: JSON.stringify(state.quickLinksArray[action.payload.linksIndex])}
                fetch('/api/shop-tills/update-quick-links', opt).then(res => console.log(res))
            }
        },
    })
;

export const {
    updateQuickLinks,
    addNewQuickLinkMenu,
    updateQuickLinkID,
    deleteQuickLink,
    updateQuickLinkItemColour,
    swapQuickLinkItems,
    deleteQuickLinkItem,
    addItemToLinks
} = quickLinksSlice.actions

export const selectQuickLinks = (state: quickLinksWrapper) => state.quickLinks.quickLinksArray

export default quickLinksSlice.reducer;