import React, {useEffect, useState} from "react"
import styles from './database-search-bar.module.css'

/**
 * @property {handler} handler - Function passed in to receive search result for further processing.
 */
interface Props {
    handler: (result: DatabaseSearchItem) => void
}

/**
 * Search Item object used in searchArray
 * @property {string} _id this is a test
 * @property {string} SKU - SKU search values
 * @property {string} TITLE - Title search values
 * @property {string} [more] - more items element flag
 *
 */
export interface DatabaseSearchItem {
    _id: string
    SKU: string
    TITLE: string
    more?: string
}

/**
 * Search bar with radio buttons that performs direct database searches (rather than taking in an array).
 */
export default function DatabaseSearchBar({handler}: Props) {

    const [searchType, setSearchType] = useState<string>("SKU")
    const [currentSearchValue, setCurrentSearchValue] = useState<string>("")
    const [searchResults, setSearchResults] = useState<DatabaseSearchItem[]>([])
    const [triggerUpdate, setTriggerUpdate] = useState<boolean>(false)

    useEffect(() => {
        if (currentSearchValue.length > 1) {
            const opts = {
                method: "POST",
                body: JSON.stringify({type: searchType, id: currentSearchValue})
            }
            fetch("/api/items/search", opts).then(res => {
                res.json().then(json => {
                    setSearchResults(searchArray(currentSearchValue, json))
                })
            })
        } else {
            setSearchResults([])
        }
    }, [searchType, currentSearchValue, triggerUpdate])

    function searchTypeHandler(checked: boolean, type: string) {
        if (type === "SKU" && checked) setSearchType("SKU")
        if (type === "TITLE" && checked) setSearchType("TITLE")
    }

    function searchArray(value: string, searchResults: DatabaseSearchItem[]) {
        let startsWith: DatabaseSearchItem[] = []
        let contains: DatabaseSearchItem[] = []
        for (let i = 0; i < searchResults.length; i++) {
            if (searchType === "SKU") {
                if (searchResults[i].SKU.toUpperCase().startsWith(value.toUpperCase())) {
                    startsWith.push(searchResults[i])
                } else {
                    contains.push(searchResults[i])
                }
            }
            if (searchType === "TITLE") {
                if (searchResults[i].TITLE.toUpperCase().startsWith(value.toUpperCase())) {
                    startsWith.push(searchResults[i])
                } else {
                    contains.push(searchResults[i])
                }
            }
        }
        let returnArr = [...startsWith, ...contains]
        let length = returnArr.length
        if (length > 10) {
            returnArr = [...startsWith, ...contains].slice(0, 10)
            returnArr.push({_id: "", SKU: "", TITLE: "", more: `...${length - 10} more results`})
        }
        return (returnArr)
    }

    function buildList() {
        let items = []
        for (const item of searchResults) {
            if (item.more) {
                items.push(<div key={"more"}>{item.more}</div>)
                continue
            }

            items.push(<div key={item.SKU} onClick={() => {
                handler(item)
                setSearchResults([])
            }}>
                {searchType === "SKU"
                    ? <>
                        <div>{item.SKU}</div>
                        <div className={styles["secondary-info"]}>{item.TITLE}</div>
                    </>
                    : <>
                        <div>{item.TITLE}</div>
                        <div className={styles["secondary-info"]}>{item.SKU}</div>
                    </>
                }
            </div>)
        }
        return items
    }

    return (
        <div className={styles["search-bar"]}>
            <label htmlFor={"sku-radio"}>SKU</label>
            <input
                type="radio"
                name="search-radio"
                id={"sku-radio"}
                defaultChecked={true}
                onChange={e => searchTypeHandler(e.target.checked, "SKU")}
            />
            <label htmlFor={"title-radio"}>Title</label>
            <input
                type="radio"
                name="search-radio"
                id={"title-radio"}
                onChange={e => searchTypeHandler(e.target.checked, "TITLE")}
            />
            <input
                className={styles["search-bar-input"]}
                data-testid="search-input"
                onFocus={() => {
                    setTriggerUpdate(!triggerUpdate)
                }}
                onChange={e => setCurrentSearchValue(e.target.value)}
            />
            <div
                className={searchResults.length > 0 ? styles["search-results"] : styles["hide-list"]}>{buildList()}</div>
        </div>
    )
}