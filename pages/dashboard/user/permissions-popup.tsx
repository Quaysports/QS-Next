import style from "./user.module.css";
import {useDispatch, useSelector} from "react-redux";
import {selectUsers, setUserPermissions} from "../../../store/dashboard/users-slice";
import {ChangeEvent} from "react";
import {User} from "../../../server-modules/users/user";

/**
 * @param {string} index - Index of user in {@link User} array.
 */
export interface PermissionsPopupProps {
    index: string
}

/**
 * Change permissions component. Used in popup call.
 */
export default function PermissionsPopup({index}: PermissionsPopupProps) {
    const user = useSelector(selectUsers)[Number(index)]
    const dispatch = useDispatch()

    function updatePermissions(index: string, key: string, e: ChangeEvent<HTMLInputElement>) {
        dispatch(setUserPermissions({index: Number(index), key: key, data: {auth: e.target.checked}}))
    }

    return (<div key={index} className={style["permission-wrapper"]}>
        <div className={style["permission-table"]}>
            <div className={style["permission-table-title"]}>Apps</div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.shopOrders?.auth}
                        onChange={(e) => updatePermissions(index, "shopOrders", e)}/><label>Shop Orders</label></div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.shopTills?.auth}
                        onChange={(e) => updatePermissions(index, "shopTills", e)}/><label>Shop Tills</label></div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.reports?.auth}
                        onChange={(e) => updatePermissions(index, "reports", e)}/><label>Reports</label></div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.itemDatabase?.auth}
                        onChange={(e) => updatePermissions(index, "itemDatabase", e)}/><label>Item Database</label>
            </div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.stockForecast?.auth}
                        onChange={(e) => updatePermissions(index, "stockForecast", e)}/><label>Stock Forecast</label>
            </div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.shipments?.auth}
                        onChange={(e) => updatePermissions(index, "shipments", e)}/><label>Shipments</label></div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.marginCalculator?.auth}
                        onChange={(e) => updatePermissions(index, "marginCalculator", e)}/><label>Margin
                Calculator</label></div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.stockTransfer?.auth}
                        onChange={(e) => updatePermissions(index, "stockTransfer", e)}/><label>Stock Transfer</label>
            </div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.stockTakeList?.auth}
                        onChange={(e) => updatePermissions(index, "stockTakeList", e)}/><label>Stock Take List</label>
            </div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.webpages?.auth}
                        onChange={(e) => updatePermissions(index, "webpages", e)}/><label>Webpages</label></div>
        </div>
        <div className={style["permission-table"]}>
            <div className={style["permission-table-title"]}>Dashboard Tabs</div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.users?.auth}
                        onChange={(e) => updatePermissions(index, "users", e)}/><label>Users</label></div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.orderSearch?.auth}
                        onChange={(e) => updatePermissions(index, "orderSearch", e)}/><label>Order Search</label></div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.priceUpdates?.auth}
                        onChange={(e) => updatePermissions(index, "priceUpdates", e)}/><label>Price Updates</label>
            </div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.shop?.auth}
                        onChange={(e) => updatePermissions(index, "shop", e)}/><label>Shop Report</label></div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.online?.auth}
                        onChange={(e) => updatePermissions(index, "online", e)}/><label>Online Report</label></div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.rotas?.auth}
                        onChange={(e) => updatePermissions(index, "rotas", e)}/><label>Rotas</label></div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.holidays?.auth}
                        onChange={(e) => updatePermissions(index, "holidays", e)}/><label>Holidays</label></div>
        </div>
        <div className={style["permission-table"]}>
            <div className={style["permission-table-title"]}>Shop Tills Tabs</div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.shopTillsQuickLinks?.auth}
                        onChange={(e) => updatePermissions(index, "shopTillsQuickLinks", e)}/><label>Quick Links</label></div>
        </div>
        <div className={style["permission-table"]}>
            <div className={style["permission-table-title"]}>Reports Tabs</div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.salesReport?.auth}
                        onChange={(e) => updatePermissions(index, "salesReport", e)}/><label>Sales</label></div>
        </div>
        <div className={style["permission-table"]}>
            <div className={style["permission-table-title"]}>Edit permissions</div>
            <div><input type="checkbox" defaultChecked={user?.permissions?.holidaysEdit?.auth}
                        onChange={(e) => updatePermissions(index, "holidaysEdit", e)}/><label>Holiday Tab</label>
            </div>
        </div>

    </div>)
}