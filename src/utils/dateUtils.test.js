import { formatDateToISO, getFormattedDate } from './dateUtils';

describe('Date Utils', () => {
  test('formatDateToISO should format date as YYYY-MM-DD', () => {
    const date = new Date('2024-09-07');
    const expected = '2024-09-07';
    const result = formatDateToISO(date);
    expect(result).toBe(expected);
  });

  test('formatDateToISO should pad single-digit months and days', () => {
    const date = new Date('2024-01-01');
    const expected = '2024-01-01';
    const result = formatDateToISO(date);
    expect(result).toBe(expected);
  });

  test('getFormattedDate should return date in DD MM YYYY format', () => {
    // Mocking Date to ensure consistent results
    const originalDate = Date;
    global.Date = jest.fn(() => new originalDate('2024-09-07'));

    const expected = '07 September 2024';
    const result = getFormattedDate();
    expect(result).toBe(expected);

    // Restore original Date after test
    global.Date = originalDate;
  });


  // test('getFormattedDate should correctly format today\'s date', () => {
  //   // Mocking Date to ensure consistent results
  //   const today = Date;
  //   today = jest.fn(() => new today('2024-09-07'));
  //   const formattedToday = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('en-GB', { month: 'long' })} ${today.getFullYear()}`;

  //   // Mock Date to return a fixed date
  //   const originalDate = Date;
  //   global.Date = jest.fn(() => new originalDate('2024-09-07'));

  //   const result = getFormattedDate();
  //   expect(result).toBe(formattedToday);

  //   // Restore original Date after test
  //   global.Date = originalDate;
  // });

  /*test('getFormattedDate should correctly format today\'s date', () => {
    // Mocking Date to ensure consistent results
    const today = new Date();
    const formattedToday = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('en-GB', { month: 'long' })} ${today.getFullYear()}`;

    // Mock Date to return a fixed date
    const originalDate = Date;
    global.Date = jest.fn(() => new originalDate('2024-09-07'));

    const result = getFormattedDate();
    expect(result).toBe(formattedToday);

    // Restore original Date after test
    global.Date = originalDate;
  });*/

});
