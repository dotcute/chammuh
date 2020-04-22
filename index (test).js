const canvas = document.getElementById('game'),
  ctx = canvas.getContext('2d'),
  logo = new Image(),
  httpRequest = new XMLHttpRequest()

let nickname = undefined, response = new Array, script, lvl = 0

confirm = (title, id, placeholder, func) => {
    Swal.fire({
        title: title,
        html:
            `<input id="${id}" style="font-size: 1.2rem; border-radius: .3125em; padding: 1rem; border: 1px; solid #eee;" placeholder="${placeholder}">`,
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
        `<input id="nameInput" style="font-size: 1.2rem; border-radius: .3125em; padding: 1rem; border: 1px solid #eee;" placeholder="홍길동">`,
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


let isClick = false

const playScene = (name) => {
  console.log(name);
  const scene = script[name];
  for (let s of scene) {
    switch (s.type) {
      case 'conv':
        playConv(s.content)
        break
      /*case 'ques':
        playQues(s.content, s.answer.contents, s.answer.scene)
        break*/
      case 'scene':
        playScene(s.content)
        break
      default:
        console.error('에러다 에러 예상치 못한 타입이다')
        break
    }
  }
};

const playConv = (content) => {
  console.log(content);
  for (let c of content) {
    printText(eval(`\`${c[0]}\``), c[1]);

    let loop = setInterval(() => {
      if (isClick) {
        isClick = false;
        clearInterval(loop);
      }
    }, 50);
  }
}

const printText = (text) => {
  logo.src = `https://rawcdn.githack.com/EntryJSers/chammuh_assets/932802ca3b542079c40d6be718257dfb2cdeadc2/img/${lvl}.png`
  ctx.clearRect(0, 430, canvas.width, canvas.height)
  ctx.font = '24px Spoqa Han Sans'
  ctx.fillStyle = 'white'
  ctx.fillText(text, (canvas.width / 2) - (ctx.measureText(text).width / 2), 470)
}

window.addEventListener('load', () => {
  playScene('main');
});

logo.addEventListener('load', () => {
  ctx.drawImage(logo, 0, 0, 960, 420)
}, false)

canvas.addEventListener('click', () => {
  lvl++
  isClick = true
})