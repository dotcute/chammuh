const canvas = document.getElementById('game'),
  ctx = canvas.getContext('2d'),
  image = new Image(),
  httpRequest = new XMLHttpRequest();

let nickname = '';

// ====================================================================================================

const confirm = (title, id, placeholder, func) => {
  Swal.fire({
    title: title,
    html:
      `<input id="${id}" style="font-size: 1.2rem; border-radius: .3125em; padding: 1rem; border: 1px solid #eee" placeholder="${placeholder}">`,
    focusConfirm: false,
    confirmButtonText: '확인'
  }).then((result) => {
    if (result.value) {
      func(id);
    } else {
      window.location.reload();
    }
  });
}

confirm('이름이 뭐야?', 'nameInput', '홍길동', (id) => {
  nickname = document.getElementById(id).value;
  if (nickname == '') window.location.reload();
});

// ====================================================================================================

let isClick = false;

const playScript = (json) => {
  if (!json) alert('존재하지 않는 스크립트입니다.');
  playScene(json, 'main');
};

const playScene = (script, name) => {
  return new Promise(async (resolve, reject) => {
    const scene = script[name];

    if (!scene) alert(`장면 '${name}' 이 존재하지 않습니다.`);

    for (let behavior of scene) {
      if (behavior.trigger && !eval(behavior.trigger)) continue;

      switch (behavior.type) {
        case 'conv':
          await playConv(behavior.contents);
          break;
        case 'ques':
          await playQues(behavior.content, behavior.answers);
          break;
        case 'scene':
          await playScene(script, behavior.name);
          break;
        default:
          alert('정의되지 않은 type 값입니다.');
          break;
      }
      if (behavior.scripts) eval(behavior.scripts);
    }
    resolve();
  });
};

const playConv = (contents) => {
  return new Promise(async (resolve, reject) => {
    for (let content of contents) {
      await waitUntilClick();
      await show(eval(`\`${content[0]}\``), content[1]);
    }
    resolve();
  });
};

const playQues = (content, answers) => {
  return new Promise(async (resolve, reject) => {
    // TODO
    resolve();
  });
};

const waitUntilClick = () => {
  return new Promise(async (resolve, reject) => {
    let loop = setInterval(() => {
      if (isClick) {
        isClick = false;
        resolve();
        clearInterval(loop);
      }
    }, 100);
  });
};

const waitMillisecs = (ms) => {
  return new Promise(async (resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

const show = (text, img, smooth=true) => {
  return new Promise(async (resolve, reject) => {
    if (img) image.src = `./assets/${img}.png`

    let talker = undefined;
    if (text.split(': ').length > 1) {
      const arr = text.split(': ');
      talker = arr.shift();
      text = arr.join(': ');
    }

    ctx.font = '24px Spoqa Han Sans'

    if (smooth) {
      for (let i = 1; i <= text.length; i++) {
        ctx.clearRect(0, 430, canvas.width, canvas.height);

        ctx.fillStyle = 'white'
        ctx.fillText(text.slice(0, i), (canvas.width / 2) - (ctx.measureText(text).width / 2), 470);

        if (talker) {
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 5;
          ctx.strokeRect(40, 440, 100, 40);

          ctx.fillStyle = 'white';
          ctx.fillText(talker, 45, 465);
        }
        await waitMillisecs(33);
      }
    } else {
      ctx.clearRect(0, 430, canvas.width, canvas.height);
      if (talker) ctx.fillRect(40, 480, 100, 40);

      ctx.fillStyle = 'white'
      ctx.fillText(text, (canvas.width / 2) - (ctx.measureText(text).width / 2), 470);
    }
    resolve();
  });
  
}

// ====================================================================================================

window.addEventListener('load', () => {
  show('클릭하여 시작...', 'title', false);
});

image.addEventListener('load', () => {
  ctx.drawImage(image, 0, 0, 960, 420);
}, false);

canvas.addEventListener('click', () => {
  isClick = true;
});

// ====================================================================================================

fetch('./scripts/script.json').then(async res => playScript(await res.json()));