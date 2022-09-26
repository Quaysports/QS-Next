import React, {useEffect, useState} from "react"

export interface searchResult {
    _id:string,SKU:"string",TITLE:"string"
}

export default function DatabaseSearchBar({handler}:{handler:(x:searchResult[])=>void}) {

    const [searchType, setSearchType] = useState<string>("SKU")
    const [currentSearchValue, setCurrentSearchValue] = useState("")

    useEffect(()=>{
        if(currentSearchValue.length > 1) {
            const opts = {
                method: "POST",
                body: JSON.stringify({type: searchType, id: currentSearchValue})
            }
            fetch("/api/items/search",opts).then(res=>{
                res.json().then(json=>
                    handler(searchArray(currentSearchValue, json))
                )
            })
        }
    },[searchType, currentSearchValue])

    function searchTypeHandler(checked: boolean, type: string) {
        if (type === "SKU" && checked) setSearchType("SKU")
        if (type === "TITLE" && checked) setSearchType("TITLE")
    }

    function searchArray(value:string, searchResults:searchResult[]) {
        let startsWith:searchResult[] = []
        let contains:searchResult[] = []
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
        return([...startsWith, ...contains])
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
                onChange={e => searchTypeHandler(e.target.checked, "TITLE")}
            />
            <input
                id="search-bar-input"
                list="search-options"
                onChange={e => setCurrentSearchValue(e.target.value)}
            />
        </div>
    )
}