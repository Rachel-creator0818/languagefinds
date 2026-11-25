document.addEventListener('DOMContentLoaded', function () {
  var nav = document.querySelector('.rwa-article-toc-links');
  var content = document.querySelector('.rwa-final-article-body .wp-block-post-content');
  if (!nav || !content) return;

  var progress = document.querySelector('.rwa-reading-progress span');
  var progressFrame = 0;
  var updateProgress = function () {
    cancelAnimationFrame(progressFrame);
    progressFrame = requestAnimationFrame(function () {
      if (!progress) return;
      var article = document.querySelector('main');
      var start = article ? article.offsetTop : 0;
      var distance = Math.max((article ? article.offsetHeight : document.documentElement.scrollHeight) - window.innerHeight, 1);
      var value = Math.min(Math.max((window.scrollY - start) / distance, 0), 1);
      progress.style.transform = 'scaleX(' + value + ')';
    });
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  var toc = nav.closest('.rwa-article-toc');
  var headings = Array.prototype.slice.call(content.querySelectorAll('h2')).filter(function (heading) {
    var label = heading.textContent.trim().toLowerCase();
    return !/^(table of contents|contents|on this page)$/.test(label);
  });
  if (!headings.length) {
    if (toc) toc.hidden = true;
    return;
  }

  if (toc && window.matchMedia('(max-width: 960px)').matches) {
    toc.removeAttribute('open');
  }

  headings.forEach(function (heading, index) {
    if (!heading.id) heading.id = 'section-' + String(index + 1).padStart(2, '0');
    var link = document.createElement('a');
    var number = document.createElement('span');
    var label = document.createElement('span');
    link.href = '#' + heading.id;
    number.className = 'rwa-article-toc-number';
    number.textContent = String(index + 1).padStart(2, '0');
    label.className = 'rwa-article-toc-label';
    label.textContent = heading.textContent.trim();
    link.appendChild(number);
    link.appendChild(label);
    link.addEventListener('click', function () {
      if (toc && window.matchMedia('(max-width: 960px)').matches) toc.removeAttribute('open');
    });
    nav.appendChild(link);
  });

  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 });

  headings.forEach(function (heading) { observer.observe(heading); });
});
