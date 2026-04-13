const fs = require('fs');
const https = require('https');
const path = require('path');

const screens = {
  dashboard: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2FmN2E4YTFmY2M3ZTQyOWQ5OTY1OTljNTU0OTE0ZmE5EgsSBxCG5rbutgoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjExNTc1NDQzNjY1NjM1Mjg4MQ&filename=&opi=89354086',
  login: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2YwY2RlNmU5YWUyOTRlNTI4NzBmMDcxN2UxYmFjZThmEgsSBxCG5rbutgoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjExNTc1NDQzNjY1NjM1Mjg4MQ&filename=&opi=89354086',
  attendance: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzE3MWYyZDM4ZjZmNTQ2ZTFhYzc3MjE2NmM3MGNhM2VlEgsSBxCG5rbutgoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjExNTc1NDQzNjY1NjM1Mjg4MQ&filename=&opi=89354086',
  assignments: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2QwMDQ1ODdkOGY0NzQ3OGNiOTI0MDZmY2UzMDdlNDkzEgsSBxCG5rbutgoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjExNTc1NDQzNjY1NjM1Mjg4MQ&filename=&opi=89354086',
  emails: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzVmOThjNTMyYjQ2MTRkZmU5NmVhODBiZTVjNDhjNzEwEgsSBxCG5rbutgoYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjExNTc1NDQzNjY1NjM1Mjg4MQ&filename=&opi=89354086'
};

const outputDir = path.join(__dirname, 'screens_html');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

Object.entries(screens).forEach(([name, url]) => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      fs.writeFileSync(path.join(outputDir, `${name}.html`), data);
      console.log(`Downloaded ${name}.html`);
    });
  }).on('error', err => {
    console.error(`Error downloading ${name}:`, err.message);
  });
});
