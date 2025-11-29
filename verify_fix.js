
const activities = [
    { start: "13:00", end: "13:26", name: "Study maths" },
    { start: "13:26", end: "13:52", name: "Study english" },
    { start: "13:52", end: "15:52", name: "gaming" },
    { start: "16:00", end: "17:00", name: "Overlap 1" },
    { start: "16:30", end: "17:30", name: "Overlap 2" }
];

function verify(activities) {
    // Create a copy of activities to sort and modify
    const items = activities.map(a => ({ ...a })).sort((a, b) => {
        const getMinutes = (timeStr) => {
            if (!timeStr) return 0;
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        };
        return getMinutes(a.start || a.startTime) - getMinutes(b.start || b.startTime);
    });

    const columns = [];

    items.forEach(item => {
        const timeStr = item.start || item.startTime || "09:00";
        const endTimeStr = item.end || item.endTime || "10:00";

        const [startHour, startMin] = timeStr.split(':').map(Number);
        const [endHour, endMin] = endTimeStr.split(':').map(Number);

        const startTotalMinutes = startHour * 60 + startMin;
        const endTotalMinutes = endHour * 60 + endMin;
        const durationMinutes = endTotalMinutes - startTotalMinutes;

        // 64px per hour = 64/60 px per minute
        const pixelsPerMinute = 64 / 60;
        const top = (startTotalMinutes - (6 * 60)) * pixelsPerMinute;
        const height = durationMinutes * pixelsPerMinute;

        item.top = top;
        item.height = Math.max(height, 20); // Minimum height for visibility
        item.startMinutes = startTotalMinutes;
        item.endMinutes = endTotalMinutes;

        // Find the first column where this item fits
        let placed = false;
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            const lastItem = col[col.length - 1];
            // If the last item in this column ends before or when this item starts
            if (lastItem.endMinutes <= item.startMinutes) {
                col.push(item);
                item.colIndex = i;
                placed = true;
                break;
            }
        }

        // If it doesn't fit in any existing column, create a new one
        if (!placed) {
            columns.push([item]);
            item.colIndex = columns.length - 1;
        }
    });

    items.forEach((item, index) => {
        const widthPercent = 100 / columns.length;
        const leftPercent = item.colIndex * widthPercent;

        console.log(`Activity: ${item.name}`);
        console.log(`  Start: ${item.start}, End: ${item.end}`);
        console.log(`  Top: ${item.top.toFixed(2)}, Height: ${item.height.toFixed(2)}`);
        console.log(`  ColIndex: ${item.colIndex}, Left: ${leftPercent}%, Width: ${widthPercent}%`);
    });
}

verify(activities);
