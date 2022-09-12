import Image from 'next/image'
import styles from './login.module.css'

export default function Index() {

    const formHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const opts = {
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        }
        let res = await fetch('/api/login', opts)
        console.log(await res.json())
    }

    return (
        <div id="main" className={styles.loginBackground}>
            <form id={styles["login-form"]} onSubmit={formHandler}>
                <Image src="/logo.png" width="300px" height="300px" alt="Logo"/>
                <div id={styles.message}/>
                <input type="text" id="username" name="username" placeholder="Username..."/>
                <input type="password" id="password" name="password" placeholder="Password..."/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}