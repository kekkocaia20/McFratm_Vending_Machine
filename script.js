let monetaInserita = 0;
let prodottoSelezionato = { id: 0, nome: '', prezzo: 0 };

// Funzione per inserire una moneta da 1€ e animarla
function insertCoin() {
  const valoreMoneta = 1;  // Moneta da 1€

  monetaInserita += valoreMoneta;

  // Aggiornare il credito visualizzato
  updateCreditDisplay();

  // Animazione della moneta inserita
  animateCoinInsert(valoreMoneta);
}

// Funzione per aggiornare il credito disponibile
function updateCreditDisplay() {
  document.getElementById('creditAmount').textContent = `€${monetaInserita.toFixed(2)}`;
}

function animateCoinInsert(valore) {
  const coinDiv = document.createElement('div');
  coinDiv.classList.add('coin');
  coinDiv.textContent = `€${valore}`;

  const machine = document.getElementById('machine');
  machine.appendChild(coinDiv);  // Inserisci la moneta nella macchina

  const coinInputArea = document.getElementById('coinInputArea');
  const inputRect = coinInputArea.getBoundingClientRect();
  const machineRect = machine.getBoundingClientRect();

  // Calcola la posizione relativa al contenitore .machine
  const left = machine.clientWidth - 60; // posizionata a destra
  const top = inputRect.top - machineRect.top - 30;

  coinDiv.style.left = `${left}px`;
  coinDiv.style.top = `${top}px`;

  // Rimuovi la moneta dopo l’animazione
  setTimeout(() => {
    coinDiv.remove();
  }, 2000);
}


// Funzione per selezionare un prodotto
function selectProduct(id) {
  const products = [
    { id: 1, nome: 'Snack', prezzo: 1.5 },
    { id: 2, nome: 'Energy Drink', prezzo: 2.0 },
    { id: 3, nome: 'Water Bottle', prezzo: 1.0 },
    { id: 4, nome: 'Soft Drink', prezzo: 1.5 },
    { id: 5, nome: 'Chocolate', prezzo: 1.5 },
    { id: 6, nome: 'Beer', prezzo: 2.0 },
  ];

  prodottoSelezionato = products.find(product => product.id === id);

  // Mostra il nome e il prezzo del prodotto selezionato
  document.getElementById('productName').textContent = prodottoSelezionato.nome;
  document.getElementById('productPrice').textContent = '€' + prodottoSelezionato.prezzo.toFixed(2);
}

function buyProduct() {
  const confirmationMessage = document.getElementById('confirmationMessage');

   // Controllo se nessun prodotto è stato selezionato
   if (prodottoSelezionato.id === 0) {
    confirmationMessage.innerHTML = `Seleziona prima un prodotto.`;
    confirmationMessage.style.color = 'orange';
    return;
  }

  // Controllo se non è stato inserito credito
  if (monetaInserita <= 0) {
    confirmationMessage.innerHTML = `Inserisci le monete prima di acquistare.`;
    confirmationMessage.style.color = 'orange';

     // Scompare dopo 3 secondi (3000 ms)
  setTimeout(() => {
    confirmationMessage.innerHTML = '';
  }, 3000);

    return;
  }

  // Controllo se il credito è sufficiente per acquistare il prodotto
  if (monetaInserita >= prodottoSelezionato.prezzo) {
    // Calcolo del resto e aggiornamento del saldo
    const resto = monetaInserita - prodottoSelezionato.prezzo;
    monetaInserita = resto;

    // Aggiorna il credito visualizzato
    updateCreditDisplay();

    // Mostra il messaggio di conferma sotto al bottone
    confirmationMessage.innerHTML = `Prodotto acquistato: <strong>${prodottoSelezionato.nome}</strong>!`;
    confirmationMessage.style.color = 'green'; // Colore verde per conferma
     // Aggiungi l'acquisto allo storico
     acquisti.push({ nome: prodottoSelezionato.nome, prezzo: prodottoSelezionato.prezzo });
     // Scompare dopo 3 secondi (3000 ms)
     setTimeout(() => {
    confirmationMessage.innerHTML = '';
    }, 3000);
  } else {
    // Mostra il messaggio di errore sotto al bottone
    confirmationMessage.innerHTML = `Credito insufficiente! Inserisci più monete.`;
    confirmationMessage.style.color = 'red'; // Colore rosso per errore
       // Scompare dopo 3 secondi (3000 ms)
       setTimeout(() => {
        confirmationMessage.innerHTML = '';
      }, 3000);
    }
}

// Funzione per svuotare il credito
function emptyCredit() {
  const confirmationMessage = document.getElementById('confirmationMessage');

  // Avvia l'animazione per ogni euro inserito
  for (let i = 0; i < monetaInserita; i++) {
    setTimeout(() => {
      animateCoinExit();
    }, i * 200); // Delay per ogni moneta
  }

  // Azzerare il credito dopo l'ultima animazione
  setTimeout(() => {
    monetaInserita = 0;
    updateCreditDisplay();
  }, monetaInserita * 200 + 300);
}

function animateCoinExit() {
  const coin = document.createElement('div');
  coin.classList.add('coin');
  coin.textContent = '€1';

  const output = document.getElementById('coinOutputArea');
  output.appendChild(coin);

  coin.style.left = '0px';
  coin.style.top = '0px';
  coin.style.opacity = '1';

  setTimeout(() => {
    coin.style.top = '50px';  // animazione verso il basso
    coin.style.opacity = '0';
  }, 10);

  setTimeout(() => {
    coin.remove();
  }, 1100);
}



let acquisti = [];  // Array per memorizzare solo l'ultimo acquisto

function acquistaProdotto(nomeProdotto, prezzoProdotto) {
  // Aggiungi il prodotto acquistato all'array degli acquisti
  acquisti = [];  // Pulisce l'array per ogni nuovo acquisto
  acquisti.push({ nome: nomeProdotto, prezzo: prezzoProdotto });

  // Mostra il bottone scontrino
  const scontrinoBtn = document.getElementById('scontrinoBtn');
  scontrinoBtn.style.display = 'inline-block';
}

async function generaPDFScontrino() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Sfondo blu
  doc.setFillColor(0, 38, 84); // Blu scozzese
  doc.rect(0, 0, 210, 297, 'F');

  // Diagonale 1 (alto-sx -> basso-dx) come poligono bianco
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0);
  doc.triangle(0, 0, 20, 0, 210, 297, 'F');
  doc.triangle(210, 297, 190, 297, 0, 0, 'F');

  // Diagonale 2 (basso-sx -> alto-dx) come altro poligono bianco
  doc.triangle(0, 297, 20, 297, 210, 0, 'F');
  doc.triangle(210, 0, 190, 0, 0, 297, 'F');

  // Testo
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0); // Testo nero
  doc.setFontSize(22);
  doc.text("Scontrino McFratm", 20, 70);

  const data = new Date().toLocaleString();
  doc.text(`Data: ${data}`, 20, 80);

  let yOffset = 100;

  // Mostra gli acquisti
  acquisti.forEach(acquisto => {
    doc.text(`Prodotto: ${acquisto.nome} - Prezzo: €${acquisto.prezzo.toFixed(2)}`, 20, yOffset);
    yOffset += 10;
  });

  doc.setDrawColor(255, 255, 255);
  doc.line(20, yOffset + 10, 180, yOffset + 10);

  doc.setTextColor(0, 0, 0); // Nero
  doc.text("Grazie per l'acquisto! Forza Napoli!", 20, yOffset + 30);

  doc.save("scontrino.pdf");
  acquisti = [];
}

function showContent() {
  document.getElementById("mainContent").style.display = "block";
}

