import {useEffect, useRef, RefObject, useState} from 'react';

export default function useIntersectObserver(
    intersectionTarget:RefObject<HTMLDivElement>,
    observableElements:RefObject<HTMLDivElement>,
    threshold:number,maxThreshold:number,
    items:object[],
    callback:()=>void
) {

    const observer = useRef<IntersectionObserver | null>(null);
    const [observedElement, setObservedElement] = useState<ChildNode | null>()

    const handler = (entries: IntersectionObserverEntry[]) => {
        for (let entry of entries) {
            if (!entry.isIntersecting) continue;
            if (Number(entry.target.id) + threshold >= maxThreshold - 10) callback()
        }
    }

    useEffect(() => {
        let options = {root: intersectionTarget.current, rootMargin: '0px', threshold: [0.1],}
        if (!observer.current && intersectionTarget.current) {
            observer.current = new IntersectionObserver(handler, options)
        }
    }, [])

    useEffect(() => {
        if (!observer.current || !observableElements.current) return
        for (let i in observableElements.current.childNodes) {
            const node = observableElements.current.childNodes[i] as HTMLElement
            if (typeof node !== "object") continue;
            if(Number(i) === maxThreshold - 10) {
                observer.current.observe(node)
                setObservedElement(node)
            } else {
                observer.current.unobserve(node)
            }
        }
        return () => {
            observer.current?.disconnect()
        }
    }, [observableElements, observer, items])

    return observedElement
}