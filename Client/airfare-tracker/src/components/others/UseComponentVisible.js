

import { useEffect, useRef, useState } from 'react';

export const useComponentVisible = (initialIsVisible, externalHandler) => {
    const [isVisible, setIsVisible] = useState(initialIsVisible);
    const ref = useRef(null);

    const handleClickOutside = (e) => {
        if(ref.current && ! ref.current.contains(e.target)){
            setIsVisible(false);
            externalHandler(true);
        }
    };
    
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        }
    }, []);

    return {ref, isVisible, setIsVisible};
};

