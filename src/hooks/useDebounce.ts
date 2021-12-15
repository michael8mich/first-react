import { useCallback, useRef } from 'react'

export const useDebounce = (callback:any, delay:any) => {
    const timer:any = useRef(null)
    const debouncedCallback = useCallback((...args) => {
            if(timer.current) {
                clearTimeout(timer.current)
            }
            timer.current = setTimeout(() => {
                callback(...args)
            }, delay);
        },
        [callback,delay],
    )
    return debouncedCallback
}