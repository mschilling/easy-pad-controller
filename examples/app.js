import { EasyPadController } from './easypad/controller.js';

const controller = new EasyPadController();
controller.initialize();

document.addEventListener('PRESS', function(event) {
  if (event.detail.event === 'DOWN') {
    buttonOn(event.detail.key);
  } else if (event.detail.event === 'UP') {
    buttonOff(event.detail.key);
  }
});

function buttonOn(buttonId) {
  const el = document.getElementById(buttonId);
  if (!el) return;
  el.classList.add('active');
}

function buttonOff(buttonId) {
  const el = document.getElementById(buttonId);
  if (!el) return;
  el.classList.remove('active');
}

function nextEvent(target, name) {
  return new Promise(resolve => {
    target.addEventListener(name, resolve, { once: true });
  });
}
