import { useState, useCallback } from 'react';
import type { FileInfo } from '../components/Sidebar';

const API_BASE = 'http://localhost:3001';

export function useFiles() {
  const [files, setFiles] = useState<FileInfo[]>([]);

  const fetchFiles = useCallback(() => {
    fetch(`${API_BASE}/api/files`)
      .then((res) => res.json())
      .then(async (data: unknown) => {
        if (!Array.isArray(data)) return;

        const normalized: FileInfo[] = data.map((item: unknown) => {
          if (typeof item === 'string') {
            const clean = item.replace(/^\.\.\/web\//, '');
            return { path: clean, size: 0, sourcePath: item };
          }
          const obj = item as { path?: string; size?: number; sourcePath?: string };
          const rawPath = obj.path || '';
          const clean = rawPath.replace(/^\.\.\/web\//, '');
          return {
            path: clean,
            size: obj.size || 0,
            sourcePath: obj.sourcePath || rawPath,
          };
        });

        // Fetch file sizes via HEAD requests for files that have size 0
        const withSizes = await Promise.all(
          normalized.map(async (file) => {
            if (file.size > 0) return file;
            try {
              const res = await fetch(`${API_BASE}/${file.path}`, {
                method: 'HEAD',
              });
              const len = res.headers.get('content-length');
              return { ...file, size: len ? parseInt(len, 10) : 0 };
            } catch {
              return file;
            }
          })
        );

        setFiles(withSizes);
      })
      .catch(console.error);
  }, []);

  const filePaths = files.map((f) => f.path);

  return { files, filePaths, fetchFiles };
}
