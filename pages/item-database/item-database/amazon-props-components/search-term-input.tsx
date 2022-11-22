import styles from "../../item-database.module.css";

interface Props{
    index: number
}
export default function SearchTermInput({index}:Props) {
    return (
        <span className={styles["search-term"]}>
            <span>{index}:</span>
            <input/>
        </span>
    )
}