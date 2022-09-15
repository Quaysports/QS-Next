import {useDispatch} from "react-redux";
import {setShowPopup} from "../../store/popup-slice";
import CustomisationPopup from "./customisation-popup";

export default function SettingsMenu({showSettingsMenu, settingsMenuHandler, popupContent}) {

    const dispatch = useDispatch()

    if (showSettingsMenu) {
        return (
            <div key={25} id="settings-menu">
                <div onClick={()=>{
                    popupContent({title:"Customisation Popup", content:<CustomisationPopup/>})
                    dispatch(setShowPopup(true))
                    settingsMenuHandler()
                }}>Customisation</div>
            </div>
        )
    }
}