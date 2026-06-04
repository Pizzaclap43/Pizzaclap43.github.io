const suits = ['♠', '♥', '♣', '♦'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let deck = [];

// 1. Crear la baraja de 52 cartas
function buildDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            let color = (suit === '♥' || suit === '♦') ? 'red' : 'black';
            deck.push({ suit, value, color });
        }
    }
}

// 2. Mezclar las cartas aleatoriamente
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Intercambio de posiciones
    }
}

// 3. Repartir el mazo en las 7 columnas del tablero
function dealTableau() {
    const tableauElement = document.getElementById('tableau');
    tableauElement.innerHTML = '';
    
    let cardIndex = 0;
    
    // Generar las 7 columnas
    for (let i = 0; i < 7; i++) {
        const col = document.createElement('div');
        col.className = 'col';
        
        // Repartir cartas en la columna (1 en la primera, 2 en la segunda...)
        for (let j = 0; j <= i; j++) {
            const card = deck[cardIndex++];
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            
            if (j > 0) cardEl.classList.add('card-stacked');
            
            // Voltear solo la carta que queda hasta arriba (la última del ciclo)
            if (j === i) {
                cardEl.innerHTML = `<span style="color:${card.color}">${card.value}${card.suit}</span>`;
            } else {
                cardEl.classList.add('back');
            }
            
            col.appendChild(cardEl);
        }
        tableauElement.appendChild(col);
    }
}

// Ejecutar el motor al cargar
buildDeck();
shuffleDeck();
dealTableau();

// Función extra para simular sacar una carta del mazo
document.getElementById('deck-btn').addEventListener('click', () => {
    const waste = document.getElementById('waste');
    waste.className = 'card'; // Quitar la clase "empty"
    // Mostrar una carta fija como demostración visual
    waste.innerHTML = `<span style="color:red">A♥</span>`; 
});
