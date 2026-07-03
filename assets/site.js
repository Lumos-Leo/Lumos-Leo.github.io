(function () {
  function setText(id, value) {
    var element = document.getElementById(id);
    if (element && value != null) {
      element.textContent = value;
    }
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
        var title = (item.getAttribute('data-title') || '').toLowerCase();
        var match = entries.find(function (entry) {
          return entry && entry.bib && entry.bib.title &&
            entry.bib.title.toLowerCase() === title;
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
