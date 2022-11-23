import {AmzCats, AmzCatsType} from "../../../../server-modules/amazon-categories/amazon-categories";
import {useState} from "react";
import {useDispatch} from "react-redux";
import {setItemAmazonCategories} from "../../../../store/item-database/item-database-slice";

interface Props {
    id: number
}

export default function CategoriesSelect({id}: Props) {

    const [categories] = useState<AmzCatsType[]>(AmzCats)
    const dispatch = useDispatch()

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
        dispatch(setItemAmazonCategories({categoryID: categoryID, id: id}))
    }

    return (
        <>
            <span>{id}:</span>
            <select onChange={(e) => {
                amazonCategoriesHandler(e.target.value, id)
            }}>{amazonCategories()}</select>
        </>
    )
}