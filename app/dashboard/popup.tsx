'use client'

import React, { useState, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PopupProps {
    level: number;
    setLevel: Dispatch<SetStateAction<number>>;
    exerciseName: string | null;
    setExercise: Dispatch<SetStateAction<string | null>>;
}

const Popup: React.FC<PopupProps> = ({ level, setLevel, exerciseName, setExercise }) => {
    const [questions, setQuestions] = useState(10);

    return (
        <div className="p-8 flex flex-col items-center rounded-lg w-full max-w-2xl">
            <h1 className="text-3xl font-light mb-6 text-center text-gray-800">{exerciseName}</h1>
            <p className="mb-8 text-gray-600 text-left">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consectetur quis consequatur odio autem? Architecto, nulla quibusdam! Aperiam, earum. Molestias dolorum veniam, distinctio necessitatibus quasi quas ut libero consequuntur aliquam repellendus.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 w-full">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="text-lg font-light focus:outline-none w-full sm:w-auto">
                            Level {level}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {Array.from({ length: 10 }, (_, i) => (
                            <DropdownMenuItem key={i + 1} onClick={() => setLevel(i + 1)}>
                                Level {i + 1}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <input
                    type="number"
                    min="1"
                    max="100"
                    value={questions}
                    onChange={(e) => setQuestions(Number(e.target.value))}
                    className="text-lg font-normal focus:outline-none w-full sm:w-auto p-2 border rounded-md"
                    placeholder="Number of Questions"
                />
            </div>
            <p className="text-gray-600 mb-6">or</p>
            <Button className="mb-4 px-6 py-3 w-full">Create custom preset</Button>
            <Button className="px-6 py-3 w-full" onClick={() => setExercise(null)}>Start!</Button>
        </div>
    );
}

export default Popup;
