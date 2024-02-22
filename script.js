const container = document.querySelector(".container");
const title = document.querySelectorAll(".container__title");
const img = document.querySelector(".container__img")
const boton = document.querySelector(".container__button");
const boton2 = document.querySelector(".button-2")
const audioFondo =  document.getElementById("audioFondo");
const audio =  document.getElementById("audio");
const iconFondo = document.getElementById("fondo")
const iconEfect = document.getElementById("efecto")
const divSound = document.querySelector(".div-sound")
const text = document.querySelector(".text")

let language = "";

//---Temporizador--
let time = {
  segundos: 0,
  minutos: 0
};


let nIntervId;

function temporizador() {
  // check if an interval has already been set up
  if (!nIntervId) {
    nIntervId = setInterval(startTempo, 1000);
  }
}

function startTempo() {
    time.segundos++;
    if (time.segundos == 60) {
    	time.minutos++
    	time.segundos = 0;
    }
   
}

function stop() {
  clearInterval(nIntervId);
  nIntervId = null;
}

//---Temporizador--

//1.png,2.png
const arrayImg = [];

//for para crear un array con las img
for (var i = 1; i <= 10; i++) {
	arrayImg.push(i + ".png")
}

//array doble de img
const memorias = [...arrayImg,...arrayImg];

//---funcion para ordernar de forma aleatoria---
function ordenarAleatoriamente(array) {
  function comparacionAleatoria() {
    return Math.random() - 0.5;
  }
  array.sort(comparacionAleatoria);
}

ordenarAleatoriamente(memorias);
//---funcion para ordernar de forma aleatoria---


let cartasComparar = [];
let bloques = []
let funcionEnEjecucion = false;
let aciertos = 0;
let fallos = 0;

//---comienza el juego---
function start() {
	//comienza el temporizador
	temporizador()

	const containerFlags = document.querySelector(".container-flags")
	// se oculta el boton, img y titulo
	title[0].style.display = "none";
	title[1].style.display = "none";
	text.style.display = "none"
	img.style.display = "none";
	boton.style.display = "none";
	divSound.style.display = "flex";
	containerFlags.style.display = "none";
	
	//Se reproduce el audio de fondo
	audioFondo.play();
	audio.play();

	//se agrega el contenedor del juego
	const containerGame = `<div class="container-game"></div>`;
	container.insertAdjacentHTML("afterbegin", containerGame)
	const containerGameClass = document.querySelector(".container-game")

	//Se agrega las imagenes al contenedor
	for (memoria of memorias) {
		const memoriaImg = `<div class="card">
		<div class="face-front"></div>
		<img src="img/${memoria}" alt="" class="container-game-img"
		</div>`
		containerGameClass.insertAdjacentHTML("afterbegin", memoriaImg)
	}

	//array de las caras 
	const arrayMemoriaImg = document.querySelectorAll(".face-front");

	//funcion para mostrar la carta
	function mostrarCarta(e){
	if (!funcionEnEjecucion) {
		//---se muestra la carta---
    	e.target.style.display = "none";
		e.target.style.background = "transparent"
		e.target.nextElementSibling.classList.toggle("mostrar")
		setTimeout(()=>{
			e.target.nextElementSibling.style.opacity = "1";
			audio.play();
		},100)
		//---se muestra la carta---

		//Compara las dos cartas
		cartasComparar.push(e.target.nextElementSibling);
		bloques.push(e.target)

		if (cartasComparar.length == 2) {
			// Marca la función como en ejecución
        funcionEnEjecucion = true;

        //Si las dos cartas son iguales
				if (cartasComparar[0].src === cartasComparar[1].src) {
					aciertos++
					console.log("aciertos",aciertos)
					setTimeout(()=>{
						cartasComparar[0].style.display = "none";
					cartasComparar[1].style.display = "none";
					cartasComparar = [];
					bloques = [];
					if (aciertos == 10){
						stop()
						const winAlert = document.getElementById('win');
						const successes = document.querySelector(".container-modal__successes")
						winAlert.style.display = "block"
						const timeTextWin = document.querySelector(".container-modal__time");
						if(language == "ingles"){
							timeTextWin.innerHTML = `Your time was: ${time.minutos}m ${time.segundos}s `;
							successes.innerHTML = `<span class="red">You failed: </span>${fallos} veces`
						} else if (language == "portugues") {
							timeTextWin.innerHTML = `Seu tempo foi: ${time.minutos}m ${time.segundos}s `;
							successes.innerHTML = `<span class="red">Você falhou: </span>${fallos} veces`
						} else {
							timeTextWin.innerHTML = `Tu tiempo fue de: ${time.minutos}m ${time.segundos}s `;
							successes.innerHTML = `<span class="red">Fallaste: </span>${fallos} veces`
						}
  					
  					}
					},500)
					
				} else {
					//Si las dos cartas no son iguales
					fallos++
						setTimeout(()=>{
							cartasComparar[0].classList.remove("mostrar")
							cartasComparar[0].style.opacity = "0";
							cartasComparar[1].classList.remove("mostrar")
							cartasComparar[1].style.opacity = "0";
							bloques[0].style.display = "block";
							bloques[0].style.background = "#ffb30b"
							bloques[1].style.display = "block";
							bloques[1].style.background = "#ffb30b"
							cartasComparar = [];
							bloques = [];
							
						},1000)
					
				}

				//despues de abrir dos cartas, esperar un 1s para abrir otra carta
				 setTimeout(function () {
                funcionEnEjecucion = false;
            }, 1000);
		}
            
  }
	}
	//A cada carta agregar un evento para mostrar
	for (elem of arrayMemoriaImg) {
		elem.addEventListener("click",mostrarCarta)
	}
}

