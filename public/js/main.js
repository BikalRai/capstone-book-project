const nav = document.querySelector('nav');

const getWidth = () => window.innerWidth;

window.addEventListener('resize', () => {
  const width = getWidth();

  width >= 500
    ? nav.classList.add('container')
    : nav.classList.remove('container');
});
