import { useState, useCallback } from 'react';
import { Language, translations } from '../config/i18n';

export const useI18n = () => {
    const [lang, setLang] = useState<Language>(() => {
        const saved = localStorage.getItem('app-lang');
        return (saved as Language) || 'th'; // Default to Thai
    });

    const toggleLang = useCallback(() => {
        setLang(prev => {
            const next = prev === 'en' ? 'th' : 'en';
            localStorage.setItem('app-lang', next);
            return next;
        });
    }, []);

    const t = translations[lang];

    return { lang, toggleLang, t };
};
