'use client'

import React, { useState, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { useLevelContext } from '../context/levelContext';
import { useNumberQuestions } from '../context/numberQuestionsContext';
import { useTimeContext } from '../context/timeContext';



interface PopupProps {
    exerciseName: string | null;
    setExercise: Dispatch<SetStateAction<string | null>>;
}

const levelColors = [
    "#f8812e", "#e33545", "#8f479c", "#008bcd", "#00a07b",
    "#001e40", "#95003b", "#4d0651", "#c28b17", "#417929",
];

const Popup: React.FC<PopupProps> = ({ exerciseName, setExercise }) => {
    const { isSignedIn } = useAuth();
    const { numberQuestions, setNumberQuestions } = useNumberQuestions();
    const { level, setLevel } = useLevelContext();
    const { timeData, setTimeData } = useTimeContext();

    const setFirstTime = () => {
        setTimeData([{ timeStart: Date.now(), timeEnd: 0 }]);
    }


    const instructions = (level: number) => {
        if ([1, 2, 3, 4].includes(level)) {
            return <p>You will hear an interval (ascending or descending) <i>once</i>. Identify the interval.</p>
        } else if ([5, 6, 7, 8, 9].includes(level)) {
            return <p>You will hear an interval <i>twice</i>, once in melodic form (ascending or descending), followed by harmoic form. Identify the interval.</p>
        } else {
            return <p>You will hear an interval (ascending, descending, or harmonic) <i>once</i>. Identify the interval.</p>
        }
    }
    return (
        <div className="p-8 px-4 flex flex-col items-center rounded-lg w-full max-w-3xl bg-white">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">{exerciseName}</h1>
            <div className='mb-8 text-center text-gray-600'>
                {instructions(level)}
            </div>

            <div className="mb-8 w-full">
                <h2 className="text-2xl font-semibold mb-4 text-center">Select Your Level</h2>
                <div className="flex flex-wrap justify-center gap-3 my-1 mt-8">
                    {Array.from({ length: 10 }, (_, i) => (
                        <Button
                            key={i + 1}
                            onClick={() => setLevel(i + 1)}
                            style={{
                                backgroundColor: level === i + 1 ? levelColors[i] : 'white',
                                color: level === i + 1 ? 'white' : 'black',
                            }}
                            className={`
                                w-14 h-14 rounded-full text-lg font-bold transition-all duration-300
                                border-2 hover:opacity-90
                                ${level === i + 1 ? 'shadow-lg scale-110' : 'hover:border-opacity-100'}
                            `}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-8 w-full">
                <span className="text-lg font-semibold">Questions:</span>
                <input
                    type="number"
                    min="1"
                    max="100"
                    value={numberQuestions === 0 ? '' : numberQuestions}
                    onChange={(e) => {
                        const value = e.target.value;
                        setNumberQuestions(value === '' ? 0 : Number(value));
                    }}
                    className="text-lg font-normal focus:outline-none w-20 p-2 border rounded-md text-center"
                    placeholder="10"
                />
            </div>

            <div className='w-full space-y-2 mb-3'>
                <Button
                    className="mb-4 px-6 py-3 w-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors text-lg font-semibold"
                >
                    Create custom preset
                </Button>

                <Button
                    className="px-6 py-3 w-full text-white hover:opacity-90 transition-colors text-lg font-semibold"
                    style={{ backgroundColor: levelColors[level - 1] }}
                    onClick={setFirstTime}
                    asChild>
                    <Link href={`/exercise/intervals?level=${level}&totalquestions=${numberQuestions}&question=1`} >Start!</Link>
                </Button>
            </div>


            {!isSignedIn && (
                <Button variant='link' className='pt-6 text-gray-600 text-sm'>
                    <Link href='/sign-in' className='flex-grow'>Sign in to save your progress</Link>
                </Button>
            )}
        </div >
    );
}

export default Popup;