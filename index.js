const canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d'),
    logo = new Image()
let lvl = 0,
    nickname = undefined,
    response = new Array

confirm = (title, id, placeholder, func) => {
    Swal.fire({
        title: title,
        html:
            `<input id="${id}" style="font-size: 1.2rem; border-radius: .3125em; padding: 1rem; border: 1px solid #eee" placeholder="${placeholder}">`,
        focusConfirm: false,
        confirmButtonText: '확인'
    }).then((result) => {
        if (result.value) {
            func(result.value, id)
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


const say = () => {
    switch (lvl) {
        case 1:
            printText(`안녕 ${nickname}! 머리 깎으러 왔구나!`)
            break
        case 2:
            printText('빨리 앉아!')
            break
        case 3:
            printText('다 깎아주겠어...')
            break
        case 4:
            printText('빨리 앉으라니까!')
            break
        case 5:
            printText('앉아버렸다...')
            break
        default:
            printText('-끗-')
    }
}
const printText = (text) => {
    logo.src = `img/${lvl}.png`
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
    say()
})