import styles from './layout-styles.module.css'

export default function OneColumn({children}){
    return(
        <div className={styles["one-column"]}>{children}</div>
    )
}