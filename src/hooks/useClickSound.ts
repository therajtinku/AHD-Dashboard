import { useCallback, useEffect, useRef } from 'react';
import clickSound from '../assets/click.mp3';

export const useClickSound = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(clickSound);
        audioRef.current.volume = 0.5; // Adjust volume as needed
    }, []);

    const playClickSound = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(error => console.error('Error playing click sound:', error));
        }
    }, []);

    return { playClickSound };
};
