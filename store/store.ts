import {
  CombinedState,
  combineReducers,
  configureStore,
  PreloadedState,
} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { stockReportsSlice } from "./reports/stock-reports-slice";
import { shopOrdersSlice } from "./shop-orders-slice";
import { usersSlice } from "./dashboard/users-slice";
import { quickLinksSlice } from "./shop-tills/quicklinks-slice";
import { itemDatabaseSlice } from "./item-database/item-database-slice";
import { forecastSlice } from "./stock-forecast-slice";
import { marginCalculatorSlice } from "./margin-calculator-slice";
import { sessionSlice } from "./session-slice";
import { shipmentsSlice } from "./shipments-slice";
import { holidaysSlice } from "./dashboard/holiday-slice";
import { rotaSlice } from "./dashboard/rotas-slice";
import { pickListSlice } from "./shop-tills/pick-list-slice";
import { salesSlice } from "./reports/sales-slice";
import { newItemsSlice } from "./item-database/new-items-slice";
import { toDoSlice } from "./item-database/to-do-slice";
import { resetStore } from "./reset-store";
import { AnyAction } from "redux";
import { stockTransferStore } from "./stock-transfer-slice";
import { giftCardSlice } from "./gift-card-slice";

export const rootReducer = (state: CombinedState<any>, action: AnyAction) => {
  if (action.type === "RESET_STORE/reset") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const appReducer = combineReducers({
  [shopOrdersSlice.name]: shopOrdersSlice.reducer,
  [stockReportsSlice.name]: stockReportsSlice.reducer,
  [usersSlice.name]: usersSlice.reducer,
  [quickLinksSlice.name]: quickLinksSlice.reducer,
  [itemDatabaseSlice.name]: itemDatabaseSlice.reducer,
  [forecastSlice.name]: forecastSlice.reducer,
  [marginCalculatorSlice.name]: marginCalculatorSlice.reducer,
  [sessionSlice.name]: sessionSlice.reducer,
  [shipmentsSlice.name]: shipmentsSlice.reducer,
  [holidaysSlice.name]: holidaysSlice.reducer,
  [rotaSlice.name]: rotaSlice.reducer,
  [pickListSlice.name]: pickListSlice.reducer,
  [salesSlice.name]: salesSlice.reducer,
  [newItemsSlice.name]: newItemsSlice.reducer,
  [resetStore.name]: resetStore.reducer,
  [stockTransferStore.name]: stockTransferStore.reducer,
  [toDoSlice.name]: toDoSlice.reducer,
  [giftCardSlice.name]: giftCardSlice.reducer,
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
    preloadedState,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;

export const appWrapper = createWrapper(() => setupStore());
