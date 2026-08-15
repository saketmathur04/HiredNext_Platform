
const fs = require('fs');

async function main() {
  const env = fs.readFileSync('.env.local', 'utf-8');
  const apiKey = env.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.*)/)[1].trim();
  
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  console.log(data.models.map(m => m.name).join('\n'));
}
main();
