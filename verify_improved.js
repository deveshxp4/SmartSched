
const activities = [
    { start: "13:00", end: "13:26", name: "Study maths" },
    { start: "13:26", end: "13:52", name: "Study english" },
    { start: "13:52", end: "15:52", name: "gaming" },
    { start: "16:00", end: "17:00", name: "Overlap 1" },
    { start: "16:30", end: "17:30", name: "Overlap 2" }
];

function verifyImproved(activities) {
    // 1. Parse and Sort
    const items = activities.map(a => {
        const getMinutes = (timeStr) => {
            if (!timeStr) return 0;
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        };
        const startMinutes = getMinutes(a.start || a.startTime);
        const endMinutes = getMinutes(a.end || a.endTime);

        // 64px per hour = 64/60 px per minute
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

    // 2. Group connected components
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

    // 3. Process each group
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

        // Assign final positions
        const widthPercent = 100 / columns.length;
        group.forEach(item => {
            item.leftPercent = item.colIndex * widthPercent;
            item.widthPercent = widthPercent;

            console.log(`Group ${groupIndex}, Activity: ${item.name}`);
            console.log(`  Top: ${item.top.toFixed(2)}, Height: ${item.height.toFixed(2)}`);
            console.log(`  Left: ${item.leftPercent}%, Width: ${item.widthPercent}%`);
        });
    });
}

verifyImproved(activities);
