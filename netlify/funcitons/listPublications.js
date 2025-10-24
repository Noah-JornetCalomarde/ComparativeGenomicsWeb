const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
  const pubDir = path.join(__dirname, '../../public/publications');
  try {
    const files = fs.readdirSync(pubDir)
      .filter(f => f.endsWith('.md'))
      .map(file => ({
        file,
        title: path.basename(file, '.md')
      }));

    return {
      statusCode: 200,
      body: JSON.stringify(files)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
