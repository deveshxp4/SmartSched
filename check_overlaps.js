// Check if events actually overlap
const sampleSchedule = [
    { activity: "Morning Routine", start: "08:00", end: "12:20" },
    { activity: "Lunch", start: "12:20", end: "13:00" },
    { activity: "Study maths", start: "13:00", end: "13:26" },
    { activity: "Study english", start: "13:26", end: "13:52" },
    { activity: "gaming", start: "13:52", end: "15:52" },
    { activity: "General Study", start: "15:52", end: "17:52" },
];

console.log("=== Checking for overlaps ===\n");

for (let i = 0; i < sampleSchedule.length; i++) {
    for (let j = i + 1; j < sampleSchedule.length; j++) {
        const a = sampleSchedule[i];
        const b = sampleSchedule[j];

        const aStart = a.start.split(':').map(Number);
        const aEnd = a.end.split(':').map(Number);
        const bStart = b.start.split(':').map(Number);
        const bEnd = b.end.split(':').map(Number);

        const aStartMin = aStart[0] * 60 + aStart[1];
        const aEndMin = aEnd[0] * 60 + aEnd[1];
        const bStartMin = bStart[0] * 60 + bStart[1];
        const bEndMin = bEnd[0] * 60 + bEnd[1];

        // Check if they overlap (not just touch)
        if (aStartMin < bEndMin && bStartMin < aEndMin) {
            console.log(`OVERLAP: "${a.activity}" (${a.start}-${a.end}) and "${b.activity}" (${b.start}-${b.end})`);
        }
    }
}

console.log("\nConclusion: These events do NOT overlap - they are sequential!");
console.log("Each event starts exactly when the previous one ends.");
console.log("They should all be FULL WIDTH, not side-by-side.");
