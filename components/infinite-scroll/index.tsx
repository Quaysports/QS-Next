import styles from './infinite-scroll.module.css'
import {
    ReactNode, useEffect, useRef,
    useState
} from "react";
import {useSelector} from "react-redux";

interface Props {
    children: ReactNode
    selector?: (state: any) => any
    threshold: number
    maxThreshold: number
    scrollHandler: () => void
}

export default function InfiniteScroll({children, selector, threshold, maxThreshold, scrollHandler}: Props) {

    const container = useRef<HTMLDivElement>(null)
    const data = selector ? useSelector(selector) : null
    const [observer, setObserver] = useState<IntersectionObserver>()

    const handler = (entries: IntersectionObserverEntry[]) => {
        for (let entry of entries) {
            if (!entry.isIntersecting) continue;
            if (Number(entry.target.id) + threshold >= maxThreshold - 10) scrollHandler()
        }
    }

    useEffect(() => {
        let options = {root: container.current, rootMargin: '0px', threshold: [0],}
        if (!observer && container.current) setObserver(new IntersectionObserver(handler, options))
        return () => observer?.disconnect()
    }, [])

    useEffect(() => {
        if (!observer || !container.current) return
        for (let i in container.current.childNodes) {
            if (typeof container.current.childNodes[i] !== "object") continue;
            Number(i) === maxThreshold
                ? observer.observe(container.current.childNodes[i] as HTMLElement)
                : observer.unobserve(container.current.childNodes[i] as HTMLElement)
        }
    }, [container, observer, children, data])

    return (<div ref={container} id={"infinite-scroll"} className={styles.container}>
        {children}
    </div>)
}