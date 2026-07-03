(function () {
  function setText(id, value) {
    var element = document.getElementById(id);
    if (element && value != null) {
      element.textContent = value;
    }
  }

  function normalizeTitle(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
  }

  fetch('google-scholar-stats/gs_data.json', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) throw new Error('missing scholar stats');
      return response.json();
    })
    .then(function (data) {
      setText('scholar-citations', data.citedby);
      var publications = data.publications || {};
      var entries = Object.keys(publications).map(function (key) {
        return publications[key];
      });
      document.querySelectorAll('[data-title]').forEach(function (item) {
        var title = normalizeTitle(item.getAttribute('data-title'));
        var match = entries.find(function (entry) {
          if (!entry || !entry.bib || !entry.bib.title) return false;
          var scholarTitle = normalizeTitle(entry.bib.title);
          return scholarTitle === title ||
            scholarTitle.indexOf(title) !== -1 ||
            title.indexOf(scholarTitle) !== -1;
        });
        var target = item.querySelector('.paper-citations');
        if (match && target) {
          target.textContent = match.num_citations || 0;
        }
      });
    })
    .catch(function () {
      setText('scholar-citations', 'auto-updated daily');
    });
})();
