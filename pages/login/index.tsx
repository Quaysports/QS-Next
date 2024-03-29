import Image from "next/image";
import React, {ChangeEvent, FocusEvent, useEffect, useState} from "react";
import {signIn} from 'next-auth/react'
import styles from './login.module.css'
import {useRouter} from "next/router";
import Link from "next/link";

/**
 * Login landing page with function to intercept form, pass details to next-auth and reload page on auth.
 */
export default function LoginLandingPage() {

    const [local, setLocal] = useState<boolean>(false)
    const [message, setMessage] = useState<string | undefined>(undefined)
    const router = useRouter()

    useEffect(() => {
        const origin = window.location.origin
        setLocal(origin.indexOf("localhost") !== -1 || origin.indexOf("192.168.1.200") !== -1)
    })

    const reset = (event?: FocusEvent<HTMLInputElement>) => {
        if (event) event.target.value = ""
        setMessage(undefined)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const details = {
            username: (document.getElementById("user") as HTMLInputElement)?.value,
            password: (document.getElementById("password") as HTMLInputElement)?.value,
            redirect: false
        }
        let result = await signIn('credentials', details)
        if (result?.ok) {
            window.location.href = router.query.redirect as string || "/"
        } else {
            setMessage("Incorrect username or password!")
        }
    }

    async function handlePin(pin: string) {
        const details = {pin: pin, redirect: false}
        let result = await signIn('credentials', details)
        if (result?.ok) {
            window.location.href = router.query.redirect as string || "/"
        } else {
            setMessage("Incorrect PIN!")
        }
    }

    const pinHandler = (event: ChangeEvent<HTMLInputElement>) => {
        let pinValidation = new RegExp("^[0-9]{4}$")
        let numberValidation = new RegExp("^[0-9]+$")

        const validateInput = (e: HTMLInputElement, valid: boolean, errorMessage: string) => {
            if (!valid) {
                e.style.borderColor = "var(--secondary-color)"
                e.setCustomValidity(errorMessage)
                e.reportValidity()
            } else {
                e.style.borderColor = "";
                e.setCustomValidity("")
            }
        }

        if (pinValidation.test(event.target.value) && event.target.value.length === 4) {
            validateInput(event.target, true, "")
            handlePin(event.target.value)
        } else {
            if (!numberValidation.test(event.target.value)) {
                validateInput(event.target, false, "Numbers only!")
            } else {
                validateInput(event.target, true, "")
            }
        }
    }

    return (
        <div>
            <form className={styles["login-form"]} onSubmit={e => handleSubmit(e)} autoComplete={"off"}>
                <Image
                    src="/logo.png"
                    width="300"
                    height="300"
                    alt="Logo"
                    style={{
                        maxWidth: "100%",
                        height: "auto"
                    }} />
                <div className={message ? styles.message : `${styles.message} ${styles.hidden}`}>{message}</div>
                {local
                    ? <LocalLoginForm pinHandler={pinHandler} reset={reset}/>
                    : <RemoteLoginForm pinHandler={pinHandler} reset={reset}/>}
            </form>
        </div>
    );
}

interface Props {
    pinHandler?: (event: ChangeEvent<HTMLInputElement>) => void
    reset: (event: FocusEvent<HTMLInputElement> | undefined) => void
}

function LocalLoginForm({pinHandler, reset}: Props) {
    const router = useRouter()
    const [tab, setTab] = useState<string | undefined>(undefined)

    useEffect(() => {
        setTab(router.query.tab as string)
    }, [router])

    const pinActive = () => tab === "pin" || tab === undefined ? styles.active : ""
    const passwordActive = () => tab === "password" ? styles.active : ""

    return <>
        <div className={styles["login-type"]}>
            {tab === "password" ?
                <Link href={"/login?tab=pin"} legacyBehavior>
                    <button className={pinActive()} onClick={() => reset(undefined)}>Pin</button>
                </Link> : null}
            {tab === "pin" || tab === undefined ?
                <Link href={"/login?tab=password"} legacyBehavior>
                    <button className={passwordActive()} onClick={() => reset(undefined)}>Password</button>
                </Link> : null}
        </div>
        {tab === "pin" || tab === undefined
            ? <input
                type="password"
                placeholder={"****"}
                className={styles.pin}
                id={"pin"}
                key={"pin"}
                maxLength={4}
                onFocus={reset}
                onChange={pinHandler}/> : null}
        {tab === "password" ? <>
            <input
                type="text"
                id={"user"}
                key={"user"}
                onFocus={reset}
                placeholder="Username..."/>
            <input
                type="password"
                id={"password"}
                key={"password"}
                onFocus={reset}
                placeholder="Password..."/>
            <button type="submit">Login</button>
        </> : null
        }
    </>;
}


function RemoteLoginForm({reset}: Props) {
    return (<>
        <input
            type="text"
            id={"user"}
            key={"user"}
            onFocus={reset}
            placeholder="Username..."/>
        <input
            type="password"
            id={"password"}
            key={"password"}
            onFocus={reset}
            placeholder="Password..."/>
        <button type="submit">Login</button>
    </>)
}