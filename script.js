const meterScore = document.querySelector('.scoreDeath');
const meterBonus = document.querySelector('.bonus');
document.querySelector('#best__score').innerHTML = localStorage.getItem('bestScore');
let bonusTimer;
let interval;
let meterInter;
let bonusInterval;
let speed = 150;
let score = 0;
let arr;
let arrLen = [];
let posX = 1;
let posY = 1;
let foodLen = 0;
const foodCounter = 2;
let bonusLen = 0;
let up = 0,
    left = 0,
    right = 1,
    down = 0;
let buff = 'right';
let headIcon = 'black';


const resetModal = document.querySelector('.modal');

document.querySelector('#restart').addEventListener('click', () => {
    location.href = location.href;
    localStorage.setItem('menu', 'closed');
});

document.querySelector('#menu').addEventListener('click', () => {
    location.href = location.href;
    localStorage.setItem('menu', 'open');
});

// shop

document.querySelector('#shop').addEventListener('click', () => {
    document.querySelector('#modal__play').classList.toggle('show');
    document.querySelector('.modal__shop').classList.add('show');
});

const shopItemCost = document.querySelectorAll('.item__cost');
const shopItemBuy = document.querySelectorAll('.item__buy');
const shopItemSelected = document.querySelectorAll('.item__selected');

shopItemBuy.forEach((item , e) => {
    item.addEventListener('click', () => {
        item.style.display = 'none';
        console.log(shopItemCost[e]);
        shopItemCost[e].style.display = 'none';
        shopItemSelected[e].style.display = 'block';
    });
});

shopItemSelected.forEach(item => {
   item.addEventListener('click', () => {
       shopReset();
       item.innerHTML = 'selected';
       shopIconSet();
   });
});

function shopIconSet(){
    shopItemSelected.forEach((item,i) => {
        if (item.innerHTML === 'selected'){
            headIcon = './img/floid.jpg';
        }
    });
}

function shopReset(){
    shopItemSelected.forEach(item => {
        item.innerHTML = 'unselected';
    });
}

// start

document.querySelector('#play').addEventListener('click', () => {
    play();
});

// move

document.addEventListener('keypress', (key) => {
    if (key.code === 'KeyW' || key.code === 'KeyA' || key.code === 'KeyS' || key.code === 'KeyD') {
        if (key.code === 'KeyW' && buff !=='down' && buff !== 'up') {
            up = 1;
            down = 0;
            left = 0;
            right = 0;
        } else
        if (key.code === 'KeyA' && buff !== 'right' && buff !== 'left') {
            up = 0;
            down = 0;
            left = 1;
            right = 0;
        } else
        if (key.code === 'KeyS' && buff !=='up' && buff !== 'down') {
            up = 0;
            down = 1;
            left = 0;
            right = 0;
        } else
        if (key.code === 'KeyD' && buff !== 'left' && buff !== 'right') {
            up = 0;
            down = 0;
            left = 0;
            right = 1;
        }
    }
});

// reset

addEventListener('keydown', (key) => {
    if (key.code === 'KeyR' && document.querySelector('#modal__restart')
        .classList.contains('show')) {
        location.href = location.href;
        localStorage.setItem('menu', 'closed');
    }
});


// play 

function play() {
    document.querySelector('.game').style.display = 'block';
    const container = document.querySelector('.container');
    container.innerHTML += `
        <div class="score__block">
            Score: <div id="score">0</div>
        </div>
    `;
    container.innerHTML += `<div class='table'></div>`;
    const table = document.querySelector('.table');
    for (let i = 0; i < 17; i++) {
        table.innerHTML += `<div class='row'></div>`;
        const div = document.querySelectorAll('.row');
        for (let j = 0; j < 17; j++) {
            div[i].innerHTML += `<div class='item'><div class='text'></div></div>`;
        }
    }
    let scoreDiv = document.querySelector('#score');
    document.querySelector('#modal__play').classList.remove('show');
    arr = document.querySelectorAll('.row');
    arr[posX].children[posY].classList.add('target', 'head');
    arrLen.push([posX, posY]);

    interval = setInterval(Interval, speed);

    setInterval(() => {
        if (bonusLen < 3) {
            speedBonus();
        }
    }, 5000);

    setInterval(() => {
        scoreDiv.innerHTML = score;
        if (foodLen < foodCounter) {
            createApple();
        }
    }, 100);

    meterInter = setInterval(() => {
        meterScore.value = meterScore.value - 1;
    }, 100);

    bonusInterval = setInterval(() => {
        if (bonusTimer > 0) {
            meterBonus.value = --bonusTimer;
        }
    }, 30);
}

