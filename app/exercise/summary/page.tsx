'use client'

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useQuestionContext } from "@/app/context/questionContext";
import { useLevelContext } from "@/app/context/levelContext";
import { useState } from "react";
import { useNumberQuestions } from "@/app/context/numberQuestionsContext";
import { useTimeContext } from "@/app/context/timeContext";
import { PrismaClient } from "@prisma/client";


function Summary() {
    const { questionData } = useQuestionContext();
    const { level, setLevel } = useLevelContext();
    const { numberQuestions, setNumberQuestions } = useNumberQuestions();
    const { timeData, setTimeData } = useTimeContext();

    const setFirstTime = () => {
        setTimeData([{ timeStart: Date.now(), timeEnd: 0 }]);
    }

    let numberCorrect: number = 0;
    for (let question of questionData) {
        if (question.isCorrect) {
            numberCorrect++;
        }
    }

    function convertTime(ms: number): string {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        if (minutes === 0) {
            return `${seconds} seconds`
        }
        return `${minutes} min ${(parseInt(seconds) < 10 ? '0' : '')}${seconds} seconds`;
    }

    // console.log('time data: ', timeData);

    return (
        <div className="h-screen bg-gray-100 p-4 flex flex-col px-56 pt-16 space-y-6">
            <h1 className="text-3xl font-bold mb-4 text-center mt-16">Summary</h1>
            <h1>Correct: {numberCorrect} out of {questionData.length}</h1>
            <h1>Total Time Spent: {timeData.length > 0 ? convertTime(((timeData[timeData.length - 1].timeEnd ?? 0) - (timeData[0].timeStart ?? 0))) : 0}</h1>
            <h1>Average Time per Question: {timeData.length > 0
                ? convertTime((timeData.map(question => (question.timeEnd - question.timeStart))
                    .reduce((acc, val) => acc + val, 0)) / (questionData.length)) //subtracts startTime from endTime for each question and averages
                : 0
            }</h1>
            <h1>Total Points:</h1>
            <Button
                onClick={() => setFirstTime()}
                asChild>
                <Link href={`/exercise/intervals?level=${level}&totalquestions=${numberQuestions}&question=1`}>Restart</Link>
            </Button>
            <Button
                asChild>
                <Link href={`/dashboard`}>Dashboard</Link>
            </Button>
        </div>
    )
}

export default Summary