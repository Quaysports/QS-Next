import {useDispatch, useSelector} from "react-redux";
import {selectItem, setItemBrandLabel} from "../../../../store/item-database/item-database-slice";
import {useEffect, useState} from "react";
import styles from '../../item-database.module.css'

interface Props {
    print: (x: string, item:schema.Item) => void
}

export default function BrandLabelPopUp({print}: Props) {

    const dispatch = useDispatch()
    const [images, setImages] = useState<string[]>([])
    const item = useSelector(selectItem)
    const [title1CharacterCount, setTitle1CharacterCount] = useState<number>(0)
    const [title2CharacterCount, setTitle2CharacterCount] = useState<number>(0)

    useEffect(() => {
        let {title1, title2} = item.brandLabel

        if(images.length < 1) {
            const opts = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }
            fetch("/api/item-database/get-branded-label-images", opts)
                .then(res => res.json())
                .then(res => setImages(res))
        }
        if(title1 || title1 === "") setTitle1CharacterCount(title1.length)
        if(title2 || title2 === "") setTitle2CharacterCount(title2.length)
    }, [item])

    function brandImageOptions() {
        const brandImageOptions: JSX.Element[] = [<option key={"empty"}></option>]
        for (const image of images) {
            brandImageOptions.push(<option key={image} value={image}>{image}</option>)
        }
        return brandImageOptions
    }

    const {title1, title2, path} = item.brandLabel
    const {prefix, letter, number} = item.shelfLocation

    return (
        <div className={styles["brand-label-container"]}>
            <div className={styles["brand-label-image"]}>
                <img src={path ? path : ""} alt={item.brand + "image"}/>
                <select
                    onChange={(e) => {
                        let update = {...item.brandLabel,
                            path:"http://192.168.1.200:4000/brand-label-images/" + e.target.value,
                            image:e.target.value
                        }
                        dispatch(setItemBrandLabel(update))
                    }
                }>{brandImageOptions()}</select>
            </div>
            <div className={styles["brand-label-info"]}>
                <div className={styles["brand-label-titles"]}>
                    <div>Brand:</div>
                    <div>Title Row 1:</div>
                    <div>Title Row 2:</div>
                    <div>Location:</div>
                </div>
                <div className={styles["brand-label-inputs"]}>
                    <div>{item.brand}</div>
                    <div className={styles["brand-label-character-count"]}>
                        <input value={title1}
                               onChange={(e) => {
                                   let update = {...item.brandLabel, title1:e.target.value}
                                   dispatch(setItemBrandLabel(update))
                               }}/>
                        <div>{title1CharacterCount}/12</div>
                    </div>
                    <div className={styles["brand-label-character-count"]}>
                        <input value={title2}
                               onChange={(e) => {
                                   let update = {...item.brandLabel, title2:e.target.value}
                                   dispatch(setItemBrandLabel(update))
                               }}/>
                        <div>{title2CharacterCount}/12</div>
                    </div>
                    <div>{item.shelfLocation ? `${prefix}-${letter}-${number}` : ""}</div>

                </div>
                <div className={`${styles["brand-label-print-button"]} button`}
                     onClick={() => print("branded-label", item)}>Print
                </div>
            </div>
        </div>
    )
}