import { useEffect, useState } from 'react';
import eventEmitter from './eventEmitter';

export default function useOpenAiKey() {
  const [apiKey, setApiKey] = useState(null);

  const getApiKey = () => {
    const apiKey = JSON.parse(localStorage.getItem('settings') as string)?.apiKey || null;
    setApiKey(apiKey);
  };

  useEffect(() => {
    getApiKey();

    eventEmitter.on('refreshSettings', getApiKey);
    return () => {
      eventEmitter.off('refreshSettings', getApiKey);
    };
  }, []);

  return apiKey;
}
