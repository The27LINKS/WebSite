(function () {
  async function loadPartials() {
    const nodes = document.querySelectorAll('[data-include]');
    
    // Fetch all partials in parallel for speed
    await Promise.all(Array.from(nodes).map(async (el) => {
      try {
        const res = await fetch(el.dataset.include);
        if (res.ok) {
          el.outerHTML = await res.text();
        } else {
          console.warn(`Failed to load partial: ${el.dataset.include}`);
        }
      } catch (e) { 
        console.error(`Error fetching partial: ${el.dataset.include}`, e);
      }
    }));

    // After injection, tag year + active link
    document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
    
    const path = location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.main-nav a').forEach(a => {
      const href = a.getAttribute('href');
      if ((href === '/' && path === '/') || (href && href !== '/' && path.startsWith(href.replace('.html', '')))) {
        a.classList.add('active');
      }
    });
    
    // Broadcast an event so other scripts know the header/footer exist now
    document.dispatchEvent(new Event('partials:ready'));
  }

  // Run as soon as the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPartials);
  } else {
    loadPartials();
  }
})();

//------------This Below script will be used to fetch the Header and Footer ----------------
fetch("../partials/header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;
  })
  .catch(err => console.error(err));

fetch("../partials/footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  })
  .catch(err => console.error(err));