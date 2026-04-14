import { useState, useCallback } from 'react';

const API_BASE = 'http://localhost:3001';

export function useFiles() {
  const [files, setFiles] = useState<string[]>([]);

  const fetchFiles = useCallback(() => {
    fetch(`${API_BASE}/api/files`)
      .then((res) => res.json())
      .then(setFiles)
      .catch(console.error);
  }, []);

  /**
   * Groups flat file paths into { folderName: [paths] }.
   * Files without a slash fall into "root".
   */
  const groupedFiles = files.reduce<Record<string, string[]>>((acc, file) => {
    const folder = file.includes('/') ? file.split('/')[1] : 'root';
    (acc[folder] ??= []).push(file);
    return acc;
  }, {});

  return { files, groupedFiles, fetchFiles };
}
