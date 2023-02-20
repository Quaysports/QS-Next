import {dispatchNotification} from "../notification/dispatch-notification";
import {schema} from "../../types";

export default function uploadToLinnworksHandler(item: schema.Item) {
    const opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    }
    dispatchNotification({type: "loading", content: "Uploading to Linnworks, please wait"})
    fetch("/api/item-database/update-linnworks", opts)
        .then(res => res.json())
        .then(() => {
            global.window.location.reload()
        })
}