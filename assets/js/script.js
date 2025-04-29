displayHighScores();

const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const level = document.getElementById('level-game')

const backgroundMusic = document.getElementById('background-music');
// Iniciar ou pausar música ao clicar no botão "Iniciar"
startButton.addEventListener('click', () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    startButton.innerHTML = '<i class="fas fa-pause"></i> Pausar';
  } else {
    backgroundMusic.pause();
    startButton.innerHTML = '<i class="fas fa-play"></i> Iniciar';
  }
});

const volumeControl = document.getElementById('volume-control');

volumeControl.addEventListener('input', () => {
  backgroundMusic.volume = volumeControl.value;
});

document.getElementById('restart-button').addEventListener('click', () => {
  // Resetar jogo
  squares.forEach(square => {
    square.className = ''; 
    level.innerHTML = "Nivel 1";
});

gameStarted = true;
backgroundMusic.play();

  score = 0;
  scoreDisplay.innerText = score;
  currentPosition = 4;
  currentRotation = 0;
  randomTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
  current = randomTetromino.shape[currentRotation];
  currentClass = randomTetromino.class;

  document.getElementById('game-over-popup').classList.add('hidden');

  draw();
  timerId = setInterval(moveDown, 800);
  startButton.innerHTML = '<i class="fas fa-pause"></i> Pausar';
});

const width = 10;
let squares = [];
let currentPosition = 4;
let currentRotation = 0;
let timerId;
let score = 0;
let gameStarted = false;

for (let i = 0; i < 200; i++) {
  const div = document.createElement('div');
  grid.appendChild(div);
  squares.push(div);
}


// Peças
const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2]
];
const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1]
];
const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1]
];
const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1]
];
const sTetromino = [
  [1, width, width + 1, width * 2],
  [0, 1, width + 1, width + 2],
  [1, width, width + 1, width * 2],
  [0, 1, width + 1, width + 2]
];

const jTetromino = [
  [1, width + 1, width * 2 + 1, 0],
  [width, width + 1, width + 2, 2],
  [1, width + 1, width * 2 + 1, width * 2 + 2],
  [width, width + 1, width + 2, width * 2]
];
const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3]
];

const tetrominoes = [
  { shape: lTetromino, class: 'tetromino-l' },
  { shape: zTetromino, class: 'tetromino-z' },
  { shape: tTetromino, class: 'tetromino-t' },
  { shape: oTetromino, class: 'tetromino-o' },
  { shape: iTetromino, class: 'tetromino-i' },
  { shape: sTetromino, class: 'tetromino-s' },
  { shape: jTetromino, class: 'tetromino-j' }
];

let randomTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
let current = randomTetromino.shape[currentRotation];
let currentClass = randomTetromino.class;

startButton.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    startButton.innerHTML = '<i class="fas fa-play"></i> Continuar';
    gameStarted = false
  } else {
    draw();
    timerId = setInterval(moveDown, 800);
    startButton.innerHTML = '<i class="fas fa-pause"></i> Pausar';
    gameStarted = true
  }
});

function draw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.add('tetromino', currentClass);
  });
}

function undraw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.remove('tetromino', currentClass);
  });
}

function moveDown() {
  if (!gameStarted) return;
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

function moveLeft() {
  if (!gameStarted) return;
  undraw();
  const atLeft = current.some(index => (currentPosition + index) % width === 0);
  if (!atLeft) currentPosition -= 1;
  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition += 1;
  }
  draw();
}

function moveRight() {
  if (!gameStarted) return;
  undraw();
  const atRight = current.some(index => (currentPosition + index) % width === width - 1);
  if (!atRight) currentPosition += 1;
  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition -= 1;
  }
  draw();
}

function rotate() {
  if (!gameStarted) return;
  undraw();
  const oldRotation = currentRotation;
  currentRotation = (currentRotation + 1) % 4;
  current = randomTetromino.shape[currentRotation];

  // Verifica se a rotação pode ser realizada
  if (checkRotatedPosition()) {
    draw();
  } else {
    // Caso a rotação não seja válida, desfaz e tenta mover a peça
    currentRotation = oldRotation;
    current = randomTetromino.shape[currentRotation];
    moveIfNeeded();
    draw();
  }
}

function moveIfNeeded() {
  let shifted = false;
  
  undraw();
  
  // Tentando mover para a esquerda
  if (currentPosition > 0) {
    currentPosition -= 1;
    if (checkRotatedPosition()) {
      draw();
      shifted = true;
    } else {
      // Tentando mover para a direita
      currentPosition += 2;
      if (checkRotatedPosition()) {
        draw();
        shifted = true;
      } else {
        // Se a rotação não for possível nem com movimento, desfaz
        undraw();
        currentPosition -= 1;
        draw();
      }
    }
  }
  
  return shifted;
}

