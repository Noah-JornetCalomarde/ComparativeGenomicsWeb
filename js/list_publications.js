import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const pubDir = path.join(process.cwd(), 'public', 'publications');
  try {
    const files = fs.readdirSync(pubDir)
      .filter(f => f.endsWith('.md'))
      .map(file => ({
        file,
        title: path.basename(file, '.md')
      }));
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
