import {useEffect, useRef, RefObject} from 'react';

export default function useIntersectObserver(
    intersectionTarget:RefObject<HTMLDivElement>,
    observedElement:RefObject<HTMLDivElement>,
    threshold:number,maxThreshold:number,
    items:object[],
    callback:()=>void
) {

    const observer = useRef<IntersectionObserver | null>(null);

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
        if (!observer.current || !observedElement.current) return
        observer.current?.observe(observedElement.current)
        return () => {
            observer.current?.disconnect()
        }
    }, [observer, items])

    return observedElement
}