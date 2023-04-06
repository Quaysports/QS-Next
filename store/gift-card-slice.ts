import {
  createAction,
  createSlice,
  current,
  PayloadAction,
} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { RootState } from "./store";
import { schema } from "../types";
import { GiftCardType } from "../server-modules/shop/shop";

export const hydrate = createAction<RootState>(HYDRATE);

export interface giftCardWrapper {
  giftcards: giftCardState;
}

export default interface giftCardState {
  giftcard: GiftCardType[];
  activeGiftcards: GiftCardType[];
  searchGiftcards: GiftCardType[];
}

const initialState: giftCardState = {
  giftcard: [],
  activeGiftcards: [],
  searchGiftcards: [],
};

export const giftCardSlice = createSlice({
  name: "giftcards",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(hydrate, (state, action) => {
        return {
          ...state,
          ...action.payload.giftcards,
        };
      })
      .addDefaultCase(() => {});
  },
  reducers: {
    setGiftCards: (state, action: PayloadAction<GiftCardType[]>) => {
      let tempArray = [];
      for (const giftCard of action.payload) {
        if (giftCard.active) {
          tempArray.push(giftCard);
        }
      }
      state.activeGiftcards = tempArray;
      state.giftcard = action.payload;
    },
    setSearchGiftcards: (state, action: PayloadAction<string>) => {
      const tempArray: GiftCardType[] = [];
      state.activeGiftcards.forEach((giftcard) => {
        if (
          giftcard.id.toUpperCase().startsWith(action.payload.toUpperCase())
        ) {
          tempArray.push(giftcard);
        }
      });
      state.searchGiftcards = tempArray.sort();
      console.log(current(state));
    },
  },
});

export const { setGiftCards, setSearchGiftcards } = giftCardSlice.actions;

export const selectGiftCards = (state: giftCardWrapper) =>
  state.giftcards.giftcard;
export const selectActive = (state: giftCardWrapper) =>
  state.giftcards.activeGiftcards;
export const selectSearchedGiftCard = (state: giftCardWrapper) =>
  state.giftcards.searchGiftcards;
