'use client'

import React, { useState, useEffect } from "react";
import Popup from "./popup";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Headphones, PlayCircle, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useUser, useAuth } from "@clerk/nextjs";
import { useLevelContext } from "../context/levelContext";


const levelColors = [
    "#f8812e", "#e33545", "#8f479c", "#008bcd", "#00a07b",
    "#001e40", "#95003b", "#4d0651", "#c28b17", "#417929",
];

const categories = [
    { title: "Intervals", icon: Music },
    { title: "Chords", icon: Headphones },
    { title: "Chord Progressions", icon: PlayCircle },
    { title: "Clapback/Playback", icon: Mic },
];

function Dashboard() {
    // const [level, setLevel] = useState(1);
    const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
    const { level, setLevel } = useLevelContext();
    const [isLoaded, setIsLoaded] = useState(false);
    const { user } = useUser();
    const { isSignedIn } = useAuth();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-100 text-black p-8 flex flex-col items-center pt-24">
            <div className={`w-full max-w-7xl transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className="text-6xl font-bold mb-4 text-center">Ear Training</h1>

                <p className="text-xl text-center mb-12 text-gray-600 font-normal mt-6">
                    {isSignedIn ?
                        (user?.firstName ? `Welcome back ${user?.firstName}!` : 'Welcome back!') :
                        'Welcome!'
                    }
                </p>

                <div className="mb-16 flex justify-center">
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
                                    w-20 h-20 rounded-full text-2xl font-bold transition-all duration-300
                                    border-2
                                    ${level === i + 1 ? 'shadow-lg scale-110' : 'hover:border-opacity-100'}
                                `}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map(({ title, icon: Icon }) => (
                        <Dialog key={title}>
                            <DialogTrigger asChild>
                                <Card
                                    onClick={() => setSelectedExercise(title)}
                                    style={{ backgroundColor: levelColors[level - 1] }}
                                    className="border-none hover:shadow-md hover:transform hover:scale-105 transition duration-300 flex flex-col items-center justify-center aspect-square cursor-pointer"
                                >
                                    <CardContent className="flex flex-col items-center justify-center h-full p-6">
                                        <Icon size={48} className="mb-4 text-white" />
                                        <p className="text-2xl font-semibold text-center text-white">{title}</p>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="w-full max-w-3xl flex items-center">
                                <Popup
                                    exerciseName={selectedExercise}
                                    setExercise={setSelectedExercise}
                                />
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;