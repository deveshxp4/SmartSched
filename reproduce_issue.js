
const activities = [
    { start: "13:00", end: "13:26", name: "Study maths" },
    { start: "13:26", end: "13:52", name: "Study english" },
    { start: "13:52", end: "15:52", name: "gaming" }
];

function render(activities) {
    const timeSlots = {};
    const positionedActivities = [];

    activities.forEach((activity, actIndex) => {
        const startHour = parseInt(activity.start?.split(':')[0] || "9");
        const endHour = parseInt(activity.end?.split(':')[0] || (startHour + 1));
        const duration = endHour - startHour;

        const topPosition = (startHour - 6) * 64;
        const height = duration * 64;

        console.log(`Activity: ${activity.name}`);
        console.log(`  Start: ${activity.start}, End: ${activity.end}`);
        console.log(`  StartHour: ${startHour}, EndHour: ${endHour}`);
        console.log(`  Duration (hours): ${duration}`);
        console.log(`  Top: ${topPosition}, Height: ${height}`);

        if (!timeSlots[startHour]) {
            timeSlots[startHour] = { count: 0, maxWidth: 0 };
        }

        const slot = timeSlots[startHour];
        const activityWidth = slot.count === 0 ? 'calc(100% - 8px)' : 'calc(50% - 6px)';
        const leftPosition = slot.count === 0 ? '4px' : 'calc(50% + 2px)';

        console.log(`  Left: ${leftPosition}, Width: ${activityWidth}`);

        slot.count += 1;
    });
}

render(activities);
