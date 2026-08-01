import { useEffect } from 'react';

// Mereplikasi efek reveal-on-scroll dan parallax hero dari script.js versi lama.
//
// Catatan: hook ini dipasang sekali di <App>, tapi konten ber-class ".reveal"
// baru muncul ke DOM belakangan (setelah login berhasil, atau setelah data
// paket/pembayaran selesai di-fetch dari backend). Karena itu kita tidak bisa
// hanya query ".reveal" sekali di awal — dipakai MutationObserver supaya
// elemen ".reveal" yang muncul kapan pun tetap otomatis ikut diobservasi.
export function useScrollEffects() {
  useEffect(() => {
    const observed = new WeakSet();

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), index * 100);
            intersectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    function observeWithin(root) {
      root.querySelectorAll('.reveal').forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          intersectionObserver.observe(el);
        }
      });
    }

    // Observasi elemen ".reveal" yang sudah ada saat ini
    observeWithin(document);

    // Pantau DOM untuk elemen ".reveal" baru yang muncul belakangan
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return; // hanya elemen, bukan teks/komentar
          if (node.classList?.contains('reveal') && !observed.has(node)) {
            observed.add(node);
            intersectionObserver.observe(node);
          }
          observeWithin(node);
        });
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    function onScroll() {
      const scrolled = window.pageYOffset;
      const heroBg = document.querySelector('.hero-bg img');
      if (heroBg && scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      mutationObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);
}
