import React, {Fragment, useState} from "react"

/**
 * @property {string} SKU - Item sku for use in search
 * @property {string} TITLE - Item title for use in search
 * @property {string} [EAN] - Optional EAN for use in search
 */
export interface SearchItem {
    SKU: string;
    title: string;
    EAN?: string;
}

/**
 * @param {resultHandler} resultHandler - Handles returned {@link SearchItem} array.
 * @param {SearchItem[]} searchableArray - Array of searchable items.
 * @param {boolean} EAN - Toggle to enable EAN search radio button.
 */
interface Props {
    resultHandler: (results: SearchItem[]) => void,
    searchableArray: SearchItem[],
    EAN:boolean
}

/**
 * Search bar component that takes an array of {@link SearchItem}
 */
export default function SearchBar({resultHandler, searchableArray, EAN}:Props) {

    const [searchType, setSearchType] = useState<string>("SKU")

    function searchTypeHandler(checked: boolean, type: string) {
        if (type === "EAN" && checked) setSearchType("EAN")
        if (type === "SKU" && checked) setSearchType("SKU")
        if (type === "Title" && checked) setSearchType("Title")
    }

    function optionalButtons() {
        if (EAN) {
            return (
                <Fragment key={1}>
                    <label htmlFor={"ean-radio"}>EAN</label>
                    <input type="radio" id={"ean-radio"} name={"search-radio"} onChange={(e) => {
                        searchTypeHandler(e.target.checked, "EAN")
                    }}/>
                </Fragment>
            )
        }
    }

    function searchArray(value:string) {
        if(!value || value === "") resultHandler(searchableArray);
        if(value.length < 2) return;
        let startsWith = []
        let contains = []
        for (let i = 0; i < searchableArray.length; i++) {
            if (searchType === "SKU") {
                if (searchableArray[i].SKU.toUpperCase().startsWith(value.toUpperCase())) {
                    startsWith.push(searchableArray[i])
                    continue;
                }
                if (searchableArray[i].SKU.toUpperCase().includes(value.toUpperCase())) {
                    contains.push(searchableArray[i])
                }
            }
            if (searchType === "Title") {
                if (searchableArray[i].title.toUpperCase().startsWith(value.toUpperCase())) {
                    startsWith.push(searchableArray[i])
                    continue;
                }
                if (searchableArray[i].title.toUpperCase().includes(value.toUpperCase())) {
                    contains.push(searchableArray[i])
                }
            }
            if (searchType === "EAN") {
                if (searchableArray[i].EAN?.toUpperCase().startsWith(value.toUpperCase())) {
                    startsWith.push(searchableArray[i])
                    continue;
                }
                if (searchableArray[i].EAN?.toUpperCase().includes(value.toUpperCase())) {
                    contains.push(searchableArray[i])
                }
            }
        }
        resultHandler([...startsWith, ...contains])
    }

    return (
        <div id="search-bar">
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
                onChange={e => searchTypeHandler(e.target.checked, "Title")}
            />
            {optionalButtons()}
            <input
                id="search-bar-input"
                list="search-options"
                onChange={e => searchArray(e.target.value)}
            />
        </div>
    )
}