import { createContext } from 'react';
import FileItem from '../constants/fileItem';

export const CurrentFileContext = createContext<FileItem | null>(null);
