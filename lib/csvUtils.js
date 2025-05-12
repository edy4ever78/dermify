import fs from 'fs';
import path from 'path';

/**
 * Utility functions for working with CSV data
 */

/**
 * Parse a CSV string into an array of objects
 * @param {string} csvString - The CSV content as a string
 * @param {object} options - Parsing options
 * @returns {Array} Array of objects representing CSV rows
 */
export function parseCSV(csvString, options = {}) {
  const {
    delimiter = ',',
    hasHeader = true,
    trimValues = true,
  } = options;
  
  // Split the CSV into rows
  const rows = csvString.trim().split(/\r?\n/);
  
  if (rows.length === 0) {
    return [];
  }
  
  // Extract headers from the first row if hasHeader is true
  const headers = hasHeader 
    ? parseCSVRow(rows[0], delimiter).map(header => trimValues ? header.trim() : header)
    : [];
  
  // Start parsing from the second row if there are headers, otherwise from the first row
  const startIndex = hasHeader ? 1 : 0;
  const result = [];
  
  // Process each row
  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i].trim();
    if (!row) continue; // Skip empty rows
    
    const values = parseCSVRow(row, delimiter);
    
    if (hasHeader) {
      // Create an object using headers as keys
      const obj = {};
      headers.forEach((header, index) => {
        if (index < values.length) {
          let value = values[index];
          if (trimValues && typeof value === 'string') {
            value = value.trim();
          }
          obj[header] = value;
        }
      });
      result.push(obj);
    } else {
      // Just add the array of values
      result.push(values.map(value => trimValues && typeof value === 'string' ? value.trim() : value));
    }
  }
  
  return result;
}

/**
 * Parse a single CSV row, handling quotes and escapes properly
 * @param {string} row - A single row from a CSV file
 * @param {string} delimiter - The delimiter character
 * @returns {Array} Array of values from the row
 */
function parseCSVRow(row, delimiter) {
  const result = [];
  let currentValue = '';
  let insideQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // This is an escaped quote
        currentValue += '"';
        i++; // Skip the next quote
      } else {
        // This is a quote delimiter
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      // End of field
      result.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Add the last field
  result.push(currentValue);
  
  return result;
}

/**
 * Convert an array of objects to a CSV string
 * @param {Array} data - Array of objects to convert
 * @param {object} options - Conversion options
 * @returns {string} CSV formatted string
 */
export function generateCSV(data, options = {}) {
  if (!data || data.length === 0) {
    return '';
  }
  
  const {
    delimiter = ',',
    includeHeader = true,
  } = options;
  
  // Get headers from the keys of the first object
  const headers = Object.keys(data[0]);
  
  let csv = '';
  
  // Add headers row
  if (includeHeader) {
    csv += headers.map(header => escapeCSVValue(header, delimiter)).join(delimiter) + '\n';
  }
  
  // Add data rows
  for (const row of data) {
    const rowValues = headers.map(header => escapeCSVValue(row[header], delimiter));
    csv += rowValues.join(delimiter) + '\n';
  }
  
  return csv;
}

/**
 * Escape a value for CSV output
 * @param {any} value - Value to escape
 * @param {string} delimiter - The delimiter character
 * @returns {string} Escaped value
 */
function escapeCSVValue(value, delimiter) {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // Check if the value needs to be quoted
  if (
    stringValue.includes(delimiter) || 
    stringValue.includes('"') || 
    stringValue.includes('\n') || 
    stringValue.includes('\r')
  ) {
    // Escape quotes by doubling them and wrap in quotes
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}
