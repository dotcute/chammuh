const canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d'),
    logo = new Image()
let lvl = 0,
    nickname = undefined,
    response = new Array,
    scripts

const script = require('./script.json');

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

let isClick = false;


const playScene = (name) => {
  const scene = script[name];
  scene.forEach(s => {
    switch (s.type) {
      case 'conv':
        playConv(s.content);
        break;
      /*case 'ques':
        playQues(s.content, s.answer.contents, s.answer.scene);
        break;*/
      case 'scene':
        playScene(s.content);
        break;
      default:
        console.log('에러다 에러 예상치 못한 타입이다');
        break;
    }
  });
};

const playConv = (content) => {
  content.forEach(c => {
    let loop = setInterval(() => {
      if (isClick) {
        printText(c);
        isClick = false;
        clearInterval(loop);
      }
    }, 100);
  });
}

const say = () => {
    let cases = ''
    for (let i in scripts) {
        cases += `case ${Number(i) + 1}:\n  printText(\`${scripts[i]}\`)\n  break\n`
    }
    eval(`switch (lvl) {\n${cases}}`)
}
const printText = (text) => {
    logo.src = `https://entryjsers.github.io/chammuh_assets/img/${lvl}.png`
    ctx.clearRect(0, 430, canvas.width, canvas.height)
    ctx.font = '24px Spoqa Han Sans'
    ctx.fillStyle = 'white'
    ctx.fillText(text, (canvas.width / 2) - (ctx.measureText(text).width / 2), 470)
}

window.addEventListener('load', () => {
    playScene('main');
})
logo.addEventListener('load', () => {
    ctx.drawImage(logo, 0, 0, 960, 420)
}, false)
canvas.addEventListener('click', () => {
    isClick = true;
})