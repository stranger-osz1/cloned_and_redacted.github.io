document.addEventListener('DOMContentLoaded', () => {
  const randHue = Math.floor(Math.random() * 360);
  document.body.style.setProperty('--hue', randHue);
  let textColor = randHue > 180 ? '#000000' : '#ffffff';

  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentNode;
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;

  let x, y, dx, dy, radius;
  const init = () => {
    if (isMobile()) {
      radius = 140;
    } else {
      radius = 200;
    }
    x = radius + Math.floor(Math.random() * (canvas.width - radius * 2));
    y = radius + Math.floor(Math.random() * (canvas.height - radius * 2));
    dx = Math.random() > 0.5 ? -100 : 100; 
    dy = Math.random() > 0.5 ? -100 : 100;
  };

  let lastTime = performance.now(); 

  const move = (elapsedTime) => {
    const deltaTime = elapsedTime - lastTime;
    const speed = 0.2;
    x += (dx * deltaTime) / 1000 * speed; 
    y += (dy * deltaTime) / 1000 * speed;
    if (x + radius > canvas.width || x - radius < 0) dx = -dx;
    if (y + radius > canvas.height - 60 || y - radius < 0) dy = -dy;
  };

  const blurredCanvas = document.createElement('canvas');
  const blurredCtx = blurredCanvas.getContext('2d');
  blurredCanvas.width = canvas.width;
  blurredCanvas.height = canvas.height;

  const projectsEl = document.querySelector('#projects');

  const updateBgColor = () => {
    const windowHeight = window.innerHeight;
    const projectsRect = projectsEl.getBoundingClientRect();
    const isProjectsVisible = projectsRect.top <= windowHeight / 2 && projectsRect.bottom >= 0;

    if (isProjectsVisible) {
      document.documentElement.style.setProperty('--bg', `hsl(${randHue}, 100%, 40%)`);
      document.documentElement.style.setProperty('--text-color', '#ffffff');
    } else {
      document.documentElement.style.setProperty('--bg', `hsl(${randHue}, 0%, 90%)`);
      document.documentElement.style.setProperty('--text-color', '#000000');
    }
  };

  window.addEventListener('scroll', updateBgColor);
  updateBgColor();

  const drawBlurredCircle = () => {
    if (isMobile()) {
      blurredCtx.filter = 'blur(70px)';
    } else {
      blurredCtx.filter = 'blur(50px)';
    }

    blurredCtx.clearRect(0, 0, blurredCanvas.width, blurredCanvas.height); // Clear the blurred canvas
    blurredCtx.beginPath();
    blurredCtx.arc(x, y, radius, 0, 2 * Math.PI);
    blurredCtx.fillStyle = `hsl(${randHue}, 100%, 60%)`;
    blurredCtx.fill();
    blurredCtx.closePath();
  };

  drawBlurredCircle();

  const draw = () => {
    const currentTime = performance.now(); 
    const elapsedTime = currentTime - lastTime; 

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(blurredCanvas, 0, 0);
    move(currentTime); 
    drawBlurredCircle();
    lastTime = currentTime; 

    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', () => {
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    blurredCanvas.width = canvas.width;
    blurredCanvas.height = canvas.height;
    init();
    drawBlurredCircle();
  });

  init();
  draw();
});

function isMobile() {
  return window.innerWidth < 600;
}
