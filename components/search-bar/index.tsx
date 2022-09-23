import React, {Fragment, useState} from "react"

interface SearchBarProps {
    itemIndex: (x: any[]) => void,
    searchableArray: any[],
    EAN:boolean
}

export default function SearchBar({itemIndex, searchableArray, EAN}:SearchBarProps) {

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
                    <input id={"ean-radio"} name={"search-radio"} onChange={(e) => {
                        searchTypeHandler(e.target.checked, "EAN")
                    }}/>
                </Fragment>
            )
        }
    }

    function searchArray(value) {
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
                if (searchableArray[i].TITLE.toUpperCase().startsWith(value.toUpperCase())) {
                    startsWith.push(searchableArray[i])
                    continue;
                }
                if (searchableArray[i].TITLE.toUpperCase().includes(value.toUpperCase())) {
                    contains.push(searchableArray[i])
                }
            }
            if (searchType === "EAN") {
                if (searchableArray[i].EAN.toUpperCase().startsWith(value.toUpperCase())) {
                    startsWith.push(searchableArray[i])
                    continue;
                }
                if (searchableArray[i].EAN.toUpperCase().includes(value.toUpperCase())) {
                    contains.push(searchableArray[i])
                }
            }
        }
        itemIndex([...startsWith, ...contains])
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