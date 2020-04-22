const canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d'),
    logo = new Image()
let lvl = 0,
    nickname = undefined,
    response = new Array,
    scripts,
    httpRequest = new XMLHttpRequest()

/*
httpRequest.onreadystatechange = (data) => {
    scripts = JSON.parse(data.target.response).story[0]
}
httpRequest.open('GET', 'https://rawcdn.githack.com/EntryJSers/chammuh_assets/932802ca3b542079c40d6be718257dfb2cdeadc2/scripts/script.json')
httpRequest.send()
*/

httpRequest.onreadystatechange = (data) => {
  scripts = JSON.parse(data.target.response)
  play('main')
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

let cases = ''
const play = (scene) => {
  for (let i = 0; i < scripts[scene].length; i++) {
    console.log(i)
    if (scripts[scene][i].type == 'conv') {
      for (let j = 0; j < scripts[scene][i].content.length; j++) {
        console.log(scripts[scene][i].content[j][1])
        cases += `case ${Number(i) + 1}:\n  printText(\`${scripts[scene][i].content[j][0]}\`, \`${scripts[scene][i].content[j][1]}\`)\n  break\n`
      }
    }
    if (scripts[scene][i].type == 'scene') {
      play(scripts[scene][i].content)
    }
        /*
        switch (scripts[scene][i].type) {
            case 'conv':
                cases += `case ${Number(i) + 1}:\n  printText(\`${scripts[scene][i].content}\`)\n  break\n`
                break
            case 'ques':
              playQues(s.content, s.answer.contents, s.answer.scene)
              break
            case 'scene':
                say(scripts[scene][i].content)
                break
            default:
                console.error('에러다 에러 예상치 못한 타입이다')
                break
        }
        */
  }
  eval(`switch (lvl) {\n${cases}}`)
}
const printText = (text, img) => {
    logo.src = `https://rawcdn.githack.com/EntryJSers/chammuh_assets/master/assets/${img}.png`
    ctx.clearRect(0, 430, canvas.width, canvas.height)
    ctx.font = '24px Spoqa Han Sans'
    ctx.fillStyle = 'white'
    ctx.fillText(text, (canvas.width / 2) - (ctx.measureText(text).width / 2), 470)
}

window.addEventListener('load', () => {
    printText('\n클릭해서 시작...')
})
logo.addEventListener('load', () => {
    ctx.drawImage(logo, 0, 0, 960, 420)
}, false)
canvas.addEventListener('click', () => {
    lvl += 1
})