const parseDateString = (dateStr: string): Date => {
  const currentYear = new Date().getFullYear();
  const completeDateStr = `${dateStr} ${currentYear}`;
  const parsedDate = new Date(Date.parse(completeDateStr));

  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date string');
  }

  return parsedDate;
};

try {
  const parsedDate = parseDateString('Aug 30');
  console.log(`Parsed date: ${parsedDate.toISOString()}`);
} catch (error) {
  console.error(`Error parsing date: ${error.message}`);
}
