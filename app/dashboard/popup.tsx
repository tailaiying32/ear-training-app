'use client'

import React, { useState, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

interface PopupProps {
    level: number;
    setLevel: Dispatch<SetStateAction<number>>;
    exerciseName: string | null;
    setExercise: Dispatch<SetStateAction<string | null>>;
}

const levelColors = [
    "#f8812e", "#e33545", "#8f479c", "#008bcd", "#00a07b",
    "#001e40", "#95003b", "#4d0651", "#c28b17", "#417929",
];

const Popup: React.FC<PopupProps> = ({ level, setLevel, exerciseName, setExercise }) => {
    const [questions, setQuestions] = useState(10);
    const { getToken, isLoaded, isSignedIn } = useAuth();

    return (
        <div className="p-8 flex flex-col items-center rounded-lg w-full max-w-2xl bg-white">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">{exerciseName}</h1>
            <p className="mb-8 text-gray-600 text-left leading-relaxed">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consectetur quis consequatur odio autem? Architecto, nulla quibusdam! Aperiam, earum. Molestias dolorum veniam, distinctio necessitatibus quasi quas ut libero consequuntur aliquam repellendus.
            </p>

            <div className="mb-8 w-full">
                <h2 className="text-2xl font-semibold mb-4 text-center">Select Your Level</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {Array.from({ length: 10 }, (_, i) => (
                        <Button
                            key={i + 1}
                            onClick={() => setLevel(i + 1)}
                            style={{
                                backgroundColor: level === i + 1 ? levelColors[i] : 'white',
                                color: level === i + 1 ? 'white' : 'black',
                            }}
                            className={`
                                w-12 h-12 rounded-full text-lg font-bold transition-all duration-300
                                border-2 hover:opacity-90
                                ${level === i + 1 ? 'shadow-lg scale-110' : 'hover:border-opacity-100'}
                            `}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-4 w-full">
                <span className="text-lg font-semibold">Questions:</span>
                <input
                    type="number"
                    min="1"
                    max="100"
                    value={questions}
                    onChange={(e) => setQuestions(Number(e.target.value))}
                    className="text-lg font-normal focus:outline-none w-20 p-2 border rounded-md text-center"
                    placeholder="10"
                />
            </div>

            <p className="text-gray-600 mb-5">or</p>

            <Button
                className="mb-4 px-6 py-3 w-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors text-lg font-semibold"
            >
                Create custom preset
            </Button>



            <Button className="px-6 py-3 w-full text-white hover:opacity-90 transition-colors text-lg font-semibold"
                style={{ backgroundColor: levelColors[level - 1] }}>
                <Link href="/exercise">Start!</Link>
            </Button>

            {!isSignedIn && (
                <Button variant='link' className='pt-6 text-gray-600 text-sm'>
                    <Link href='/sign-in'>Sign in to save your progress</Link>
                </Button>
            )}

        </div >
    );
}

export default Popup;