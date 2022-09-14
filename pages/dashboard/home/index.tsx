import {useDispatch} from "react-redux";
import {setShowConfirm} from "../../../store/confirm-slice";
import Confirm from "../../../components/confirm";
import Alert from "../../../components/alert";
import {setShowAlert} from "../../../store/alert-slice";

export default function HomeLandingPage(){
    const dispatch = useDispatch()

    function test(){
        console.log('boo')
    }

    return(<div>
        {Confirm('User Permissions', 'text goes here fgdfgfdgdfgd dgdgdfgd dfhhdfhdgd dgdfgdg dgdfgdg dgdfg',test)}
        {Alert('User Permissions', 'text goes here fgdfgfdgdfgd dgdgdfgd dfhhdfhdgd dgdfgdg dgdfgdg dgdfg')}
        <button onClick={()=> dispatch(setShowConfirm(true))}>Test</button>
        <button onClick={()=> dispatch(setShowAlert(true))}>Test2</button>
    </div>)
}