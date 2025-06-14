/**
 * Formats a date string into a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string (e.g., "January 1, 2023")
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Truncates text to a specified length and adds an ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Extracts the first paragraph from markdown content
 * @param {string} markdown - Markdown content
 * @returns {string} First paragraph of plain text
 */
export const extractFirstParagraph = (markdown) => {
  if (!markdown) return '';
  
  // Remove code blocks first to avoid splitting them
  const withoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, '');
  
  // Get the first paragraph (text until double newline)
  const firstParagraph = withoutCodeBlocks.split('\n\n')[0] || '';
  
  // Remove markdown syntax (basic implementation)
  return firstParagraph
    .replace(/[#*_`\[\]]/g, '') // Remove markdown syntax
    .replace(/\s+/g, ' ')        // Collapse multiple spaces
    .trim();
};

/**
 * Generates a slug from a string
 * @param {string} str - The string to convert to a slug
 * @returns {string} URL-friendly slug
 */
export const slugify = (str) => {
  if (!str) return '';
  
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-')  // Replace spaces and underscores with a single dash
    .replace(/^-+|-+$/g, '');  // Trim dashes from start/end
};

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - Time to wait in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validates an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Checks if a password meets complexity requirements
 * @param {string} password - Password to validate
 * @returns {Object} Object with validation results
 */
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= minLength;
  
  return {
    isValid: hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    isLongEnough,
  };
};

/**
 * Gets the initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (e.g., "JD" for "John Doe")
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Converts a file to base64 string
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 string representation of the file
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Formats a number with commas as thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
