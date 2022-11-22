import styles from './infinite-scroll.module.css'
import {
    ReactNode, useEffect, useRef,
    useState
} from "react";
import {useDispatch} from "react-redux";
import {AnyAction} from "redux";

interface Props {
    children: ReactNode
    incrementReducer: ()=>AnyAction
}

export default function InfiniteScroll({children, incrementReducer}: Props) {

    const container = useRef<HTMLDivElement>(null)
    const target = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()
    const [observer, setObserver] = useState<IntersectionObserver>()

    const handler = () => dispatch(incrementReducer())

    useEffect(() => {
        let options = {root: container.current, rootMargin: '0px', threshold: [0],}
        if (!observer && container.current) setObserver(new IntersectionObserver(handler, options))
        return () => observer?.disconnect()
    }, [])

    useEffect(() => {
        if (!observer || !target.current) return
        observer.observe(target.current)
    }, [observer, target])

    return (<div ref={container} className={styles.container}>
        <div className={styles.wrapper}>
            <div  className={styles.content}>{children}</div>
            <div ref={target} className={styles.target}></div>
        </div>
    </div>)
}