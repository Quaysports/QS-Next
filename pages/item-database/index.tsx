import Menu from "../../components/menu/menu";
import ItemDatabaseTabs from "./tabs";
import ItemDatabaseLandingPage from "./item-database";
import {useRouter} from "next/router";
import SidebarOneColumn from "../../components/layouts/sidebar-one-column";
import SearchbarSidebarOneColumn from "../../components/layouts/searchbar-sidebar-one-column";
import {appWrapper} from "../../store/store";
import {
    setItem,
    setSuppliers,
    setTags,
} from "../../store/item-database/item-database-slice";
import {
    getAllSuppliers,
    getAllBrands,
    getItem,
    getItems,
    getLinkedItems,
    getTags,
} from "../../server-modules/items/items";
import NewItems from "./new-items";
import {
    setNewItemsBrands,
    setNewItemSuppliers,
    setNewItemAllTags,
    addNewItem,
} from "../../store/item-database/new-items-slice";
import NewItemsSideBar from "./new-items/new-items-sidebar";
import ToDo from "./to-do";
import {setToDoItems} from "../../store/item-database/to-do-slice";
import TodoSideBar from "./to-do/todo-side-bar";

export type rodLocationObject = {
    BRANDLABEL: { loc: string };
    IDBEP: { BRAND: string };
    SKU: string;
    TITLE: string;
};

/**
 * Item Database Landing Page
 */
export default function ItemDatabase() {
    const router = useRouter();
    return (
        <>
            {router.query.tab === undefined ||
            router.query.tab === "item-database" ?
                <>
                    <SearchbarSidebarOneColumn>
                        <Menu>
                            <ItemDatabaseTabs/>
                        </Menu>
                        <ItemDatabaseLandingPage/>
                    </SearchbarSidebarOneColumn>
                </> : null}
            {router.query.tab === "new-items" ?
                <>
                    <SidebarOneColumn>
                        <Menu>
                            <ItemDatabaseTabs/>
                        </Menu>
                        <NewItemsSideBar/>
                        <NewItems/>
                    </SidebarOneColumn>
                </>
                : null}
            {router.query.tab === "to-do" ? (
                <>
                    <SidebarOneColumn>
                        <Menu>
                            <ItemDatabaseTabs/>
                        </Menu>
                        <TodoSideBar/>
                        <ToDo/>
                    </SidebarOneColumn>
                </>
            ) : null}
        </>
    );
}

export const getServerSideProps = appWrapper.getServerSideProps(
    (store) => async (context) => {
        if (context.query.sku) {
            let sku = context.query.sku;
            let item = await getItem({SKU: sku});
            if (item) item.linkedSKUS = await getLinkedItems(sku as string);

            store.dispatch(setItem(item));
            let suppliers = await getAllSuppliers();
            store.dispatch(setSuppliers(suppliers));
        }
        if (context.query.tab === "new-items") {
            const suppliers = await getAllSuppliers();
            store.dispatch(setNewItemSuppliers(suppliers));
            let tags = await getTags();
            let sortedTags = tags ? tags : [];
            store.dispatch(setNewItemAllTags(sortedTags));
            if (context.query.supplier) {
                const brands: string[] = await getAllBrands({});
                store.dispatch(setNewItemsBrands(brands));
                store.dispatch(addNewItem(context.query.supplier as string));
            }
        }

        if (
            context.query.tab === "item-database" ||
            context.query.tab === undefined
        ) {
            let tags = await getTags();
            let sortedTags = tags ? tags : [];
            store.dispatch(setTags(sortedTags));
        }

        if (context.query.tab === "to-do") {
            let channelStatus

            switch (context.query.channel) {
                case "ebay":
                    if (context.query.status === "done") {
                        channelStatus = {"checkboxStatus.done.ebay": true};
                    }
                    if (context.query.status === "ready") {
                        channelStatus = {"checkboxStatus.ready.ebay": true};
                    }
                    break;
                case "amazon":
                    if (context.query.status === "done") {
                        channelStatus = {"checkboxStatus.done.amazon": true};
                    }
                    if (context.query.status === "ready") {
                        channelStatus = {"checkboxStatus.ready.amazon": true};
                    }
                    break;
                case "magento":
                    if (context.query.status === "done") {
                        channelStatus = {"checkboxStatus.done.magento": true};
                    }
                    if (context.query.status === "ready") {
                        channelStatus = {"checkboxStatus.ready.magento": true};
                    }
                    break;
                default: {
                }
                    break;
            }
            const query = {...channelStatus, tags: {$in: ["domestic"]}}
            let items = await getItems(query, {
                SKU: 1,
                title: 1,
                checkboxStatus: 1,
            });
            if (items) {
                store.dispatch(setToDoItems(items));
            }
        }
        return {props: {}}
    }
);
