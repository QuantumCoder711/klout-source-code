export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long', // Day of the week (e.g., "Friday")
        day: '2-digit', // Day of the month (e.g., "14")
        month: 'short', // Short month name (e.g., "Feb")
        year: 'numeric', // Full year (e.g., "2025")
    };
    const formattedDate = date.toLocaleDateString('en-GB', options);

    // Manually adding commas between parts of the date string
    const parts = formattedDate.split(' ');
    return `${parts[0]}, ${parts[1]} ${parts[2]}, ${parts[3]}`;
};

export const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours, 10);  // Convert the hour to number
    const minute = parseInt(minutes, 10);  // Convert the minute to number
    const ampm = hour >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    if (hour > 12) {
        hour = hour - 12;
    } else if (hour === 0) {
        hour = 12; // Handle 00:xx (midnight case)
    }

    // Format hours and minutes to ensure they have two digits
    const formattedHour = String(hour < 10 ? `0${hour}` : hour);
    const formattedMinutes = String(minute < 10 ? `0${minute}` : minute);
    const generatedTime = { formattedHour, formattedMinutes, ampm };

    return generatedTime;
};