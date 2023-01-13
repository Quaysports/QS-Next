import styles from "../../item-database.module.css"
import {DragEvent, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import {selectItem, setItemImages} from "../../../../store/item-database/item-database-slice";

interface Props {
    imageTag: string;
}

export default function ImageContainer({imageTag}: Props) {

    const item = useSelector(selectItem)
    const [image, setImage] = useState<string | undefined>(undefined)
    const dispatch = useDispatch()
    const key: keyof schema.Images = imageTag === "Main" ? "main" : "image" + imageTag as keyof schema.Images

    function dragOverHandler(event: DragEvent<HTMLDivElement>) {
        event.stopPropagation()
        event.preventDefault()
        event.currentTarget.style.boxShadow = "var(--primary-box-shadow)"
        event.currentTarget.style.transform = "scale(1.04)"
        event.currentTarget.style.background = "var(--primary-color)"
    }

    function onDropHandler(event: DragEvent<HTMLDivElement>, index: string) {
        event.stopPropagation()
        event.preventDefault()
        let image = event.dataTransfer.files[0]
        if (image.size > 1000000) {
            dispatchNotification({type: "alert", content: "Resize image", title: "Image Too Big"})
        } else {
            event.currentTarget.style.boxShadow = ""
            event.currentTarget.style.transform = "scale(1)"
            event.currentTarget.style.background = "white"
            let imageExtension = image.name.split(".")[1]
            if (image.type === "image/jpeg" || image.type === "image/png") {
                const fileReader = new FileReader()
                fileReader.onload = (event) => {
                    setImage(event.target?.result?.toString())
                    dispatch(setItemImages({
                        image: event.target!.result!.toString(),
                        index: index as keyof schema.Images,
                        extension: imageExtension
                    }))
                }
                fileReader.readAsDataURL(image)
            } else {
                dispatchNotification({type: "alert", content: "Incorrect image type", title: "Wrong Extension"})
            }
        }
    }

    function dragLeaveHandler(event: DragEvent<HTMLDivElement>) {
        event.stopPropagation()
        event.preventDefault()
        event.currentTarget.style.boxShadow = ""
        event.currentTarget.style.transform = "scale(1)"
        event.currentTarget.style.background = ""
    }

    function imageSourceHandler(item: schema.Item, imageTag:string, image: string | undefined, key:keyof schema.Images) {

        if (!item.images) return image

        return item.images[key] ?
            item.images[key].link
                ? `http://192.168.1.200:4000/images/${item.images[key].link!.replace(/([ \/])+/g, "-")}/${item.images[key].filename}`
                : `http://192.168.1.200:4000/images/${item.SKU.replace(/([ \/])+/g, "-")}/${item.images[key].filename}`
            : image
    }

    function deleteImageHandler(key:keyof schema.Images, item:schema.Item) {
        const opts = {
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({id:key, item:item})
        }
        fetch('api/item-database/delete-image', opts)
            .then((res) =>  console.log(res))
        setImage(undefined)
    }

    return (
        <div
            onDragLeave={(e) => {
                dragLeaveHandler(e)
            }}
            onDragOver={(e) => dragOverHandler(e)}
            onDrop={(e) => onDropHandler(e, imageTag)}
            className={`${styles["image-drop-box"]} ${image ? styles["image-dropped"] : ""}`}
        >
            {item.images[key]?.filename ? <div className={`${styles["image-delete-button"]} button`} onClick={() => {deleteImageHandler(key, item)}}>X</div> : null}
            <img src={imageSourceHandler(item, imageTag, image, key)} alt={"Image " + imageTag}></img>
        </div>
    )
}