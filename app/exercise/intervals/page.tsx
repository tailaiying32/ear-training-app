'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Factory } from "vexflow";
import { useLevelContext } from '../../context/levelContext';
import { allNotesSharps } from '@/data/all-notes-sharps';
import { allNotesFlats } from '@/data/all-notes-flats';
import * as Tone from "tone";
import { useQuestionContext } from '@/app/context/questionContext';
import { useTimeContext } from '@/app/context/timeContext';


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

    //time data
    const { timeData, setTimeData } = useTimeContext();

    //for use in return statement (start note, end note, and current interval)
    const [startNote, setStartNote] = useState<string>('');
    const [endNote, setEndNote] = useState<string>('');
    const [currentIntervalData, setCurrentIntervalData] = useState<any>(null);

    //pull starting notes and level from respective data
    const [allstartingNotes, setAllStartingNotes] = useState<string[]>([]);
    const startingNotes = allNotesSharps.slice(28, 52);    //starting notes from C3 to C5
    const [isLoading, setIsLoading] = useState(true);
    const { level: contextLevel, setLevel } = useLevelContext();

    //initialize question state
    const totalQuestions = parseInt(searchParams.get("totalquestions") || "0", 10);
    const initialQuestion = parseInt(searchParams.get("question") || "1", 10);
    const [currentQuestion, setCurrentQuestion] = useState<number>(initialQuestion);
    const [allQuestions, setAllQuestions] = useState<Interval[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const { questionData, setQuestionData } = useQuestionContext();
    const currentQuestionData = questionData[currentQuestionIndex];

    //initialize sampler
    const samplerRef = useRef<Tone.Sampler | null>(null);
    const [isSamplerLoaded, setIsSamplerLoaded] = useState(false);

    const [clickedButton, setClickedButton] = useState<number | null>(null);

    //check answer for correctness
    const checkCorrect = (currentIntervalData: Interval, name: string, index: number) => {
        setClickedButton(index);
        const correct = currentIntervalData.name === name;
        setQuestionData(prevQuestions => {
            const newAnswers = [...prevQuestions];
            newAnswers[currentQuestionIndex] = { index, isCorrect: correct, questionAnswered: true };
            return newAnswers;
        });
    };

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

    //load piano samples
    useEffect(() => {
        if (!samplerRef.current) {
            samplerRef.current = new Tone.Sampler({
                // links to all mp3 files in public directory
                urls: {
                    A0: "A0.mp3",
                    A1: "A1.mp3",
                    A2: "A2.mp3",
                    A3: "A3.mp3",
                    A4: "A4.mp3",
                    A5: "A5.mp3",
                    A6: "A6.mp3",
                    A7: "A7.mp3",
                    C1: "C1.mp3",
                    C2: "C2.mp3",
                    C3: "C3.mp3",
                    C4: "C4.mp3",
                    C5: "C5.mp3",
                    C6: "C6.mp3",
                    C7: "C7.mp3",
                    C8: "C8.mp3",
                    Eb1: "D#1.mp3",
                    Eb2: "D#2.mp3",
                    Eb3: "D#3.mp3",
                    Eb4: "D#4.mp3",
                    Eb5: "D#5.mp3",
                    Eb6: "D#6.mp3",
                    Eb7: "D#7.mp3",
                    Gb1: "F#1.mp3",
                    Gb2: "F#2.mp3",
                    Gb3: "F#3.mp3",
                    Gb4: "F#4.mp3",
                    Gb5: "F#5.mp3",
                    Gb6: "F#6.mp3",
                    Gb7: "F#7.mp3",
                },
                baseUrl: "/piano-samples/",
                volume: -8,
                onload: () => {
                    console.log('Sampler loaded');
                    setIsSamplerLoaded(true);
                }
            }).toDestination();
        }
    }, []);

    //play piano notes
    const playNotes = (startNote: string, endNote: string, interval: Interval, level: number,) => {
        try {
            if (isSamplerLoaded) {
                if ([1, 2, 3, 4, 10].includes(level)) {
                    if (interval.format === "harmonic") {
                        samplerRef.current?.triggerAttackRelease([`${startNote}`, `${endNote}`], 1.75);
                    } else {
                        const now = Tone.now();
                        samplerRef.current?.triggerAttackRelease(`${startNote}`, 1.3, now);
                        samplerRef.current?.triggerAttackRelease(`${endNote}`, 1.2, now + 1.299); //slightly less to make the transition between notes smoother (slurred)
                    }
                } else if ([5, 6, 7, 8, 9].includes(level)) {
                    const now = Tone.now();
                    samplerRef.current?.triggerAttackRelease(`${startNote}`, 1.3, now);
                    samplerRef.current?.triggerAttackRelease(`${endNote}`, 1.2, now + 1.299); //slightly less to make the transition between notes smoother (slurred)
                    samplerRef.current?.triggerAttackRelease([`${startNote}`, `${endNote}`], 1.75, now + 1.299 + 1.5);
                }
            }
        } catch (error) {
            console.error('error playing audio: ', error)
        }
    }

    //used to stop sounds
    const stopSounds = () => {
    };

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

                setAllQuestions(generatedIntervals);
                setQuestionData(Array(totalQuestions).fill({ index: null, isCorrect: null }));

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
    let hasUpdated = useRef(false);
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
                    renderer: { elementId: 'output', width: 800, height: 300 }
                });

                const score = vf.EasyScore();
                const system = vf.System({
                    width: 400,
                    x: 0,
                    y: 0
                });


                vf.getContext().scale(2.0, 2.0);

                //set interval and starting note to current note and current starting note
                const { currentInterval } = intervalState;
                setCurrentIntervalData(currentInterval);
                // console.log("current interval: ", currentInterval);

                //if there are no intervals, skip render
                if (!currentInterval) {
                    console.log('No current interval, skipping render');
                    return;
                }

                //function to convert sharps to flats
                const convertSharpToFlat = (note: string) => {
                    const index = allNotesSharps.indexOf(note);
                    return index !== -1 ? allNotesFlats[index] : note;
                };

                //decide when to convert to flat
                const shouldConvertStartToFlat = (note: string, intervalName: string, format: string) => {
                    if (!note.includes('#')) return false;

                    const isAscending = format === 'ascending';
                    const isDescending = format === 'descending';

                    return (
                        (intervalName.includes('maj') && isAscending) ||
                        (intervalName.includes('dim') && isAscending) ||
                        (intervalName.includes('min') && isDescending)
                    );
                };

                const shouldConvertEndToFlat = (note: string, intervalName: string, format: string) => {
                    if (!note.includes('#')) return false;

                    const isAscending = format === 'ascending';
                    const isDescending = format === 'descending';

                    return (
                        (intervalName.includes('maj') && isDescending) ||
                        (intervalName.includes('dim') && isDescending) ||
                        (intervalName.includes('min') && isAscending)
                    );
                };

                //convert start note to flat?
                let startNote = currentInterval.startingNote;
                if (shouldConvertStartToFlat(startNote, currentInterval.name, currentInterval.format)) {
                    startNote = convertSharpToFlat(startNote);
                }
                setStartNote(startNote);

                let endNote = getEndNote(startNote, currentInterval.halfsteps, currentInterval.format);

                //convert end note to flat?
                if (shouldConvertEndToFlat(endNote, currentInterval.name, currentInterval.format)) {
                    endNote = convertSharpToFlat(endNote);
                }

                setEndNote(endNote);

                //structure basic note rendering
                let notes;
                if (currentInterval.format === 'harmonic') {
                    notes = `(${startNote} ${endNote})/w`;
                } else {
                    notes = `${startNote}/h, ${endNote}/h`;
                }

                //decide when to use treble or bass clef
                const getIndexInFullScale = (note: string): number => {
                    const flatIndex = allNotesFlats.indexOf(note);
                    const sharpIndex = allNotesSharps.indexOf(note);
                    return Math.max(flatIndex, sharpIndex); // Use whichever index is valid
                };

                const averageIndex = (getIndexInFullScale(startNote) + getIndexInFullScale(endNote)) / 2;

                // C4 is at index 39 in a full 88-key scale
                const isHigherThanMiddleC = averageIndex >= 39;

                // Always add the stave and clef
                const stave = system.addStave({
                    voices: []
                }).addClef(isHigherThanMiddleC ? 'treble' : 'bass');

                // Only add notes if they should be visible
                if (currentQuestionData?.questionAnswered) {
                    stave.setContext(vf.getContext()).draw();
                    const voice = score.voice(score.notes(notes, { clef: isHigherThanMiddleC ? 'treble' : 'bass' }));
                    vf.Formatter().joinVoices([voice]).formatToStave([voice], stave);
                    voice.draw(vf.getContext(), stave);
                }

                vf.draw();

                rendererRef.current = vf;

                //play notes
                if (!hasUpdated.current && !currentQuestionData?.questionAnswered) {
                    playNotes(startNote, endNote, currentInterval, level);
                    hasUpdated.current = true; // Update ref after playback
                }
            } catch (error) {
                console.error('Error rendering VexFlow:', error);
            }
        }, 0);

        return () => clearTimeout(renderTimeout);
    }, [intervalState.currentInterval, isLoading, getEndNote, currentQuestionData?.isCorrect]);

    //keep track of question number and update url accordingly
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        params.set("question", currentQuestion.toString());
        //update current URL without causing page reload
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, '', newUrl);
    }, [currentQuestion])

    const handleNextQuestion = () => {
        stopSounds();
        console.log('has updated on handlenext: ', hasUpdated);
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => {
                const newIndex = prev + 1;
                setIntervalState(prevState => ({
                    ...prevState,
                    currentInterval: allQuestions[newIndex]
                }));
                setCurrentQuestion(newIndex + 1);
                setClickedButton(null);
                // setIsCorrect(null);
                // setQuestionAnswered(false); // Reset questionAnswered
                hasUpdated.current = false; // Reset hasUpdated
                return newIndex;
            });
        } else if (currentQuestionIndex === totalQuestions - 1) {
            console.log("moving")
        }
    }

    const handlePreviousQuestion = () => {
        stopSounds();
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => {
                const newIndex = prev - 1;
                setIntervalState(prevState => ({
                    ...prevState,
                    currentInterval: allQuestions[newIndex]
                }));
                setCurrentQuestion(newIndex + 1);
                // Set button states based on stored answer
                const storedAnswer = questionData[newIndex];
                setClickedButton(storedAnswer.index);
                return newIndex;
            });
        }
    }

    //handle timestamping
    const timeSet = (timestamp: 'start' | 'end') => {
        setTimeData(prevTimeData => {
            if (timestamp === 'start') {
                return [
                    ...prevTimeData,
                    { timeStart: Date.now(), timeEnd: 0 }
                ];
            } else if (timestamp === 'end') {
                if (prevTimeData.length > 0) {
                    // Create a new array with the updated last item
                    const updatedTimeData = [...prevTimeData];
                    updatedTimeData[updatedTimeData.length - 1] = {
                        ...updatedTimeData[updatedTimeData.length - 1],
                        timeEnd: Date.now()
                    };
                    return updatedTimeData;
                }
                // Return the previous state if there are no items to update
                return prevTimeData;
            }
            // Default return for safety
            return prevTimeData;
        });
    };


    //create new array of intervals with unique names for answer buttons
    const uniqueIntervalsNames = Array.from(new Set(intervalState.allIntervals.map(interval => interval.name)));
    console.log('question data: ', questionData)
    console.log('time data: ', timeData);

    return (
        <div className="h-screen bg-gray-100 p-4 flex flex-col px-56 pt-16">
            <h1 className="text-3xl font-bold mb-4 text-center">Intervals - Level {level}</h1>

            <div className="flex-grow flex flex-col">
                {/* Music notation area */}
                <div
                    className={`bg-white border-2 border-gray-300 rounded-lg mb-4 flex items-center justify-center flex-grow 
                    ${currentQuestionData?.questionAnswered ? (currentQuestionData?.isCorrect ? 'border-green-500' : 'border-red-500') : ''}`} style={{ maxHeight: '300px' }}>
                    <div id="output"
                        className={`w-full h-full flex flex-grow items-center justify-center`}></div>
                </div>

                {/* Play Interval button */}
                <Button
                    className="w-full mb-4"
                    onClick={() => { playNotes(startNote, endNote, currentIntervalData, level); stopSounds(); }}
                >
                    Play Interval
                </Button>

                {/* Answer options */}
                <div className="grid-container mb-4">
                    {uniqueIntervalsNames.map((name, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            onClick={() => { checkCorrect(currentIntervalData, name, index); timeSet('end') }}
                            disabled={currentQuestionData?.questionAnswered}
                            className={`h-12 hover: ${currentQuestionData?.index === index
                                ? currentQuestionData?.isCorrect
                                    ? 'border-2 border-green-500 bg-green-500 text-white'
                                    : 'border-2 border-red-500 bg-red-500 text-white'
                                : ''
                                }`}
                        >
                            {name}
                        </Button>
                    ))}
                </div>

                {/* Navigation and submit buttons */}
                <div className="flex justify-between mt-4">
                    <Button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestion === 1}
                    >
                        Previous
                    </Button>
                    {
                        currentQuestion === totalQuestions
                            ? <Button asChild>
                                <Link href="../exercise/summary">Submit</Link>
                            </Button>
                            : <Button

                                disabled={!currentQuestionData?.questionAnswered}
                                onClick={() => { handleNextQuestion(); timeSet('start') }}
                            >
                                Next
                            </Button>
                    }

                </div>
            </div>
        </div >
    );
}

export default Exercise;