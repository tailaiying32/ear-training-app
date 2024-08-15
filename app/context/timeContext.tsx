'use client'
import React, { createContext, useState, useContext, ReactNode } from 'react';

type TimeData = Array<{ timeStart: number, timeEnd: number }>;

interface TimeContextType {
    timeData: TimeData;
    setTimeData: React.Dispatch<React.SetStateAction<TimeData>>;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);



export const TimeProvider = ({ children }: { children: ReactNode }) => {
    const [timeData, setTimeData] = useState<TimeData>([]);

    return (
        <TimeContext.Provider value={{ timeData, setTimeData }}>
            {children}
        </TimeContext.Provider>
    );
};

export const useTimeContext = (): TimeContextType => {
    const context = useContext(TimeContext);
    if (!context) {
        throw new Error('useTimeContext must be used within a TimeProvider');
    }
    return context;
};