function checkRotatedPosition() {
  return current.every(index => {
    const pos = currentPosition + index;
    // Garantir que a peça não ultrapasse a borda direita e esquerda
    const isAtLeftEdge = pos % width === 0;
    const isAtRightEdge = pos % width === width - 1;

    // Verifica se a posição é válida
    return (
      pos >= 0 &&
      pos < width * 20 && // Dentro do grid
      !squares[pos].classList.contains('taken') && // Não há outro bloco fixo
      !(isAtLeftEdge && current.some(i => (currentPosition + i) % width === 0)) && // Não na borda esquerda
      !(isAtRightEdge && current.some(i => (currentPosition + i) % width === width - 1)) // Não na borda direita
    );
  });
}

function freeze() {
  if (
    current.some(index =>
      currentPosition + index + width >= width * 20 || // chegou no fundo do grid
      squares[currentPosition + index + width].classList.contains('taken') // encostou em bloco fixo
    )
  ) {
    current.forEach(index => squares[currentPosition + index].classList.add('taken'));
    randomTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    current = randomTetromino.shape[0];
    currentClass = randomTetromino.class;
    currentRotation = 0;
    currentPosition = 3;
    draw();
    addScore();
    gameOver();
  }
}

// EXISTE UM ERRO AQUI NÃO ESQUECER
// ERRO NO addScore
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [...Array(width).keys()].map(j => i + j);
    if (row.every(index => squares[index].classList.contains('taken'))) {
      score += 10;
      scoreDisplay.innerText = score.toString().padStart(4, '0');

      // Adicionar a classe de animação
      row.forEach(index => squares[index].classList.add('flash'));

      setTimeout(() => {
        row.forEach(index => {
          squares[index].className = ''; // Limpa todas as classes
        });

        // Puxar todas as linhas acima para baixo
        for (let j = i - 1; j >= 0; j--) {
          if (squares[j].classList.contains('taken')) {
            squares[j + width].className = squares[j].className;
            squares[j].className = '';
          }
        }
      }, 400); // mesma duração da animação
    }
  }
  
// Levels speed
if (score >= 100) {
  clearInterval(timerId);
  timerId = setInterval(moveDown, 600);
  level.innerHTML = "Nivel 2";
}

if (score >= 200) {
  clearInterval(timerId);
  timerId = setInterval(moveDown, 400); 
  level.innerHTML = "Nivel 3";
}

if (score >= 300 ) {
  clearInterval(timerId);
  timerId = setInterval(moveDown, 200);
  level.innerHTML = "Nivel 4";
}

if (score >= 400 ) {
  clearInterval(timerId);
  timerId = setInterval(moveDown, 100); 
  level.innerHTML = "Nivel 5";
}

if (score >= 600 ) {
  clearInterval(timerId);
  timerId = setInterval(moveDown, 100); 
  level.innerHTML = "Nivel GOD";
}

}


function gameOver() {
  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    clearInterval(timerId);
    backgroundMusic.pause();
    document.getElementById('final-score').innerText = `Sua pontuação: ${score}`;
    document.getElementById('game-over-popup').classList.remove('hidden');
    document.getElementById('game-over-sound').play();

    updateHighScores(); // <-- Adicione isso
  }
}

function updateHighScores() {
  let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

  // Adiciona o score atual
  highScores.push(score);

  // Ordena do maior para o menor
  highScores.sort((a, b) => b - a);

  // Mantém apenas os 3 melhores
  highScores = highScores.slice(0, 3);

  // Salva de volta no localStorage
  localStorage.setItem('highScores', JSON.stringify(highScores));

  // Atualiza o ranking na tela
  displayHighScores();
}

function displayHighScores() {
  let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const highScoresList = document.getElementById('high-scores');
  
  if (!highScoresList) return; // Se o elemento não existir, não faz nada

  highScoresList.innerHTML = '<h3>Recordes:</h3>' +
    highScores.map((score, index) => `<p>#${index + 1}: ${score}</p>`).join('');
}

document.addEventListener('keydown', (e) => {
  if (!gameStarted) return;

  const key = e.key.toLowerCase();

  switch (key) {
    case 'a':
      moveLeft();
      break;
    case 'd':
      moveRight();
      break;
    case 's':
      moveDown();
      break;
    case ' ':
      e.preventDefault();
      rotate();
      break;
  }
});