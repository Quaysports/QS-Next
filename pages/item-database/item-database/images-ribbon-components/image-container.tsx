import styles from "../../item-database.module.css"
import {DragEvent} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {dispatchNotification} from "../../../../components/notification/dispatch-notification";
import {selectItem, setItem, setItemImages} from "../../../../store/item-database/item-database-slice";
import {dispatchToast} from "../../../../components/toast/dispatch-toast";
import {schema} from "../../../../types";

interface Props {
    imageTag: string;
}

export default function ImageContainer({imageTag}: Props) {

    const item = useSelector(selectItem)
    const dispatch = useDispatch()
    const key: keyof schema.Images = imageTag === "Main" ? "main" : "image" + imageTag as keyof schema.Images

    function dragOverHandler(event: DragEvent<HTMLDivElement>) {
        event.stopPropagation()
        event.preventDefault()
        event.currentTarget.style.boxShadow = "var(--primary-box-shadow)"
        event.currentTarget.style.transform = "scale(1.04)"
        event.currentTarget.style.background = "var(--primary-color)"
    }

    function newImageDropHandler(event: DragEvent<HTMLDivElement>, index: keyof schema.Images) {
        event.stopPropagation()
        event.preventDefault()
        let image = event.dataTransfer.files[0]
        event.currentTarget.style.boxShadow = ""
        event.currentTarget.style.transform = "scale(1)"

        if (image.size > 4500000) {
            event.currentTarget.style.background = ""
            dispatchNotification({type: "alert", content: "Resize image", title: "Image Too Big"})
            return
        }

        event.currentTarget.style.background = "white"
        let imageExtension = image.name.split(".")[1]
        if (image.type === "image/jpeg" || image.type === "image/png") {
            const fileReader = new FileReader()
            fileReader.onload = (event) => {
                let filename = `${index === "main" ? "0" : index}.${imageExtension}`
                let body = {
                    _id: item._id,
                    SKU: item.SKU,
                    id: index === "main" ? "main" : index,
                    filename: filename,
                    image: event.target!.result!.toString()
                }
                const opts = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: 'POST',
                    body: JSON.stringify(body)
                }
                fetch("api/item-database/upload-image", opts).then(res => {
                    if (res.ok) {
                        dispatch(setItemImages({
                            index: index,
                            filename: filename
                        }))
                    } else {
                        throw new Error(`Status: ${res.status}, ${res.statusText}`)
                    }
                })
                    .catch((error) => {
                        dispatchNotification({type: "alert", content: error.message, title: "Upload Failed"})
                    })

            }
            fileReader.readAsDataURL(image)
        } else {
            dispatchNotification({type: "alert", content: "Incorrect image type", title: "Wrong Extension"})
        }

    }

    function dragLeaveHandler(event: DragEvent<HTMLDivElement>) {
        event.stopPropagation()
        event.preventDefault()
        event.currentTarget.style.boxShadow = ""
        event.currentTarget.style.transform = "scale(1)"
        event.currentTarget.style.background = ""
    }

    function oldImageDropHandler(event: DragEvent<HTMLDivElement>) {
        event.stopPropagation()
        event.preventDefault()
        event.currentTarget.style.boxShadow = ""
        event.currentTarget.style.transform = "scale(1)"
        event.currentTarget.style.background = ""
        dispatchToast({content: "Delete old image first before dropping a new one",})
    }

    function imageSourceHandler(item: schema.Item, imageTag: string, key: keyof schema.Images) {

        return item.images[key].link
            ? `http://192.168.1.200:4000/images/${item.images[key].link!.replace(/([ \/])+/g, "-")}/${item.images[key].filename}`
            : `http://192.168.1.200:4000/images/${item.SKU.replace(/([ \/])+/g, "-")}/${item.images[key].filename}`
    }

    function deleteImageHandler(key: keyof schema.Images, item: schema.Item) {
        const opts = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: key, item: item})
        }
        fetch('api/item-database/delete-image', opts)
            .then((res) => res.json())
            .then((res) => {
                if (res != 400) {
                    dispatch(setItem(res))
                    dispatchToast({content: "Image deleted"})
                } else {
                    dispatchToast({content: "Image deletion failed"})
                }
                console.log(res)
            })
    }

    return item.images[key]?.filename
        ? <div className={`${styles["image-drop-box"]} ${styles["image-dropped"]}`}
               onDragLeave={(e) => {
                   dragLeaveHandler(e)
               }}
               onDragOver={(e) => dragOverHandler(e)}
               onDrop={(e) => oldImageDropHandler(e)}>
            <div className={`${styles["image-delete-button"]} button`}
                 onClick={() => {
                     deleteImageHandler(key, item)
                 }}>
                X
            </div>
            <img src={imageSourceHandler(item, imageTag, key)} alt={"Image " + imageTag}/>
        </div>
        : <div className={`${styles["image-drop-box"]}`}
               style={{background: "unset"}}
               onDragLeave={(e) => {
                   dragLeaveHandler(e)
               }}
               onDragOver={(e) => dragOverHandler(e)}
               onDrop={(e) => newImageDropHandler(e, key)}>
            {"Image " + imageTag}
        </div>
}