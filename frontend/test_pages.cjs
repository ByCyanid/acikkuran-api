const http = require('http');

const fetchPage = (pageNumber) => new Promise((resolve, reject) => {
  http.get(`http://localhost:3112/page/${pageNumber}?author=105`, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('error', err => reject(err));
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        resolve(parsed.data || []);
      } catch (err) {
        resolve([]);
      }
    });
  }).on('error', err => reject(err));
});

async function run() {
  for (let i = 0; i <= 6; i++) {
    try {
      const data = await fetchPage(i);
      const filtered = (data || []).filter(v => v.page === i);
      console.log(`Frontend Page ${i}: API returned ${data.length} items. Filtered to v.page === ${i}: ${filtered.length} items.`);
      const uniquePages = [...new Set((data || []).map(v => v.page))];
      console.log(`  -> Unique v.page values in response: ${uniquePages.join(', ')}`);
    } catch (e) {
      console.log(`Error on page ${i}:`, e.message);
    }
  }
}

run();
