const cardsContainer = document.getElementById("cards");
let cards = [];
let firstCard, secondCard;
let score = 0;
let lockboard = false;

fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generatCards();
  });

function shuffleCards() {
  let temp;
  let currentIndex = cards.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temp = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temp;
  }
}

function generatCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
        <div class="front">
        <img class="front-image" src=${card.image}>
        </div>
        <div class="back">
            
        </div>
        `;

        cardsContainer.appendChild(cardElement);
        cardElement.addEventListener("click" , flipcard);


  }
}

function flipcard(){
    if (lockboard) return;
    if (this===firstCard)return;
    this.classList.add("flipped");
    if(!firstCard){
      firstCard=this;
        return;
    }
    secondCard=this;
    lockboard= true;
    checkForMatch();
    document.getElementById('score').textContent=score;
}
 
function checkForMatch(){
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  if(isMatch){
      disablecards();
  }
  else{
      unflipCards();
  }
};

function disablecards(){
  firstCard.removeEventListener("click" , flipcard);
  secondCard.removeEventListener("click" , flipcard);
  score++;
  if (score === cards.length / 2) {
    startConfetti();
  }
  unlockboard();
};


function unflipCards(){
  setTimeout(()=>{
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    unlockboard();
  },1000)
};


function unlockboard(){
firstCard= null;
secondCard =null;
lockboard =false;

};

function restart() {
  cardsContainer.innerHTML = "";
  document.getElementById('score').textContent = score;
  unlockboard();
  generatCards();
  shuffleCards();
  stopConfetti();
}