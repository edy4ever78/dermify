import fs from 'fs';
import path from 'path';

export function createBackup(filePath) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'backups');
    const fileName = path.basename(filePath);
    const backupPath = path.join(backupDir, `${fileName}.${timestamp}.backup`);
    
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Copy the file to backup location
    fs.copyFileSync(filePath, backupPath);
    
    // Keep only the last 10 backups for each file
    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.startsWith(fileName))
      .sort()
      .reverse();
    
    if (backupFiles.length > 10) {
      for (let i = 10; i < backupFiles.length; i++) {
        fs.unlinkSync(path.join(backupDir, backupFiles[i]));
      }
    }
    
    return backupPath;
  } catch (error) {
    console.error('Error creating backup:', error);
    return null;
  }
}

export function listBackups() {
  try {
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      return [];
    }
    
    return fs.readdirSync(backupDir)
      .map(file => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          size: stats.size,
          created: stats.mtime
        };
      })
      .sort((a, b) => b.created - a.created);
  } catch (error) {
    console.error('Error listing backups:', error);
    return [];
  }
}