//para mutear el sonido de fondo
function muted(){
	iconFondo.classList.toggle("activado")
	if (iconFondo.classList.contains("activado")) {
		iconFondo.src = "icon/volume-xmark-solid.svg"
		audioFondo.pause();
	} else {
		iconFondo.src = "icon/volume-high-solid.svg"
		audioFondo.play();
	}
}

//para mutear el sonido de efecto
function mutedEfect() {
	iconEfect.classList.toggle("activado")
	if (iconEfect.classList.contains("activado")) {
		iconEfect.src = "icon/volume-xmark-solid.svg"
		audio.muted = true
	} else {
		iconEfect.src = "icon/volume-high-solid.svg"
		audio.muted = false
	}

}

iconFondo.addEventListener("click",muted)
iconEfect.addEventListener("click",mutedEfect)
boton.addEventListener("click",start)

const buttonSpain = document.querySelector(".button-spain");
const buttonBrazil = document.querySelector(".button-brazil");
const buttonUsa = document.querySelector(".button-usa");

function spain(){
    const title = document.querySelector("#container__title");

    title.innerHTML = "Juego de Memoria"

    const buttonStart = document.querySelector(".container__button");
    buttonStart.innerHTML = "JUGAR";

    const text = document.querySelector(".text");
	text.innerHTML = "¡Que disfrutes del juego y que la Fuerza te acompañe!"
	
	const modalTitle = document.querySelector(".container-modal__title");
	modalTitle.innerHTML = "¡Pasaste el juego!"

	const modalText = document.querySelector(".container-modal__text");
	modalText.outerHTML = `<p class="container-modal__text">Puedes enviarme un capture a mi <a href="https://www.instagram.com/wilker31vivas/" target="_blank">instagram</a></p>`
	
	const modalButton = document.querySelector(".container-modal__button");
	modalButton.outerHTML = `<button class="container-modal__button"><a href="https://memory-starwars.netlify.app">Volver a jugar</a></button>`

    const sound = document.querySelector("#sonido")
	sound.innerHTML = "Sonido de fondo:"
    const effect = document.querySelector("#efecto")
	effect.innerHTML = "Sonido de efecto:"
	
	language = "spain"
	const copyright = document.querySelector(".copyright");
    copyright.innerHTML = `Hecho por <a href="https://www.instagram.com/wilker31vivas/" target="_blank" class="copyright-a">Wilker</a>`
}

function brazil(){
	const title = document.querySelector("#container__title");

    title.innerHTML = "Jogo de memoria"

    const buttonStart = document.querySelector(".container__button");
    buttonStart.innerHTML = "JOGAR";

    const text = document.querySelector(".text");
	text.innerHTML = "¡Que você aproveite o jogo e que a Força esteja com você!"
	
	const modalTitle = document.querySelector(".container-modal__title");
	modalTitle.innerHTML = "¡Ganhou o jogo!"

	const modalText = document.querySelector(".container-modal__text");
	modalText.outerHTML = `<p class="container-modal__text">Você pode me enviar um print para meu <a href="https://www.instagram.com/wilker31vivas/" target="_blank">instagram</a></p>`
	
	const modalButton = document.querySelector(".container-modal__button");
	modalButton.outerHTML = `<button class="container-modal__button"><a href="https://memory-starwars.netlify.app">Jogar de novo</a></button>`

    const sound = document.querySelector("#sonido")
	sound.innerHTML = "Som de fundo:"
    const effect = document.querySelector("#efecto")
	effect.innerHTML = "Som de efeito:"
	
	language = "portugues"
	const copyright = document.querySelector(".copyright");
    copyright.innerHTML = `Feito por <a href="https://www.instagram.com/wilker31vivas/" target="_blank" class="copyright-a">Wilker</a>`
}

function usa(){
	const title = document.querySelector("#container__title");

    title.innerHTML = "Memory game"

    const buttonStart = document.querySelector(".container__button");
    buttonStart.innerHTML = "START";

    const text = document.querySelector(".text");
	text.innerHTML = "¡May you enjoy the game and may the Force be with you!"
	
	const modalTitle = document.querySelector(".container-modal__title");
	modalTitle.innerHTML = "¡You won the game!"

	const modalText = document.querySelector(".container-modal__text");
	modalText.outerHTML = `<p class="container-modal__text">You can send a screenshot to my <a href="https://www.instagram.com/wilker31vivas/" target="_blank">instagram</a></p>`
	
	const modalButton = document.querySelector(".container-modal__button");
	modalButton.outerHTML = `<button class="container-modal__button"><a href="https://memory-starwars.netlify.app">Play again</a></button>`

    const sound = document.querySelector("#sonido")
	sound.innerHTML = "Background sound:"
    const effect = document.querySelector("#efecto")
	effect.innerHTML = "Effect sound:"
	

	const copyright = document.querySelector(".copyright");
    copyright.innerHTML = `Made by <a href="https://www.instagram.com/wilker31vivas/" target="_blank" class="copyright-a">Wilker</a>`
	language = "ingles";
}

buttonSpain.addEventListener("click",spain);
buttonBrazil.addEventListener("click",brazil);
buttonUsa.addEventListener("click", usa);