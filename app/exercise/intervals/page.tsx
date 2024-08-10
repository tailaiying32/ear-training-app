'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Factory } from "vexflow";
import { useLevel } from '../../context/level-context';
import { allNotesSharps } from '@/data/all-notes-sharps';
import { allNotesFlats } from '@/data/all-notes-flats';

type Interval = {
    id: number;
    name: string;
    halfsteps: number;
    format: string;
    startingNote: string;
};

type IntervalState = {
    currentInterval: Interval | null;
    allIntervals: Interval[];
};

function Exercise() {
    const searchParams = useSearchParams();
    const rendererRef = useRef<Factory | null>(null);
    const [intervalState, setIntervalState] = useState<IntervalState>({
        currentInterval: null,
        allIntervals: []
    });
    const [allstartingNotes, setAllStartingNotes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { level: contextLevel, setLevel } = useLevel();

    //initialize question state
    const totalQuestions = parseInt(searchParams.get("totalquestions") || "0", 10);
    const initialQuestion = parseInt(searchParams.get("question") || "1", 10);
    const [currentQuestion, setCurrentQuestion] = useState<number>(initialQuestion);
    const [allQuestions, setAllQuestions] = useState<Interval[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const startingNotes = allNotesSharps.slice(28, 52); //starting notes from C3 to C5

    //set level for first time
    const level = parseInt(searchParams.get('level') || contextLevel.toString());
    useEffect(() => {
        setLevel(level);
    }, [level, setLevel]);

    //store level in local storage to persist across refreshes
    useEffect(() => {
        if (level) {
            localStorage.clear();
            localStorage.setItem('level', level.toString());
        }
    }, [level]);

    //retrieve level from local storage upon refresh
    useEffect(() => {
        const storedLevel = localStorage.getItem('level');
        if (storedLevel) {
            setLevel(parseInt(storedLevel));
        } else {
            setLevel(contextLevel);
        }
    }, [contextLevel, setLevel]);

    //fetch array of intervals from level, then select random interval
    useEffect(() => {
        const fetchIntervals = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/api/intervals?level=${level}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Interval[] = await response.json();

                // generate array of starting notes
                const generatedStartingNotes: Array<string> = [];
                for (let i = 0; i < totalQuestions; i++) {
                    const startingNote = startingNotes[Math.floor(Math.random() * startingNotes.length)];
                    generatedStartingNotes.push(startingNote);
                }
                setAllStartingNotes(generatedStartingNotes);


                //generate array of intervals
                const generatedIntervals: Interval[] = Array.from({ length: totalQuestions }, (_, index) => {
                    const randomInterval = data[Math.floor(Math.random() * data.length)];
                    return {
                        ...randomInterval,
                        startingNote: generatedStartingNotes[index]
                    };
                });
                console.log("generated intervals: ", generatedIntervals);

                setAllQuestions(generatedIntervals);

                setIntervalState({
                    currentInterval: generatedIntervals[0] || null,
                    allIntervals: data
                });


            } catch (error) {
                console.error('Error fetching intervals:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIntervals();
    }, [level]);

    //calculate end note based on start note, halfstep, and format properties
    const getEndNote = useCallback((startNote: string, halfsteps: number, format: string): string => {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        // Regular expressions to parse the start note
        const noSharps = /^([A-G])(\d)$/; // For notes like C4, D5
        const hasSharps = /^([A-G])(#)(\d)$/; // For notes like C#4, A#3

        let noteName: string;
        let octave: number;
        let noteIndex: number;
        let newOctave: number;

        if (startNote.includes('b')) {
            startNote = allNotesSharps[allNotesFlats.indexOf(startNote)];
            console.log(startNote);
        }

        // determine if startNote has sharps
        if (startNote.match(noSharps)) {
            const [, note, oct] = startNote.match(noSharps)!;
            noteName = note;
            octave = parseInt(oct, 10);
        } else if (startNote.match(hasSharps)) {
            const [, note, , oct] = startNote.match(hasSharps)!;
            noteName = note + '#'; // Handle sharp notes
            octave = parseInt(oct, 10);
        } else {
            throw new Error('Invalid start note format');
        }

        noteIndex = notes.indexOf(noteName);
        newOctave = octave;

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
    }, []);

    //vexflow rendering
    useEffect(() => {
        if (isLoading || !intervalState.currentInterval) {
            console.log('Loading or no interval, skipping render');
            return;
        }

        const renderTimeout = setTimeout(() => {
            try {
                if (rendererRef.current) {
                    rendererRef.current.getContext().clear();
                }

                const outputElement = document.getElementById('output');
                if (outputElement) {
                    outputElement.innerHTML = '';
                }

                const vf = new Factory({
                    renderer: { elementId: 'output', width: 800, height: 600 },
                });

                const score = vf.EasyScore();
                const system = vf.System({
                    width: 200,
                    x: 150,
                    y: 125
                });

                vf.getContext().scale(1.5, 1.5);

                //set interval and starting note to current note and current starting note
                const { currentInterval } = intervalState;
                console.log("current interval: ", currentInterval);

                //if there are no intervals, skip render
                if (!currentInterval) {
                    console.log('No current interval, skipping render');
                    return;
                }
                const convertSharpToFlat = (note: string) => {
                    const index = allNotesSharps.indexOf(note);
                    return index !== -1 ? allNotesFlats[index] : note;
                };

                const shouldConvertToFlat = (note: string, intervalName: string, format: string) => {
                    if (!note.includes('#')) return false;

                    const isAscending = format === 'ascending';
                    const isDescending = format === 'descending';

                    return (
                        (intervalName.includes('maj') && isAscending) ||
                        (intervalName.includes('dim') && isAscending) ||
                        (intervalName.includes('min') && isDescending)
                    );
                };

                let startNote = currentInterval.startingNote;
                if (shouldConvertToFlat(startNote, currentInterval.name, currentInterval.format)) {
                    startNote = convertSharpToFlat(startNote);
                }

                let endNote = getEndNote(startNote, currentInterval.halfsteps, currentInterval.format);

                if (shouldConvertToFlat(endNote, currentInterval.name, currentInterval.format) ||
                    (endNote.includes('#') && currentInterval.name.includes('min') && currentInterval.format === 'ascending')) {
                    endNote = convertSharpToFlat(endNote);
                }

                let notes;
                if (currentInterval.format === 'harmonic') {
                    notes = `(${startNote} ${endNote})/w`;
                } else if (currentInterval.format === 'ascending') {
                    notes = `${startNote}/h, ${endNote}/h`;
                } else {  // descending
                    notes = `${endNote}/h, ${startNote}/h`;
                }

                // !!!!!! please make the code below more readable and maintainable at some point get rid of all the fucking if loops

                // let startNote; //declare startNote

                // // ascending start note cases for sharp to flat conversion (maj and dim)
                // if (currentInterval?.startingNote.includes('#') && currentInterval.name.includes('maj') && currentInterval.format === 'ascending') {
                //     let startNoteIndex = allNotesSharps.indexOf(currentInterval.startingNote);
                //     startNote = allNotesFlats[startNoteIndex];
                // } else if (currentInterval.startingNote.includes('#') && currentInterval.name.includes('dim') && currentInterval.format === 'ascending') {
                //     let startNoteIndex = allNotesSharps.indexOf(currentInterval.startingNote);
                //     startNote = allNotesFlats[startNoteIndex];
                // }

                // //descending start note case for sharp to flat conversion (minor)
                // if (currentInterval?.startingNote.includes('#') && currentInterval.name.includes('min') && currentInterval.format === 'descending') {
                //     let startNoteIndex = allNotesSharps.indexOf(currentInterval.startingNote);
                //     startNote = allNotesFlats[startNoteIndex];
                // }

                // startNote = currentInterval.startingNote;

                // let endNote = getEndNote(startNote!, currentInterval.halfsteps, currentInterval.format);

                // //ascending end note case for sharp to flat conversion ( minor)
                // if (endNote.includes('#') && currentInterval.name.includes('min') && currentInterval.format === 'ascending') {
                //     let endNoteIndex = allNotesSharps.indexOf(endNote);
                //     endNote = allNotesFlats[endNoteIndex];
                // }

                // //descending end note cases for sharp to flat conversion (maj and dim)
                // if (endNote.includes('#') && currentInterval.name.includes('maj') && currentInterval.format === 'descending') {
                //     let endNoteIndex = allNotesSharps.indexOf(endNote);
                //     endNote = allNotesFlats[endNoteIndex];
                // } else if (endNote.includes('#') && currentInterval.name.includes('dim') && currentInterval.format === 'descending') {
                //     let endNoteIndex = allNotesSharps.indexOf(endNote);
                //     endNote = allNotesFlats[endNoteIndex];
                // }

                // let notes; //declare notes to be rendered
                // if (currentInterval.format === 'harmonic') {
                //     notes = `(${startNote} ${endNote})/w`;
                // } else if (currentInterval.format === 'ascending') {
                //     notes = `${startNote}/h, ${endNote}/h`;
                // } else {  // descending
                //     notes = `${endNote}/h, ${startNote}/h`;
                // }

                const getIndexInFullScale = (note: string): number => {
                    const flatIndex = allNotesFlats.indexOf(note);
                    const sharpIndex = allNotesSharps.indexOf(note);
                    return Math.max(flatIndex, sharpIndex); // Use whichever index is valid
                };

                const averageIndex = (getIndexInFullScale(startNote) + getIndexInFullScale(endNote)) / 2;

                // C4 is at index 39 in a full 88-key scale
                const isHigherThanMiddleC = averageIndex >= 39;

                system.addStave({
                    voices: [
                        score.voice(score.notes(notes, { clef: isHigherThanMiddleC ? 'treble' : 'bass' })),
                    ]
                }).addClef(isHigherThanMiddleC ? 'treble' : 'bass').addTimeSignature('4/4');

                vf.draw();

                rendererRef.current = vf;
            } catch (error) {
                console.error('Error rendering VexFlow:', error);
            }
        }, 100);

        return () => clearTimeout(renderTimeout);
    }, [intervalState.currentInterval, isLoading, getEndNote]);

    //keep track of question number and update url accordingly
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        params.set("question", currentQuestion.toString());
        //update current URL without causing page reload
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }, [currentQuestion])

    //handle next button
    const handleNextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => {
                const newIndex = prev + 1;
                setIntervalState(prevState => ({
                    ...prevState,
                    currentInterval: allQuestions[newIndex]
                }));
                setCurrentQuestion(newIndex + 1); // +1 because question numbers start at 1
                return newIndex;
            });
        } else if (currentQuestionIndex === totalQuestions - 1) {
            console.log("moving")
        }
    }

    //handle previous button
    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => {
                const newIndex = prev - 1;
                setIntervalState(prevState => ({
                    ...prevState,
                    currentInterval: allQuestions[newIndex]
                }));
                setCurrentQuestion(newIndex + 1); // +1 because question numbers start at 1
                return newIndex;
            });
        }
    }


    //creat new array of intervals with unique names for answer buttons
    const uniqueIntervalsNames = Array.from(new Set(intervalState.allIntervals.map(interval => interval.name)));
    console.log("displayed interval: ", intervalState.currentInterval?.name)

    return (
        <>
            <div className="min-h-[calc(100vh-64px)] bg-gray-100 text-black p-4 flex flex-col">
                <h1 className="text-4xl font-bold mb-6 text-center">Intervals - Level {level}</h1>

                <Card className="flex-grow shadow-lg flex flex-col">
                    <CardContent className="p-6 flex flex-col flex-grow">
                        <div className="flex flex-col md:flex-row gap-8 flex-grow">
                            <div className="md:w-1/2 flex flex-col">
                                <div className="bg-white p-6 rounded-lg shadow-inner flex-grow flex items-center justify-center">
                                    <div id='output'></div>
                                </div>
                                <Button className="mt-4 w-full">Play Interval</Button>
                            </div>

                            <div className="md:w-1/2 flex flex-col">
                                <h2 className="text-2xl font-semibold mb-4">Select the correct interval:</h2>
                                <ul className="space-y-4 flex-grow flex flex-col justify-center">
                                    {uniqueIntervalsNames.map((name, index) => (
                                        <li key={index}>
                                            <Button variant={'outline'}>{name}</Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handlePreviousQuestion}>Previous</Button>
                    <div className="space-x-4">
                        <Button>Submit</Button>
                        <Button onClick={handleNextQuestion}>Next</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Exercise;