'use client'
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LevelContextType {
    level: number;
    setLevel: React.Dispatch<React.SetStateAction<number>>;
}

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export const LevelProvider = ({ children }: { children: ReactNode }) => {
    const [level, setLevel] = useState<number>(1);

    return (
        <LevelContext.Provider value={{ level, setLevel }}>
            {children}
        </LevelContext.Provider>
    );
};

export const useLevelContext = (): LevelContextType => {
    const context = useContext(LevelContext);
    if (!context) {
        throw new Error('useLevel must be used within a LevelProvider');
    }
    return context;
};
