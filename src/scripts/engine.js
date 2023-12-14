const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),
    },
    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    playerSides: {
        player1: 'player-cards',
        player1BOX: document.querySelector('#player-cards'),
        computer: 'computer-cards',
        computerBOX: document.querySelector('#computer-cards'),
    },
    actions: {
        button: document.getElementById('next-duel'),
    },
};

const pathImage = './src/assets/icons/';

const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: `${pathImage}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },

    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: `${pathImage}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImage}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
];

async function setCardField(cardId) {
    await removeAllCardImages();

    let computerCardId = await getRandomIdCard();

    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = 'block';
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playercardId, computerCardId) {
    let duelResults = 'Draw';
    let playercard = cardData[playercardId];

    if (playercard.winOf.includes(computerCardId)) {
        duelResults = 'Win';
        state.score.playerScore++;
    }

    if (playercard.loseOf.includes(computerCardId)) {
        duelResults = 'Lose';
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
}

async function removeAllCardImages() {
    let {computerBOX, player1BOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());
}

async function getRandomIdCard() {
    const randomIndex = Math.floor(Math.random() * cardData.length);

    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', '	./src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', idCard);
    cardImage.classList.add('card');

    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener('mouseover', () => {
            drawSelectCard(idCard);
        });
        cardImage.addEventListener('click', () => {
            setCardField(cardImage.getAttribute('data-id'));
        });
    }

    return cardImage;
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = 'Attribute : ' + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomIdCard();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = '';
    state.actions.button.style.display = 'none';

    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init() {
    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
}

init();
