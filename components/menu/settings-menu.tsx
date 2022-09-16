import {useDispatch} from "react-redux";
import {setShowPopup} from "../../store/components/popup-slice";
import CustomisationPopup from "./customisation-popup";

export default function SettingsMenu({showSettingsMenu, settingsMenuHandler, notificationContent}) {

    const dispatch = useDispatch()

    if (showSettingsMenu) {
        return (
            <div key={25} id="settings-menu">
                <div onClick={()=>{
                    notificationContent({type:"popup", title:"Customisation Popup", content:<CustomisationPopup/>, show:true})
                    dispatch(setShowPopup(true))
                    settingsMenuHandler()
                }}>Customisation</div>
            </div>
        )
    }
}