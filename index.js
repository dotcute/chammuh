const canvas = document.getElementById('game'),
  ctx = canvas.getContext('2d'),
  logo = new Image(),
  httpRequest = new XMLHttpRequest();

let nickname = undefined, response = new Array;

// ====================================================================================================

confirm = (title, id, placeholder, func) => {
    Swal.fire({
        title: title,
        html:
            `<input id="${id}" style="font-size: 1.2rem; border-radius: .3125em; padding: 1rem; border: 1px solid #eee" placeholder="${placeholder}">`,
        focusConfirm: false,
        confirmButtonText: '확인'
    }).then((result) => {
        if (result.value) {
            func(id)
        }
    })
}

Swal.fire({
    title: '이름이 뭐야?',
    html:
        `<input id="nameInput" style="font-size: 1.2rem; border-radius: .3125em; padding: 1rem; border: 1px solid #eee" placeholder="홍길동">`,
    focusConfirm: false,
    confirmButtonText: '확인'
}).then((result) => {
    if (result.value) {
        nickname = document.getElementById('nameInput').value
        if (nickname == '') window.location.reload()
    } else {
        window.location.reload()
    }
})

// ====================================================================================================

let isClick = false;

const playScript = (json) => {
  playScene(json, 'main');
}

const playScene = (script, name) => {
  return new Promise(async (resolve, reject) => {
    const scene = script[name];
    if (!scene) alert(`장면 '${name}' 이 존재하지 않습니다.`)

    for (let s of scene) {

      if (s.trigger && !eval(s.trigger)) continue

      switch (s.type) {
        case 'conv':
          await playConv(s.content);
          break;
        case 'ques':
          await playQues(s.content, s.answer);
          break;
        case 'scene':
          await playScene(script, s.content);
          break;
        default:
          alert('정의되지 않은 type 값입니다.');
          break;
      }
      if (s.script) eval(s.script)
    }
    resolve()
  })
};

const playConv = (content) => {
  return new Promise(async (resolve, reject) => {
    for (let c of content) {
      console.log(c)
      await waitUntilClick(c);
    }
    resolve()
  })
}

const playQues = (content, answer) => {
  return new Promise(async (resolve, reject) => {
    for (let c of content) {
      console.log(c)
      await waitUntilClick(c);
    }
    resolve()
  })
}

const waitUntilClick = (content) => {
  return new Promise(async (resolve, reject) => {
    let loop = setInterval(() => {
      if (isClick) {
        printText(eval(`\`${content[0]}\``), eval(`\`${content[1]}\``))
        isClick = false
        resolve()
        clearInterval(loop)
      }
    }, 100)
  })
}

const printText = (text, img) => {
  if (img) logo.src = `https://rawcdn.githack.com/EntryJSers/chammuh_assets/master/assets/${img}.png`
  ctx.clearRect(0, 430, canvas.width, canvas.height)
  ctx.font = '24px Spoqa Han Sans'
  ctx.fillStyle = 'white'
  ctx.fillText(text, (canvas.width / 2) - (ctx.measureText(text).width / 2), 470)
}

// ====================================================================================================

let count = 0

fetch('https://raw.githack.com/EntryJSers/chammuh/master/test.json')
  .then(res => res.json())
  .then(json => playScript(json))

window.addEventListener('load', () => {
  printText('클릭하여 시작...', 'title')
});

logo.addEventListener('load', () => {
  ctx.drawImage(logo, 0, 0, 960, 420)
}, false);

canvas.addEventListener('click', () => {
  isClick = true;
});