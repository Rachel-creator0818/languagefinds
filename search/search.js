const query = new URLSearchParams(location.search).get('s')?.trim() || '';
const field = document.querySelector('#query');
const status = document.querySelector('#status');
const results = document.querySelector('#results');
field.value = query;
if (query) {
  const terms = query.toLowerCase().split(/\s+/);
  fetch('index.json').then(response => {
    if (!response.ok) throw new Error('Search index unavailable');
    return response.json();
  }).then(pages => {
    const matches = pages.filter(({title, text}) => {
      const content = (title + ' ' + text).toLowerCase();
      return terms.every(term => content.includes(term));
    }).sort((a, b) => Number(b.title.toLowerCase().includes(query.toLowerCase())) -
                       Number(a.title.toLowerCase().includes(query.toLowerCase())));
    status.textContent = matches.length === 1 ? '1 result' : matches.length + ' results';
    for (const page of matches) {
      const row = document.createElement('li');
      const link = document.createElement('a');
      link.href = '../' + page.path;
      link.textContent = page.title;
      row.append(link);
      results.append(row);
    }
  }).catch(() => { status.textContent = 'Search is temporarily unavailable.'; });
}
