import { generateTimeOptions } from './timeUtils';

describe('Time Utils - generateTimeOptions', () => {
  test('should generate 24 time options starting from 08:00', () => {
    const result = generateTimeOptions();
    expect(result.length).toBe(24); // Expect 24 options
  });

  test('should start at 08:00 and end at 19:30', () => {
    const result = generateTimeOptions();
    expect(result[0]).toBe('08:00'); // Check first time option
    expect(result[result.length - 1]).toBe('19:30'); // Check last time option
  });

  test('should generate options in 30-minute increments without seconds', () => {
    const result = generateTimeOptions();

    const expectedTimes = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
    ];

    expect(result).toEqual(expectedTimes); // Compare directly with full time format
  });

  test('should not generate times outside of the 08:00 to 19:30 range', () => {
    const result = generateTimeOptions();
    const outOfBounds = result.some(
      time => time < '08:00' || time > '19:30' // Update to reflect the new end time
    );
    expect(outOfBounds).toBe(false);
  });
});
