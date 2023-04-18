import {
    selectItems,
    selectSearchedTodoItem,
    selectThreshold, setSearchTodoItems,
    setThreshold, toDoSlice
} from "../../../store/item-database/to-do-slice";
import {useDispatch, useSelector} from "react-redux";
import styles from "./todo.module.css";
import ColumnLayout from "../../../components/layouts/column-layout";
import {schema} from "../../../types";
import {useRouter} from "next/router";

export default function ToDo() {
    const items = useSelector(selectItems);
    const threshold = useSelector(selectThreshold);
    const dispatch = useDispatch()
    const searchedTodoItems = useSelector(selectSearchedTodoItem)

    if (!items) return null;

    const renderItemsHandler = (items: Pick<schema.Item, "SKU" | "title" | "checkboxStatus">[], threshold: number) => {
        const tempItems = []
        for (let i = 0; i < threshold; i++) {
            if (i === items.length) break;
            tempItems.push(<TodoRow SKU={items[i].SKU} title={items[i].title}
                                    checkboxStatus={items[i].checkboxStatus} key={items[i].SKU}/>)
        }
        return tempItems
    }
    return (
        <ColumnLayout scroll={true}>
            {/*<div>{elements}</div>*/}
            <div><TitleRow keyName={"title"}/></div>
            {searchedTodoItems.length !== 0
                ? searchedTodoItems.map(searchedTodoItem => {
                    return <TodoRow SKU={searchedTodoItem.SKU} title={searchedTodoItem.title} checkboxStatus={searchedTodoItem.checkboxStatus} key={searchedTodoItem.SKU}/>
                })
                : renderItemsHandler(items, threshold)}

            <div className={styles["button-container"]}>
                {threshold < items.length && searchedTodoItems.length === 0 ?
                    <button onClick={() => dispatch(setThreshold((threshold + 50)))}>Load More Items</button> : null}
            </div>
        </ColumnLayout>
    );
}

// const elements = [<TitleRow keyName={"title"}/>];

function TitleRow({keyName}: { keyName: string }) {
    return (
        <div key={keyName} className={styles["todo-title"]}>
            <div>SKU</div>
            <div>Title</div>
        </div>
    );
}

function TodoRow(item: Pick<schema.Item, "SKU" | "title" | "checkboxStatus">) {
    const router = useRouter()
    const SKULinkHandler = (sku: string) => {
        router.push({pathname: router.pathname, query: {tab: "item-database", sku: sku}})
    }

    return (
        <div key={item.SKU} className={styles["todo-row"]}>
            <span>{item.SKU}</span>
            <span>{item.title}</span>
            <button onClick={() => SKULinkHandler(item.SKU)}>Go to item</button>
        </div>
    )
}