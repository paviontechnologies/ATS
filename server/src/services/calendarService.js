import crypto from 'crypto';

export class CalendarService {
  /**
   * Computes available interview slots for a given date range
   */
  static getAvailableSlots(startDate = new Date(), daysCount = 5) {
    const slots = [];
    const start = new Date(startDate);

    for (let d = 1; d <= daysCount; d++) {
      const currentDay = new Date(start);
      currentDay.setDate(start.getDate() + d);
      
      // Skip weekends
      if (currentDay.getDay() === 0 || currentDay.getDay() === 6) continue;

      const dateStr = currentDay.toISOString().split('T')[0];
      // Available slots at 10:00 AM, 2:00 PM, 4:00 PM
      const times = ['10:00:00', '14:00:00', '16:00:00'];

      times.forEach(t => {
        const slotStart = new Date(`${dateStr}T${t}Z`);
        const slotEnd = new Date(slotStart.getTime() + 45 * 60 * 1000); // 45 min duration
        slots.push({
          slotId: `slot_${crypto.randomBytes(6).toString('hex')}`,
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          displayDate: currentDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          displayTime: slotStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }) + ' UTC',
          durationMinutes: 45,
          isAvailable: true
        });
      });
    }

    return slots;
  }

  /**
   * Generates secure video meeting URL and calendar event ID
   */
  static generateMeetingDetails(candidateName, roleTitle) {
    const meetingRoomId = `meet-${crypto.randomBytes(4).toString('hex')}-${crypto.randomBytes(4).toString('hex')}`;
    return {
      meetingUrl: `https://meet.google.com/${meetingRoomId}`,
      calendarEventId: `cal_evt_${crypto.randomBytes(8).toString('hex')}`,
      dialInPhone: '+1 415-555-0199',
      dialInPin: '482 193 841#'
    };
  }
}
