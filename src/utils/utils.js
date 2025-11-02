export const numberWithCommas = x => {
  // Handle null, undefined, or non-numeric values
  if (x === null || x === undefined || x === '') {
    return '0';
  }
  
  // Convert to number if string
  const num = typeof x === 'string' ? parseFloat(x) : x;
  
  // Check if valid number
  if (isNaN(num)) {
    return '0';
  }
  
  // Format with commas
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

