const canvas = document.getElementById('game'),
  ctx = canvas.getContext('2d'),
  logo = new Image(),
  httpRequest = new XMLHttpRequest();

let nickname = undefined, response = new Array, script;

httpRequest.onreadystatechange = (data) => {
  script = JSON.parse(data.target.response)
  playScene('main');
}
httpRequest.open('GET', 'https://raw.githack.com/EntryJSers/chammuh/master/script.json')
httpRequest.send()

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

const playScene = async (name) => {
  console.log(name);
  const scene = script[name];
  for (let s of scene) {
    switch (s.type) {
      case 'conv':
        await playConv(s.content);
        break;
      /*case 'ques':
        playQues(s.content, s.answer.contents, s.answer.scene);
        break;*/
      case 'scene':
        await playScene(s.content);
        break;
      default:
        alert('에러다 에러 예상치 못한 타입이다');
        break;
    }
  }
};

const playConv = async (content) => {
  console.log(content);
  
  for (let c of content) {
    console.log(c)
    await waitUntilClick(c);
  }
}

const waitUntilClick = (content) => {
  console.log('loop')
  if (isClick == false) {
    setTimeout(waitUntilClick, 100, content);
  }
  else printText(eval(`\`${content[0]}\``), content[1]);
}

const printText = (text, img) => {
    logo.src = `https://rawcdn.githack.com/EntryJSers/chammuh_assets/master/assets/${img}.png`
    ctx.clearRect(0, 430, canvas.width, canvas.height)
    ctx.font = '24px Spoqa Han Sans'
    ctx.fillStyle = 'white'
    ctx.fillText(text, (canvas.width / 2) - (ctx.measureText(text).width / 2), 470)
}

window.addEventListener('load', () => {
  printText('클릭하여 시작..', 'title')
});

logo.addEventListener('load', () => {
  ctx.drawImage(logo, 0, 0, 960, 420)
}, false);

canvas.addEventListener('click', () => {
  isClick = true;
});