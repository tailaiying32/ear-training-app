'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Vex, Flow, Factory, Stave, EasyScore } from "vexflow";
import { useLevel } from '../../context/level-context';
import { startingNotes } from '@/data/starting-notes';

// Define the types
type Interval = {
    id: number;
    name: string;
    halfsteps: number;
    format: string;
};


function Exercise() {
    const searchParams = useSearchParams();
    const rendererRef = useRef<Factory | null>(null);
    const [interval, setInterval] = useState<Interval | null>(null);
    const [intervals, setIntervals] = useState<Interval[]>([]);
    const { level: contextLevel, setLevel } = useLevel();

    const level = parseInt(searchParams.get('level') || contextLevel.toString());

    useEffect(() => {
        setLevel(level);
    }, [level, setLevel]);

    useEffect(() => {
        const fetchIntervals = async () => {
            console.log('Fetching intervals...')
            try {
                const response = await fetch(`/api/intervals?level=${level}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch intervals');
                }
                const data = await response.json();
                console.log('Fetched intervals:', data);
                setIntervals(data);
                if (data.length > 0) {
                    setInterval(data[Math.floor(Math.random() * data.length)]);
                }
            } catch (error) {
                console.error('Error fetching intervals:', error);
            }
        };

        fetchIntervals();
    }, [level]);

    //rendering intervals in vexflow
    useEffect(() => {
        if (!interval) {
            console.log('No interval selected yet');
            return;
        }

        console.log('Attempting to render VexFlow with interval:', interval);

        // Clear previous rendering
        if (rendererRef.current) {
            rendererRef.current.getContext().clear();
        }

        try {
            // Create VexFlow renderer and attach to div element
            const vf = new Factory({
                renderer: { elementId: 'output', width: 500, height: 200 },
            });

            console.log('VexFlow Factory created');

            const score = vf.EasyScore();
            const system = vf.System();

            // Generate notes based on interval data
            const randomNumber = Math.floor(Math.random() * startingNotes.length);
            const startNote = startingNotes[randomNumber]
            const endNote = getEndNote(startNote, interval.halfsteps, interval.format);

            console.log('Generated notes:', startNote, endNote);

            let notes;
            if (interval.format === 'harmonic') {
                notes = `(${startNote} ${endNote})/w`;
            } else if (interval.format === 'ascending') {
                notes = `${startNote}/h, ${endNote}/h`;
            } else {  // descending
                notes = `${endNote}/h, ${startNote}/h`;
            }

            console.log('Notes to render:', notes);

            system
                .addStave({
                    voices: [
                        score.voice(score.notes(notes)),
                    ]
                })
                .addClef('treble')
                .addTimeSignature('4/4');

            vf.draw();

            console.log('VexFlow rendering complete');

            rendererRef.current = vf;
        } catch (error) {
            console.error('Error rendering VexFlow:', error);
        }
    }, [interval]);

    // Helper function to calculate the end note
    function getEndNote(startNote: string, halfsteps: number, format: string): string {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const [noteName, octave] = startNote.split('');
        let noteIndex = notes.indexOf(noteName);
        let newOctave = parseInt(octave);

        if (format === 'descending') {
            halfsteps = -halfsteps;
        }

        noteIndex += halfsteps;
        while (noteIndex >= 12) {
            noteIndex -= 12;
            newOctave++;
        }
        while (noteIndex < 0) {
            noteIndex += 12;
            newOctave--;
        }

        return `${notes[noteIndex]}${newOctave}`;
    }

    console.log('Rendering Exercise with level:', level);
    console.log('Intervals:', intervals);
    console.log('Selected interval:', interval);

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-100 text-black p-4 flex flex-col">
            <h1 className="text-4xl font-bold mb-6 text-center">Intervals - Level {level}</h1>

            <Card className="flex-grow shadow-lg flex flex-col">
                <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex flex-col md:flex-row gap-8 flex-grow">
                        <div className="md:w-1/2 flex flex-col">
                            <div className="bg-white p-6 rounded-lg shadow-inner flex-grow flex items-center justify-center">
                                <div id='output'></div>
                            </div>
                            <Button className="mt-4 w-full">Play Progression</Button>
                        </div>

                        <div className="md:w-1/2 flex flex-col">
                            <h2 className="text-2xl font-semibold mb-4">Select the correct progression:</h2>
                            <ul className="space-y-4 flex-grow flex flex-col justify-center">
                                {intervals.map((option, index) => (
                                    <li key={index}>
                                        <Button
                                            variant="outline"
                                            className="w-full text-left justify-start h-auto py-3 px-4"
                                            onClick={() => {/* Handle selection */ }}
                                        >
                                            {option.name}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between mt-6">
                <Button variant="outline">Previous</Button>
                <div className="space-x-4">
                    <Button>Submit</Button>
                    <Button>Next</Button>
                </div>
            </div>
        </div>
    );
}

export default Exercise;