function changePos(up, down, left, right) {
    if (up && buff !== 'down') {
        posX--;
        buff = 'up';
    } else
    if (down && buff !== 'up') {
        posX++;
        buff = 'down';
    } else
    if (right && buff !== 'left') {
        posY++;
        buff = 'right';
    } else
    if (left && buff !== 'right') {
        posY--;
        buff = 'left';
    }
}


// draw

function draw(arrLen) {
    arr[posX].children[posY].classList.add('target', 'head');
    let buffPosX;
    let buffPosY;
    arrLen.forEach((item) => {
        buffPosX = item[0];
        buffPosY = item[1];
        arr[buffPosX].children[buffPosY].classList.add('target');
        arr[buffPosX].children[buffPosY].classList.remove('head');

    });
    if (arr[posX].children[posY].classList.contains('apple')) {
        arr[posX].children[posY].classList.remove('apple');
        foodLen--;
        arrLen.unshift([posX, posY]);
        meterScore.value = 100;
        score++;
    }
    if (arr[posX].children[posY].classList.contains('sugar')) {
        arr[posX].children[posY].classList.remove('sugar');
        arrLen.unshift([posX, posY]);
        bonusLen--;
        meterScore.value = 100;
        score++;
        speed = 100;
        bonusTimer = 100;
        clearInterval(interval);
        interval = setInterval(Interval, speed);
        setTimeout(() => {
            if (!bonusTimer) {
                speed = 150;
                clearInterval(interval);
                interval = setInterval(Interval, speed);
            }
        }, 3100);
    }
    arrLen.push([posX, posY]);
    if (!arr[posX].children[posY].classList.contains('apple') &&
        !arr[posX].children[posY].classList.contains('sugar')) {
        arr[arrLen[0][0]].children[arrLen[0][1]].classList.remove('target');
        arrLen.shift();
    }
    arr[posX].children[posY].classList.add('target');

}

// apple

function createApple() {
    let randPosX = Math.round(Math.random() * 16);
    let randPosY = Math.round(Math.random() * 16);
    if (!arr[randPosX].children[randPosY].classList.contains('target') &&
        !arr[randPosX].children[randPosY].classList.contains('apple')) {
        arr[randPosX].children[randPosY].classList.add('apple');
        foodLen++;
    } else {
        createApple();
    }
}


// buster-speed

function speedBonus() {
    let randPosX = Math.round(Math.random() * 16);
    let randPosY = Math.round(Math.random() * 16);
    if (!arr[randPosX].children[randPosY].classList.contains('target') &&
        !arr[randPosX].children[randPosY].classList.contains('apple') &&
        !arr[randPosX].children[randPosY].classList.contains('sugar')) {
        arr[randPosX].children[randPosY].classList.add('sugar');
        bonusLen++;
    } else {
        speedBonus();
    }
}


// modal


function openModal() {
    resetModal.classList.add('show');
    // document.body.style.overflow = 'hidden';
}


// IntervalDraw

function Interval() {
    changePos(up, down, left, right);
    if (!(posX > 16 || posX < 0 || posY > 16 || posY < 0 || meterScore.value === 0)) {
        arrLen.forEach(item => {
            if (item[0] === posX && item[1] === posY) {
                openModal();
                clearInterval(meterInter);
                clearInterval(interval);
                if (localStorage.getItem('bestScore') < score) {
                    localStorage.setItem('bestScore', score);
                }
            }
        });
        draw(arrLen);
    } else {
        localStorage.setItem('score', score);
        openModal();
        clearInterval(interval);
        clearInterval(meterInter);
        clearInterval(bonusInterval);
        if (localStorage.getItem('bestScore') < score) {
            localStorage.setItem('bestScore', score);
        }
    }
}