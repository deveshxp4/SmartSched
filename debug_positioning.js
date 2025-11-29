// Debug script to check timetable data structure
const sampleSchedule = [
    { activity: "Morning Routine", start: "08:00", end: "12:20" },
    { activity: "Lunch", start: "12:20", end: "13:00" },
    { activity: "Study maths", start: "13:00", end: "13:26" },
    { activity: "Study english", start: "13:26", end: "13:52" },
    { activity: "gaming", start: "13:52", end: "15:52" },
    { activity: "General Study", start: "15:52", end: "17:52" },
];

console.log("=== Testing Positioning Logic ===\n");

const getMinutes = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

const items = sampleSchedule.map(a => {
    let startMinutes = getMinutes(a.start);
    if (startMinutes === null) startMinutes = 9 * 60;

    let endMinutes = getMinutes(a.end);
    if (endMinutes === null || endMinutes <= startMinutes) {
        endMinutes = startMinutes + 60;
    }

    const pixelsPerMinute = 64 / 60;
    const top = (startMinutes - (6 * 60)) * pixelsPerMinute;
    const height = (endMinutes - startMinutes) * pixelsPerMinute;

    return {
        ...a,
        startMinutes,
        endMinutes,
        top,
        height: Math.max(height, 20)
    };
}).sort((a, b) => a.startMinutes - b.startMinutes);

console.log("Parsed items:");
items.forEach(item => {
    console.log(`${item.activity}: ${item.start}-${item.end} => top:${item.top.toFixed(1)}px, height:${item.height.toFixed(1)}px`);
});

// Group connected components
const groups = [];
if (items.length > 0) {
    let currentGroup = [items[0]];
    let maxEnd = items[0].endMinutes;

    for (let i = 1; i < items.length; i++) {
        const item = items[i];
        if (item.startMinutes < maxEnd) {
            currentGroup.push(item);
            if (item.endMinutes > maxEnd) maxEnd = item.endMinutes;
        } else {
            groups.push(currentGroup);
            currentGroup = [item];
            maxEnd = item.endMinutes;
        }
    }
    groups.push(currentGroup);
}

console.log(`\n=== Found ${groups.length} groups ===`);
groups.forEach((group, idx) => {
    console.log(`\nGroup ${idx + 1}:`);
    group.forEach(item => {
        console.log(`  - ${item.activity} (${item.start}-${item.end})`);
    });
});

// Column packing
groups.forEach((group, groupIndex) => {
    const columns = [];
    group.forEach(item => {
        let placed = false;
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            const lastItem = col[col.length - 1];
            if (lastItem.endMinutes <= item.startMinutes) {
                col.push(item);
                item.colIndex = i;
                placed = true;
                break;
            }
        }
        if (!placed) {
            columns.push([item]);
            item.colIndex = columns.length - 1;
        }
    });

    const widthPercent = 100 / columns.length;

    console.log(`\n=== Group ${groupIndex + 1} Layout (${columns.length} columns) ===`);
    group.forEach((item, index) => {
        const leftPercent = item.colIndex * widthPercent;
        console.log(`${item.activity}: left:${leftPercent.toFixed(1)}%, width:${widthPercent.toFixed(1)}%, top:${item.top.toFixed(1)}px`);
    });
});
