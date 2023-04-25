export default function useOpenAiKey() {
  return JSON.parse(localStorage.getItem('settings') as string)?.apiKey || null;
}
