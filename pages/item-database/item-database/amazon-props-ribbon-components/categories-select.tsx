import {AmzCats, AmzCatsType} from "../../../../server-modules/amazon-categories/amazon-categories";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemAmazonCategories} from "../../../../store/item-database/item-database-slice";

interface Props {
    id: number
}

export default function CategoriesSelect({id}: Props) {

    const [categories] = useState<AmzCatsType[]>(AmzCats)
    const [currentCategory, setCurrentCategory] = useState<string>("")
    const [rerender, setRerender] = useState<boolean>(false)
    const dispatch = useDispatch()
    const item = useSelector(selectItem)

    useEffect(() => {
        for (const category of categories) {
            if(item.mappedExtendedProperties["category" + id as keyof schema.MappedExtendedProperties] === category.CATID && currentCategory != category.CATNAME) {
                setCurrentCategory(category.CATNAME)
            }
        }
    }, [rerender])

    function amazonCategories() {
        let amazonCategoryArray = []
        for (const category of categories) {
            amazonCategoryArray.push(
                <option value={category.CATID} key={category.CATID}>{category.CATNAME}</option>
            )
        }
        return amazonCategoryArray
    }

    function amazonCategoriesHandler(categoryID: string, id: number) {
        setRerender(!rerender)
        dispatch(setItemAmazonCategories({categoryID: categoryID, id: id}))
    }

    return (
        <>
            <span>{id}:</span>
            <select key={"category-select "+ id} onChange={(e) => {
                amazonCategoriesHandler(e.target.value, id)
            }}
            defaultValue={item.mappedExtendedProperties["category" + id as keyof schema.MappedExtendedProperties] ?
                item.mappedExtendedProperties["category" + id as keyof schema.MappedExtendedProperties] : ""}
            >{amazonCategories()}</select>
        </>
    )
}