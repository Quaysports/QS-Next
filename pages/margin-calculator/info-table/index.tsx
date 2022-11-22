import styles from "../margin-calculator.module.css";
import {selectRenderedItems} from "../../../store/margin-calculator-slice";
import {useDispatch, useSelector} from "react-redux";
import TitleRow from "./title-row";
import ItemRow from "./item-row";
import TitleLink from "../title-link";
import {selectMarginSettings, updateMarginSetting} from "../../../store/session-slice";

export default function InfoTable(){

    const items = useSelector(selectRenderedItems)
    const settings = useSelector(selectMarginSettings)
    const dispatch = useDispatch()

    if(!items || items.length === 0) return null

    if(!settings?.tables.InfoTable) return null

    function createTable(){
        const elements = [
            <div key={"header"} className={styles.header}>
                <TitleLink type={"Info"}/>
                <div className={styles["info-title-checkbox"]}>
                    Titles:<input type={"checkbox"}
                                  checked={settings?.displayTitles}
                                  onChange={(e)=>{
                                      let newSettings = structuredClone(settings!)
                                      newSettings.displayTitles = e.target.checked
                                      dispatch(updateMarginSetting(newSettings))
                                  }}/></div>
            </div>,
            <TitleRow key={"title-row"}/>
        ]

        for(let index in items) elements.push(<ItemRow
            key={items[index].SKU}
            item={items[index]}
            index={index}/>)

        return elements
    }

    return <div className={styles["sub-table"]}>
        {createTable()}
    </div>
}