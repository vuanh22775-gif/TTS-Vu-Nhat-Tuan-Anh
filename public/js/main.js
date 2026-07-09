// ===== VIETBLUETOUR - main.js =====
document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Header scroll + mobile drawer ---------- */
  const header = document.getElementById('vbt-header');
  const burger = document.getElementById('vbt-burger');
  const drawerOverlay = document.getElementById('vbt-drawer-overlay');
  const drawerClose = document.getElementById('vbt-drawer-close');
  const drawerLinks = document.querySelectorAll('.vbt-drawer-nav a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  function openDrawer() {
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  burger?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', (e) => {
    if (e.target === drawerOverlay || e.target.classList.contains('vbt-drawer-bg')) closeDrawer();
  });
  drawerLinks.forEach((a) => a.addEventListener('click', closeDrawer));

  /* ---------- Hero search tabs ---------- */
  const domesticDests = ['Đà Nẵng - Hội An', 'Hạ Long - Cát Bà', 'Đà Lạt', 'Nha Trang', 'Phú Quốc', 'Quy Nhơn - Phú Yên', 'Hà Nội - Ninh Bình', 'Sapa', 'Huế', 'Côn Đảo', 'Mũi Né - Phan Thiết'];
  const intlDests = ['Thái Lan', 'Singapore', 'Malaysia', 'Nhật Bản', 'Hàn Quốc', 'Trung Quốc', 'Pháp', 'Ý', 'Mỹ', 'Úc', 'Dubai'];

  const tabButtons = document.querySelectorAll('.vbt-search-tab');
  const destSelect = document.getElementById('vbt-destination');

  function fillDestOptions(list) {
    if (!destSelect) return;
    destSelect.innerHTML = '<option value="">Chọn điểm đến...</option>' +
      list.map((d) => `<option value="${d}">${d}</option>`).join('');
  }
  fillDestOptions(domesticDests);

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      fillDestOptions(btn.dataset.tab === 'international' ? intlDests : domesticDests);
    });
  });

  /* ---------- Hero search button: điều hướng đến trang tour phù hợp ---------- */
  const btnSearch = document.querySelector('.btn-search');
  btnSearch?.addEventListener('click', () => {
    const activeTab = document.querySelector('.vbt-search-tab.active');
    const isIntl = activeTab && activeTab.dataset.tab === 'international';
    const dest = destSelect?.value || '';
    const targetUrl = isIntl ? '/tour-nuoc-ngoai' : '/tour-trong-nuoc';
    window.location.href = dest ? `${targetUrl}?diem-den=${encodeURIComponent(dest)}` : targetUrl;
  });

  /* ---------- Tours horizontal carousel ---------- */
  const toursWrap = document.getElementById('tours-track-wrap');
  const toursTrack = document.getElementById('tours-track');
  const toursPrev = document.getElementById('tours-prev');
  const toursNext = document.getElementById('tours-next');
  const toursDots = document.getElementById('tours-dots');

  if (toursWrap && toursTrack) {
    const cards = Array.from(toursTrack.children);
    const dotButtons = toursDots ? Array.from(toursDots.children) : [];

    function scrollToCard(i) {
      const card = cards[i];
      if (!card) return;
      toursWrap.scrollTo({ left: card.offsetLeft - 24, behavior: 'smooth' });
    }
    function updateActiveDot() {
      const scrollLeft = toursWrap.scrollLeft;
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - 24 - scrollLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      dotButtons.forEach((d, i) => d.classList.toggle('active', i === closest));
    }
    toursPrev?.addEventListener('click', () => toursWrap.scrollBy({ left: -320, behavior: 'smooth' }));
    toursNext?.addEventListener('click', () => toursWrap.scrollBy({ left: 320, behavior: 'smooth' }));
    dotButtons.forEach((d, i) => d.addEventListener('click', () => scrollToCard(i)));
    toursWrap.addEventListener('scroll', () => window.requestAnimationFrame(updateActiveDot));
    updateActiveDot();
  }

  /* ---------- Testimonials carousel ---------- */
  const testiTrack = document.getElementById('testi-track');
  const testiPrev = document.getElementById('testi-prev');
  const testiNext = document.getElementById('testi-next');
  const testiDots = document.getElementById('testi-dots');

  if (testiTrack) {
    const slides = Array.from(testiTrack.children);
    const dotButtons = testiDots ? Array.from(testiDots.children) : [];
    let index = 0;

    function render() {
      const slideWidth = slides[0]?.getBoundingClientRect().width || 0;
      const gap = 20;
      const wrapWidth = testiTrack.parentElement.getBoundingClientRect().width;
      const offset = (wrapWidth - slideWidth) / 2 - index * (slideWidth + gap);
      testiTrack.style.transform = `translateX(${offset}px)`;
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      dotButtons.forEach((d, i) => d.classList.toggle('active', i === index));
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }
    testiPrev?.addEventListener('click', () => goTo(index - 1));
    testiNext?.addEventListener('click', () => goTo(index + 1));
    dotButtons.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
    window.addEventListener('resize', render);
    render();
  }

  /* ---------- Stats count-up ---------- */
  const statEls = document.querySelectorAll('.stat-value[data-value]');
  const statsSection = document.querySelector('.stats-section');
  let statsPlayed = false;

  function playCountUp() {
    if (statsPlayed) return;
    statsPlayed = true;
    statEls.forEach((el) => {
      const target = parseInt(el.dataset.value, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const steps = 60;
      const stepVal = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current = Math.min(current + stepVal, target);
        const display = current >= 10000 ? `${Math.round(current / 1000)}K` : Math.round(current).toLocaleString('vi-VN');
        el.textContent = display + suffix;
        if (current >= target) clearInterval(interval);
      }, duration / steps);
    });
  }
  if (statsSection) {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) playCountUp(); },
      { threshold: 0.3 }
    );
    observer.observe(statsSection);
  }

  /* ---------- CTA form -> lưu Lead vào MongoDB qua API ---------- */
  const ctaForm = document.getElementById('cta-form');
  const ctaSuccess = document.getElementById('cta-success');

  ctaForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('cta-name').value;
    const phone = document.getElementById('cta-phone').value;
    if (!phone.trim()) return;

    const submitBtn = ctaForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();

      if (data.ok) {
        ctaForm.style.display = 'none';
        ctaSuccess.classList.add('show');
        setTimeout(() => {
          ctaForm.reset();
          ctaForm.style.display = '';
          ctaSuccess.classList.remove('show');
          submitBtn.disabled = false;
        }, 4000);
      } else {
        alert(data.message || 'Có lỗi xảy ra, vui lòng thử lại.');
        submitBtn.disabled = false;
      }
    } catch (err) {
      alert('Không thể kết nối tới máy chủ.');
      submitBtn.disabled = false;
    }
  });
});
