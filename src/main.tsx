import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Command } from '@tauri-apps/api/shell';
const command = Command.sidecar('binaries/backend_server');

// 启动py应用
command.execute();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
