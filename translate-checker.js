#!/usr/bin/env node
/**
 * Translation Helper Script
 * This script helps identify pages that need translation updates
 */

const fs = require('fs');
const path = require('path');

// Find all page.js files
function findPageFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findPageFiles(fullPath, files);
    } else if (item === 'page.js') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Check if a file uses translations
function checkTranslationUsage(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const hasUseTranslation = content.includes('useTranslation');
  const hasTranslationCalls = content.includes('t(');
  const hasHardcodedText = /['"]\w+\s+\w+['"]/g.test(content);
  
  return {
    path: filePath,
    hasUseTranslation,
    hasTranslationCalls,
    hasHardcodedText,
    needsTranslation: !hasUseTranslation || !hasTranslationCalls
  };
}

console.log('🔍 Scanning for pages that need translation...\n');

const appDir = path.join(__dirname, 'app');
const pageFiles = findPageFiles(appDir);

console.log(`Found ${pageFiles.length} page files:\n`);

const results = pageFiles.map(checkTranslationUsage);

// Pages that need translation work
const needsWork = results.filter(r => r.needsTranslation);
const alreadyTranslated = results.filter(r => !r.needsTranslation);

console.log('✅ Pages with translations:');
alreadyTranslated.forEach(page => {
  console.log(`  ${page.path.replace(__dirname + '\\', '')}`);
});

console.log('\n🚧 Pages that need translation work:');
needsWork.forEach(page => {
  console.log(`  ${page.path.replace(__dirname + '\\', '')}`);
  if (!page.hasUseTranslation) console.log('    - Add useTranslation import');
  if (!page.hasTranslationCalls) console.log('    - Replace hardcoded text with t() calls');
});

console.log(`\n📊 Summary: ${alreadyTranslated.length} translated, ${needsWork.length} need work`);
