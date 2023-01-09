import DatabaseSearchBar, {DatabaseSearchItem} from "../../../../components/database-search-bar/database-search";
import {useState} from "react";
import styles from "../../item-database.module.css"
import {useDispatch} from "react-redux";
import {setItemImportDetails} from "../../../../store/item-database/item-database-slice";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";

export default function ImportDetailsPopUp() {

    const dispatch = useDispatch()
    const [importItem, setImportItem] = useState<schema.Item | null>(null)
    const [copiedProperties, setCopiedProperties] = useState<{ [key: string]: any }>({mappedExtendedProperties:{}})


    const searchOptions = (searchItem: DatabaseSearchItem) => {
        const opts = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchItem.SKU)
        }
        fetch("api/items/get-item", opts)
            .then(res => res.json())
            .then(res => {
                setImportItem(res)
            })
    }

    const checkboxHandler = (item: schema.Item, checked: boolean, key: string, mappedExtendedProperties: boolean) => {
        let copiedPropertiesCopy = {...copiedProperties}
        mappedExtendedProperties ?
            checked ? copiedPropertiesCopy.mappedExtendedProperties[key] = item.mappedExtendedProperties[key as keyof schema.MappedExtendedProperties]
                : delete copiedPropertiesCopy.mappedExtendedProperties[key]
            :
            checked ? copiedPropertiesCopy[key] = item[key as keyof schema.Item]
                : delete copiedPropertiesCopy[key]
        setCopiedProperties(copiedPropertiesCopy)
        console.log(copiedProperties)
    }

    const importHandler = (copiedProperties: { [key: string]: any }) => {
        dispatch(setItemImportDetails(copiedProperties))
        dispatchNotification()
    }
    const importDetailsSelection = (importItem: schema.Item) => {
        let tempArray = []
        let values = Object.values(importItem.mappedExtendedProperties)
        let keys = Object.keys(importItem.mappedExtendedProperties)
        for (let i = 0; i < keys.length; i++) {
            tempArray.push(
                <div key={keys[i]} className={styles["import-details-table-row"]}>
                    <div className={styles["import-details-checkbox"]}>
                        <input type={"checkbox"}
                               className={styles["import-details-checkbox"]}
                               onChange={(e) => checkboxHandler(importItem, e.target.checked, keys[i], true)}/>
                    </div>
                    <div className={styles["import-details-keys"]}>{keys[i].charAt(0).toUpperCase() + keys[i].slice(1)}</div>
                    <div className={styles["import-details-values"]}>{values[i]}</div>
                </div>)
        }

        return (
            <div className={styles["import-details-wrapper"]}>
                <div className={styles["import-details-container"]}>
                    {tempArray}
                    {importItem.shortDescription ?
                        <div className={styles["import-details-table-row"]}>
                            <div className={styles["import-details-checkbox"]}>
                                <input type={"checkbox"}
                                       className={styles["import-details-checkbox"]}
                                       onChange={(e) => checkboxHandler(importItem, e.target.checked, "shortDescription", false)}/>
                            </div>
                            <div className={styles["import-details-keys"]}>Short Description</div>
                            <div className={styles["import-details-description"]}
                                 dangerouslySetInnerHTML={{__html: importItem.shortDescription}}></div>
                        </div> : null}
                    {importItem.description ?
                        <div className={styles["import-details-table-row"]}>
                            <div className={styles["import-details-checkbox"]}>
                                <input type={"checkbox"}
                                       onChange={(e) => checkboxHandler(importItem, e.target.checked, "description", false)}/>
                            </div>
                            <div className={styles["import-details-keys"]}>Long Description</div>
                            <div className={styles["import-details-description"]}
                                 dangerouslySetInnerHTML={{__html: importItem.description}}></div>
                        </div> : null}

                    <div className={styles["import-details-button-container"]}>
                    <div className={`${styles['import-details-button']} button`}
                          onClick={() => importHandler(copiedProperties)}>Import</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {!importItem ?
                <DatabaseSearchBar handler={(x) => searchOptions(x)}/> :
                importDetailsSelection(importItem)}
        </>
    )
}