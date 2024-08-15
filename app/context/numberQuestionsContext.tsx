'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface NumberQuestionsContextType {
    numberQuestions: number;
    setNumberQuestions: React.Dispatch<React.SetStateAction<number>>;
}

const NumberQuestionContext = createContext<NumberQuestionsContextType | undefined>(undefined);

export const NumberQuestionProvider = ({ children }: { children: ReactNode }) => {
    const [numberQuestions, setNumberQuestions] = useState<number>(10);

    return (
        <NumberQuestionContext.Provider value={{ numberQuestions, setNumberQuestions }}>
            {children}
        </NumberQuestionContext.Provider>
    );
};

export const useNumberQuestions = (): NumberQuestionsContextType => {
    const context = useContext(NumberQuestionContext);
    if (!context) {
        throw new Error('numberQuestion must be used within a numberQuestionProvider');
    }
    return context;
};
