import Image from 'next/image'
import React, {useRef} from "react";
import {signIn} from 'next-auth/react'
import styles from './login.module.css'

export default function Index() {
    const user = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    async function handleSubmit(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        const details = {username:user.current!.value, password:password.current!.value}
        await signIn('credentials', details)
        window.location.href = "/"
    }

    return (
        <div id="main" className={styles.loginBackground}>
            <form id={styles["login-form"]} onSubmit={e=>handleSubmit(e)}>
                <Image src="/logo.png" width="300px" height="300px" alt="Logo"/>
                <div id={styles.message}/>
                <input type="text" ref={user} placeholder="Username..."/>
                <input type="password" ref={password} placeholder="Password..."/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}