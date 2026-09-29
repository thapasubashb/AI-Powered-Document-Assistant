import { GoogleGenAI } from '@google/genai'
import { readFileSync } from 'fs'

// Minimal .env.local parser — avoids adding dotenv just for this
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]
    })
)

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })
const pager = await ai.models.list()

const chatModels = []
for await (const m of pager) {
  const methods = m.supportedActions ?? m.supportedGenerationMethods ?? []
  if (methods.includes('generateContent') && m.name.includes('gemini')) {
    chatModels.push(m.name.replace('models/', ''))
  }
}

console.log('\nModels available for your key (generateContent):\n')
chatModels.sort().forEach((n) => console.log('  •', n))
console.log('\nTotal:', chatModels.length)