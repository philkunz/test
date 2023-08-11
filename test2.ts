function convertToISO(dateTimeStr) {
  // Split the date and time
  let [datePart, timePart] = dateTimeStr.split(" ");

  // Extract components
  let [day, month, year] = datePart.split(".");
  let [hour, minute, second] = timePart.split(":");

  // Create a new Date object (Note: month is 0-indexed in JavaScript)
  let dateObj = new Date(year, month - 1, day, hour, minute, second);

  // Return the ISO string
  return dateObj.toISOString();
}

// Test
let input = "20.03.2023 19:05:00";
console.log(convertToISO(input));  // Expected output: "2023-03-20T19:05:00.000Z"
