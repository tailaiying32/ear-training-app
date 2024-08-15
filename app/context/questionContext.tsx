'use client'
import React, { createContext, useState, useContext, ReactNode } from 'react';

type QuestionData = Array<{ index: number | null, isCorrect: boolean | null, questionAnswered: boolean, correctIndex: number }>;

interface QuestionContextType {
    questionData: QuestionData;
    setQuestionData: React.Dispatch<React.SetStateAction<QuestionData>>;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export const QuestionProvider = ({ children }: { children: ReactNode }) => {
    const [questionData, setQuestionData] = useState<QuestionData>([]);

    return (
        <QuestionContext.Provider value={{ questionData, setQuestionData }}>
            {children}
        </QuestionContext.Provider>
    );
};

export const useQuestionContext = (): QuestionContextType => {
    const context = useContext(QuestionContext);
    if (!context) {
        throw new Error('useQuestionContext must be used within a QuestionProvider');
    }
    return context;
};