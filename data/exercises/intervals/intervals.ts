//interval data - asc, desc, and harmonic
export const intervalsData = [
    //ascending
    { "name": "min 2", "halfsteps": 1, "format": "ascending" },
    { "name": "maj 2", "halfsteps": 2, "format": "ascending" },
    { "name": "min 3", "halfsteps": 3, "format": "ascending" },
    { "name": "maj 3", "halfsteps": 4, "format": "ascending" },
    { "name": "per 4", "halfsteps": 5, "format": "ascending" },
    { "name": "dim 5", "halfsteps": 6, "format": "ascending" },
    { "name": "per 5", "halfsteps": 7, "format": "ascending" },
    { "name": "min 6", "halfsteps": 8, "format": "ascending" },
    { "name": "maj 6", "halfsteps": 9, "format": "ascending" },
    { "name": "min 7", "halfsteps": 10, "format": "ascending" },
    { "name": "maj 7", "halfsteps": 11, "format": "ascending" },
    { "name": "per 8", "halfsteps": 12, "format": "ascending" },
    { "name": "min 9", "halfsteps": 13, "format": "ascending" },
    { "name": "maj 9", "halfsteps": 14, "format": "ascending" },
    //descending
    { "name": "min 2", "halfsteps": 1, "format": "descending" },
    { "name": "maj 2", "halfsteps": 2, "format": "descending" },
    { "name": "min 3", "halfsteps": 3, "format": "descending" },
    { "name": "maj 3", "halfsteps": 4, "format": "descending" },
    { "name": "per 4", "halfsteps": 5, "format": "descending" },
    { "name": "dim 5", "halfsteps": 6, "format": "descending" },
    { "name": "per 5", "halfsteps": 7, "format": "descending" },
    { "name": "min 6", "halfsteps": 8, "format": "descending" },
    { "name": "maj 6", "halfsteps": 9, "format": "descending" },
    { "name": "min 7", "halfsteps": 10, "format": "descending" },
    { "name": "maj 7", "halfsteps": 11, "format": "descending" },
    { "name": "per 8", "halfsteps": 12, "format": "descending" },
    { "name": "min 9", "halfsteps": 13, "format": "descending" },
    { "name": "maj 9", "halfsteps": 14, "format": "descending" },
    //harmonic
    { "name": "min 2", "halfsteps": 1, "format": "harmonic" },
    { "name": "maj 2", "halfsteps": 2, "format": "harmonic" },
    { "name": "min 3", "halfsteps": 3, "format": "harmonic" },
    { "name": "maj 3", "halfsteps": 4, "format": "harmonic" },
    { "name": "per 4", "halfsteps": 5, "format": "harmonic" },
    { "name": "dim 5", "halfsteps": 6, "format": "harmonic" },
    { "name": "per 5", "halfsteps": 7, "format": "harmonic" },
    { "name": "min 6", "halfsteps": 8, "format": "harmonic" },
    { "name": "maj 6", "halfsteps": 9, "format": "harmonic" },
    { "name": "min 7", "halfsteps": 10, "format": "harmonic" },
    { "name": "maj 7", "halfsteps": 11, "format": "harmonic" },
    { "name": "per 8", "halfsteps": 12, "format": "harmonic" },
    { "name": "min 9", "halfsteps": 13, "format": "harmonic" },
    { "name": "maj 9", "halfsteps": 14, "format": "harmonic" },
]
//level-intervals association
export const levelsIntervals = [
    { level: 1, intervals: ["min 3", "maj 3"], format: ["ascending", "descending"] },
    { level: 2, intervals: ["min 3", "maj 3", "per 5"], format: ["ascending", "descending"] },
    { level: 3, intervals: ["min 3", "maj 3", "per 4", "per 5"], format: ["ascending", "descending"] },
    { level: 4, intervals: ["min 3", "maj 3", "per 4", "per 5", "per 8"], format: ["ascending", "descending"] },
    { level: 5, intervals: ["min 3", "maj 3", "per 4", "per 5", "min 6", "maj 6", "per 8"], format: ["ascending", "descending", "harmonic"] },
    { level: 6, intervals: ["min 3", "maj 3", "per 4", "per 5", "min 6", "maj 6", "min 7", "maj 7", "per 8"], format: ["ascending", "descending", "harmonic"] },
    { level: 7, intervals: ["min 2", "maj 2", "min 3", "maj 3", "per 4", "dim 5", "per 5", "min 6", "maj 6", "min 7", "maj 7", "per 8"], format: ["ascending", "descending", "harmonic"] },
    { level: 8, intervals: ["min 2", "maj 2", "min 3", "maj 3", "per 4", "dim 5", "per 5", "min 6", "maj 6", "min 7", "maj 7", "per 8"], format: ["ascending", "descending", "harmonic"] },
    { level: 9, intervals: ["min 2", "maj 2", "min 3", "maj 3", "per 4", "dim 5", "per 5", "min 6", "maj 6", "min 7", "maj 7", "per 8"], format: ["ascending", "descending", "harmonic"] },
    { level: 10, intervals: ["min 2", "maj 2", "min 3", "maj 3", "per 4", "dim 5", "per 5", "min 6", "maj 6", "min 7", "maj 7", "per 8", "min 9", "maj 9"], format: ["ascending", "descending", "harmonic"] }
]
