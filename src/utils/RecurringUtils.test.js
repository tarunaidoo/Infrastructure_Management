import { addWeeksToDate } from './RecurringUtils';

describe('Recurring Utils - addWeeksToDate', () => {
  test('should correctly add 0 weeks to the given date', () => {
    const initialDate = new Date('2024-09-07');
    const result = addWeeksToDate(initialDate, 0);
    const expectedDate = new Date('2024-09-07');
    expect(result).toEqual(expectedDate);
  });

  test('should correctly add 1 week to the given date', () => {
    const initialDate = new Date('2024-09-07');
    const result = addWeeksToDate(initialDate, 1);
    const expectedDate = new Date('2024-09-14');
    expect(result).toEqual(expectedDate);
  });

  test('should correctly add multiple weeks to the given date', () => {
    const initialDate = new Date('2024-09-07');
    const result = addWeeksToDate(initialDate, 4);
    const expectedDate = new Date('2024-10-05');
    expect(result).toEqual(expectedDate);
  });

  test('should handle negative weeks (subtract weeks) correctly', () => {
    const initialDate = new Date('2024-09-07');
    const result = addWeeksToDate(initialDate, -2);
    const expectedDate = new Date('2024-08-24');
    expect(result).toEqual(expectedDate);
  });

  test('should not modify the original date object', () => {
    const initialDate = new Date('2024-09-07');
    const initialDateCopy = new Date(initialDate); // Make a copy of the original date
    addWeeksToDate(initialDate, 3);
    expect(initialDate).toEqual(initialDateCopy); // Check that the original date is unchanged
  });

  test('should handle edge cases with date overflow (e.g., month transition)', () => {
    const initialDate = new Date('2024-01-30'); // Near month end
    const result = addWeeksToDate(initialDate, 1); // Add 1 week, should transition to next month
    const expectedDate = new Date('2024-02-06');
    expect(result).toEqual(expectedDate);
  });

  test('should handle leap year cases correctly', () => {
    const initialDate = new Date('2024-02-29'); // Leap year date
    const result = addWeeksToDate(initialDate, 1);
    const expectedDate = new Date('2024-03-07');
    expect(result).toEqual(expectedDate);
  });
});
