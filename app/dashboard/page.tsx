'use client'

import React, { useState } from "react";
import Popup from "./popup";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Music, Headphones, PlayCircle, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


const levelColors = [
    "#f8812e",
    "#e33545",
    "#8f479c",
    "#008bcd",
    "#00a07b",
    "#001e40",
    "#95003b",
    "#4d0651",
    "#c28b17",
    "#417929",
];

const categories = [
    { title: "Intervals", icon: Music },
    { title: "Chords", icon: Headphones },
    { title: "Chord Progressions", icon: PlayCircle },
    { title: "Clapback/Playback", icon: Mic },
];

function Dashboard() {
    const [level, setLevel] = useState(10);
    const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col justify-center items-center">
            <h1 className="text-4xl font-light mb-2 text-center text-gray-800">Ear Training</h1>
            <p className="text-xl text-center mb-8 text-gray-600">Welcome back!</p>

            <Card className="max-w-7xl mx-auto shadow-sm w-full">
                <CardHeader className="border-b bg-black rounded-t-lg text-white p-4 flex justify-between">
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="text-xl font-light bg-black mr-4 focus:outline-none">
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
                    </div>
                </CardHeader>

                <CardContent className="p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
                        {categories.map(({ title, icon: Icon }) => (
                            <Dialog key={title}>
                                <DialogTrigger asChild>
                                    <Card
                                        onClick={() => setSelectedExercise(title)}
                                        style={{ backgroundColor: levelColors[level - 1] }}
                                        className={`border-none shadow-none hover:drop-shadow-lg hover:transform- transition duration-300 flex flex-col items-center justify-center aspect-square`}
                                    >
                                        <CardContent className="flex flex-col items-center justify-center h-full p-6">
                                            <Icon size={32} className="mb-4 text-white" />
                                            <p className="text-lg font-base text-center text-white">{title}</p>
                                        </CardContent>
                                    </Card>
                                </DialogTrigger>
                                <DialogContent className="w-full max-w-2xl">
                                    <Popup
                                        level={level}
                                        setLevel={setLevel}
                                        exerciseName={selectedExercise}
                                        setExercise={setSelectedExercise}
                                    />
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Dashboard;
