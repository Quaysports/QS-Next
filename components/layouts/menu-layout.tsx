import styles from './layout-styles.module.css'

export default function MenuLayout({children}){
    return(
        <div className={styles["menu-layout"]}>{children}</div>
    )
}