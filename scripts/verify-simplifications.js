const pages = ['/', '/verify', '/dashboard', '/settings'];

(async () => {
  for (const p of pages) {
    const res = await fetch('http://localhost:3000' + p);
    const html = await res.text();
    console.log('=== Page: ' + p + ' ===');
    console.log('  RAG 2.0 present: ' + html.includes('RAG 2.0'));
    console.log('  Outperforms present: ' + html.includes('Outperforms'));
    console.log('  Password input present: ' + html.includes('type="password"'));
    console.log('  Reports nav link present: ' + html.includes('href="/reports"'));
    console.log('  Dashboard link present: ' + html.includes('href="/dashboard"'));
  }
})();
