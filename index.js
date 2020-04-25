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

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
}

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
        case 'js':
          eval(behavior.code);
          break;
        default:
          alert('정의되지 않은 type 값입니다.');
          break;
      }
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

const show = (text, img, smooth = true) => {
  return new Promise(async (resolve, reject) => {
    if (img) image.src = `./assets/${img}.png`

    let talker = undefined;
    if (text.split(': ').length > 1) {
      const arr = text.split(': ');
      talker = arr.shift();
      text = '"' + arr.join(': ') + '"';
    } else {
      talker = nickname;
      text = '(' + text + ')';
    }

    if (smooth) {
      for (let i = 1; i <= text.length; i++) {
        showTalker(talker);

        ctx.fillStyle = '#658EFF'
        ctx.roundRect(140, 410, canvas.width - 280, 90, 10).fill();

        ctx.fillStyle = 'white'
        ctx.fillText(text.slice(0, i), (canvas.width / 2) - (ctx.measureText(text).width / 2), 462);

        await waitMillisecs(33);
        isClick = false;
      }
    } else {
      ctx.fillStyle = '#658EFF'
      ctx.roundRect(140, 410, canvas.width - 280, 90, 10).fill();
       
      showTalker(talker);

      ctx.fillStyle = 'white'
      ctx.fillText(text, (canvas.width / 2) - (ctx.measureText(text).width / 2), 470);
    }
    resolve();
  });

}

const showTalker = (name) => {
  ctx.lineWidth = 5;
  ctx.fillStyle = 'white'
  ctx.roundRect(160, 370, 160, 50, 10).fill();
  ctx.strokeStyle = '#658EFF'
  ctx.roundRect(160, 370, 160, 50, 10).stroke();

  ctx.fillStyle = '#658EFF'
  ctx.fillText(name, 240 - (ctx.measureText(name).width / 2), 400);
}

const preloading = (imageArray) => {
  let n = imageArray.length
  for (let i = 0; i < n; i++) {
    let img = new Image()
    img.src = `./assets/${imageArray[i]}`
  }
}

// ====================================================================================================

window.addEventListener('load', () => {
  show('클릭하여 시작...', 'title', false);
});

image.addEventListener('load', () => {
  ctx.drawImage(image, 0, 0, 960, 540);
}, false);

canvas.addEventListener('click', () => {
  isClick = true;
});

// ====================================================================================================

ctx.font = '24px Spoqa Han Sans'
fetch('./assets/list.txt').then(async res => preloading((await res.text()).split(', ')))
fetch('./scripts/script.json').then(async res => playScript(await res.json()));
