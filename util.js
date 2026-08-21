/* ===== Küçük yardımcılar ===== */
window.U = {
  ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
  pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  },
  sample(arr, n) { return U.shuffle(arr).slice(0, n); }
};
