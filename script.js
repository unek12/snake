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
let arrlen = [];
let posx = 1;
let posy = 1;
let foodLen = 0;
const foodCounter = 2;
let bonusLen = 0;
let up = 0,
    left = 0,
    right = 1,
    down = 0;
let buff = 'right';

const resetModal = document.querySelector('.modal');

document.querySelector('#restart').addEventListener('click', () => {
    location.href = location.href;
    localStorage.setItem('menu', 'closed');
});

document.querySelector('#menu').addEventListener('click', () => {
    location.href = location.href;
    localStorage.setItem('menu', 'open');
});



// start

document.querySelector('#play').addEventListener('click', () => {
    play();
});

// if (localStorage.getItem('menu') === 'closed') {
//     play();
// }



// move

document.addEventListener('keydown', (key) => {
    if (key.code === 'KeyW' || key.code === 'KeyA' || key.code === 'KeyS' || key.code === 'KeyD') {
        if (key.code === 'KeyW' && buff != 'down' && buff !== 'up') {
            up = 1;
            down = 0;
            left = 0;
            right = 0;
        } else
        if (key.code === 'KeyA' && buff != 'right' && buff !== 'left') {
            up = 0;
            down = 0;
            left = 1;
            right = 0;
        } else
        if (key.code === 'KeyS' && buff != 'up' && buff !== 'down') {
            up = 0;
            down = 1;
            left = 0;
            right = 0;
        } else
        if (key.code === 'KeyD' && buff != 'left' && buff !== 'right') {
            up = 0;
            down = 0;
            left = 0;
            right = 1;
        }
    }
});

// reset 

addEventListener('keydown', (key) => {
    if (key.code === 'KeyR' && document.querySelector('#modal__restart').classList.contains('show')) {
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
            div[i].innerHTML += `<div class='item'><div clas='text'></div></div>`;
        }
    }
    let scoreDiv = document.querySelector('#score');
    document.querySelector('#modal__play').classList.remove('show');
    arr = document.querySelectorAll('.row');
    arr[posx].children[posy].classList.add('target', 'head');
    arrlen.push([posx, posy]);

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
        posx--;
        buff = 'up';
    } else
    if (down && buff !== 'up') {
        posx++;
        buff = 'down';
    } else
    if (right && buff !== 'left') {
        posy++;
        buff = 'right';
    } else
    if (left && buff !== 'right') {
        posy--;
        buff = 'left';
    }
}


// draw

function draw(arrlen) {
    arr[posx].children[posy].classList.add('target', 'head');
    let posX;
    let posY;
    arrlen.forEach((item) => {
        posX = item[0];
        posY = item[1];
        arr[posX].children[posY].classList.add('target');
        arr[posX].children[posY].classList.remove('head');

    });
    if (arr[posx].children[posy].classList.contains('apple')) {
        arr[posx].children[posy].classList.remove('apple');
        foodLen--;
        arrlen.unshift([posx, posy]);
        meterScore.value = 100;
        score++;
    }
    if (arr[posx].children[posy].classList.contains('sugar')) {
        arr[posx].children[posy].classList.remove('sugar');
        arrlen.unshift([posx, posy]);
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
    arrlen.push([posx, posy]);
    if (!arr[posx].children[posy].classList.contains('apple') &&
        !arr[posx].children[posy].classList.contains('sugar')) {
        arr[arrlen[0][0]].children[arrlen[0][1]].classList.remove('target');
        arrlen.shift();
    }
    arr[posx].children[posy].classList.add('target');

}

// apple

function createApple() {
    let randPosx = Math.round(Math.random() * 16);
    let randPosy = Math.round(Math.random() * 16);
    if (!arr[randPosx].children[randPosy].classList.contains('target') &&
        !arr[randPosx].children[randPosy].classList.contains('apple')) {
        arr[randPosx].children[randPosy].classList.add('apple');
        foodLen++;
    } else {
        createApple();
    }
}


// buster-speed

function speedBonus() {
    let randPosx = Math.round(Math.random() * 16);
    let randPosy = Math.round(Math.random() * 16);
    if (!arr[randPosx].children[randPosy].classList.contains('target') &&
        !arr[randPosx].children[randPosy].classList.contains('apple') &&
        !arr[randPosx].children[randPosy].classList.contains('sugar')) {
        arr[randPosx].children[randPosy].classList.add('sugar');
        bonusLen++;
    } else {
        speedBonus();
    }
}


// modal


function openModal() {
    resetModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}


// IntervalDraw

function Interval() {
    changePos(up, down, left, right);
    if (!(posx > 16 || posx < 0 || posy > 16 || posy < 0 || meterScore.value === 0)) {
        arrlen.forEach(item => {
            if (item[0] === posx && item[1] === posy) {
                openModal();
                clearInterval(meterInter);
                clearInterval(interval);
                if (localStorage.getItem('bestScore') < score) {
                    localStorage.setItem('bestScore', score);
                }
            }
        });
        draw(arrlen);
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