export default function getOpenAIBaseUrl() {
  return process.env.OPENAI_API_PROXY || 'https://api.openai.com';
}
