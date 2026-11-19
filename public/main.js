(() => {
  'use strict';
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  const toggle = document.querySelector('.theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const currentTheme = () => root.dataset.theme || (preference.matches ? 'dark' : 'light');
  function updateThemeControl() {
    const dark = currentTheme() === 'dark';
    if (toggle) {
      toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
      toggle.title = `Switch to ${dark ? 'light' : 'dark'} theme`;
    }
    const sym = toggle && toggle.querySelector('.theme-symbol');
    if (sym) sym.innerHTML = dark
      ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>'
      : '<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>';
    if (themeColor) themeColor.content = dark ? '#0d0d0f' : '#f7f4ee';
  }
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const theme = currentTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = theme;
      try { localStorage.setItem('theme', theme); } catch (error) { /* Storage is optional. */ }
      updateThemeControl();
    });
  }
  preference.addEventListener('change', updateThemeControl);
  window.addEventListener('storage', event => {
    if (event.key !== 'theme' && event.key !== null) return;
    if (event.newValue === 'dark' || event.newValue === 'light') root.dataset.theme = event.newValue;
    else delete root.dataset.theme;
    updateThemeControl();
  });
  updateThemeControl();

  const clock = document.querySelector('[data-clock]');
  if (clock) {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Panama', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const updateClock = () => {
      const now = new Date();
      clock.textContent = formatter.format(now);
      clock.dateTime = now.toISOString();
    };
    updateClock();
    window.setInterval(updateClock, 1000);
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => {
      // Never hide content already visible on the initial screen.
      if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('is-pending');
      observer.observe(element);
    });
    reducedMotion.addEventListener('change', event => {
      if (event.matches) {
        observer.disconnect();
        document.querySelectorAll('.is-pending').forEach(element => element.classList.remove('is-pending'));
      }
    });
  }
})();

/* Obfuscated e-mail: the address is not in the HTML source and is only decoded and shown when someone clicks "Show email". */
(function(){
  function dec(v){try{return atob(v).split('').reverse().join('')}catch(e){return ''}}
  document.querySelectorAll('[data-mail]').forEach(function(a){
    a.addEventListener('click',function(e){
      if(a.getAttribute('href')&&a.getAttribute('href').indexOf('mailto:')===0)return;
      e.preventDefault();
      var addr=dec(a.getAttribute('data-mail'));if(!addr)return;
      var t=a.querySelector('.mail-text');if(t)t.textContent=addr;
      a.setAttribute('href','mailto:'+addr);a.setAttribute('aria-label','Email '+addr);
    });
  });
})();

(function(){var v=document.querySelector('.bg-video video');if(v&&window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches){v.removeAttribute('autoplay');v.pause();}})();

/* Ticker: static row; shows as many phrases as fit and rotates the rest in a loop. */
(function(){
  var row=document.querySelector('.ticker-row'); if(!row) return;
  var items=[].slice.call(row.children), start=0, timer=null, reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function render(){
    items.forEach(function(t){t.classList.remove('hide','first');});
    var shown=[],i,k,idx;
    for(k=0;k<items.length;k++){
      idx=(start+k)%items.length; var t=items[idx];
      t.classList.toggle('first',shown.length===0);
      t.style.order=k; t.classList.remove('hide');
      if(row.scrollWidth>row.clientWidth+1 && shown.length>0){t.classList.add('hide');t.classList.remove('first');break;}
      shown.push(idx);
    }
    for(i=k+1;i<items.length;i++) items[(start+i)%items.length].classList.add('hide');
    return shown.length;
  }
  function cycle(){
    clearInterval(timer); start=start%items.length; var n=render();
    if(n>=items.length||reduce) return;
    timer=setInterval(function(){ row.classList.add('fade'); setTimeout(function(){ start=(start+render_count())%items.length; render(); row.classList.remove('fade'); },600); },3500);
  }
  function render_count(){ return items.filter(function(t){return !t.classList.contains('hide');}).length||1; }
  window.addEventListener('resize',function(){cycle();});
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(cycle); else cycle();
  const teamDialog = document.getElementById('team');
  const teamOpen = document.querySelector('[data-team]');
  if (teamDialog && teamOpen && teamDialog.showModal) {
    teamOpen.addEventListener('click', () => teamDialog.showModal());
    teamDialog.addEventListener('click', event => { if (event.target === teamDialog) teamDialog.close(); });
  } else if (teamOpen) teamOpen.hidden = true;
})();
