import styles from "../../item-database.module.css"
type Props = {
    deleteRow: () => void
}
export default function DeleteButton({deleteRow}:Props){

    function deleteHandler() {
        deleteRow()
    }

    return <button className={styles['delete-button']} onClick={() => deleteHandler()}>X</button>
}