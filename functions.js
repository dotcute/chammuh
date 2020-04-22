var isClick = false;

const playScript = (json) => {
  playScene(json, 'main');
}

const playScene = (script, name) => {
  return new Promise(async (resolve, reject) => {
    const scene = script[name];
    for (let s of scene) {
      switch (s.type) {
        case 'conv':
          await playConv(s.content);
          break;
        case 'ques':
          await playQues(s.content, s.answer);
          break;
        case 'scene':
          await playScene(s.content);
          break;
        default:
          alert('에러 발생: 정의되지 않은 type 값입니다.');
          break;
      }
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