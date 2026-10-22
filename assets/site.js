(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-nav');
  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menüyü aç');
    menu.hidden = true;
    document.body.classList.remove('menu-open');
  }
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
  const media = matchMedia('(min-width: 761px)');
  media.addEventListener('change', event => { if (event.matches) closeMenu(); });
  document.querySelectorAll('.faq-list').forEach(list => {
    list.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', () => {
      if (detail.open) list.querySelectorAll('details').forEach(other => { if (other !== detail) other.open = false; });
    }));
  });
  const form = document.querySelector('#request-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const service = String(data.get('service') || '').trim();
    const district = String(data.get('district') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!district) { form.querySelector('#district').setCustomValidity('Lütfen ilçe veya mahalle bilginizi yazın.'); form.reportValidity(); return; }
    const text = [name ? `Merhaba, ben ${name}.` : 'Merhaba.', `${service} hizmeti için bilgi almak istiyorum.`, `İlçe / mahalle: ${district}`, message ? `Notum: ${message}` : '', 'Fiyat ve randevu bilgisi paylaşabilir misiniz?'].filter(Boolean).join('\n');
    document.querySelector('#prepared-message').href = `https://wa.me/905066792471?text=${encodeURIComponent(text)}`;
    document.querySelector('#message-preview').textContent = text;
    document.querySelector('#form-result').hidden = false;
    document.querySelector('#form-result').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  });
  form?.querySelector('#district').addEventListener('input', event => event.target.setCustomValidity(''));
  // Invalidate an old preview whenever the visitor edits the draft.
  form?.addEventListener('input', () => { document.querySelector('#form-result').hidden = true; });
  form?.addEventListener('change', () => { document.querySelector('#form-result').hidden = true; });
})();
