
 const MOBILE_SCREEN = 0;
 const TABLET_SCREEN = 1;
 const PC_SCREEN = 2;

 document.addEventListener("DOMContentLoaded", function() {

	 const container = document.getElementsByClassName("container")[0];
	 const movesDisplay = document.querySelector(".stats b");
	 const refresh = document.getElementById("refresh");
	 const stars = [...document.querySelectorAll(".stars i")];
	 const elapsed_time = document.querySelector("#elapsed b");
	 const cards = document.getElementsByClassName("card");
	 const againBtn = document.querySelector("#again");
	 const winContainer = document.querySelector(".card-container");

	 window.screen;
	 window.valid_pairs = 0;
	 const photos = ["fa-anchor","fa-bath","fa-bicycle","fa-ambulance",
	 				"fa-bomb","fa-book","fa-bolt","fa-briefcase",
	 				"fa-anchor","fa-bath","fa-bicycle","fa-ambulance",
	 				"fa-bomb","fa-book","fa-bolt","fa-briefcase"];
	 window.moves = 0;
	 window.elapsedTime = 0;
	 window.mySetInterval;
	 window.checkFor;

	 initGame(cards, photos,movesDisplay,stars,elapsed_time);

	 againBtn.addEventListener("click", function(event) {
	 	this.style.opacity = "0";
	 	const element = this;
		winContainer.style.visibility = "hidden";
		initGame(cards, photos,movesDisplay,stars,elapsed_time);
	 });

	 makeItResp(cards);

	 window.addEventListener("resize", function() {
	 	makeItResp(cards);
	 });

	 refresh.addEventListener("click",() => {
	 	initGame(cards,photos,movesDisplay,stars,elapsed_time);
	 });

 	container.addEventListener('click', function(event) {
	 	const card = event.target.closest(".card");
	 	if(card && card.classList.contains('cursor')) {
	 	//card not validated yet
			if(!window.mySetInterval) {
				window.mySetInterval = window.setInterval(() => {
					window.elapsedTime++;
					elapsed_time.textContent = formatTime();
				},1000);
			}
			//logic for same card clicked (2nd time)
	   		if(card.classList.contains("flip")) {
	   			card.classList.remove("flip");
	   			checkFor = undefined;
	   			return;
	   		}
	   		card.classList.add("flip");
	   		//save card to compare
	   		if(checkFor == undefined) {
	   			checkFor = [card.getAttribute("id"), card.getAttribute("data-icon")];
	   			return;
	   		}
	   		//compare cards
	   		else {
	   			if (checkFor[0] !== card.getAttribute("id") && checkFor[1] == card.getAttribute("data-icon")) {
   					moves++;
	   				movesDisplay.textContent = moves;
	   				if(moves%16 == 0 && moves !== 0){
	   					decreaseStars(stars);
	   				}
	   				//logic for valid pair
	   				const selectedCards =  document.querySelectorAll('.cursor.flip');
	   				selectedCards.forEach(
	   					(selectedCard) =>{
	   					selectedCard.classList.remove('cursor');
	   					selectedCard.classList.add("valid");
	   				});
	   				valid_pairs++;
	   				if(valid_pairs == 8) {
	   					//show winning card
	   					const showTime = winContainer.querySelector("#finished b");
	   					const showMoves = winContainer.querySelector("#moves b");
	   					const showStars = winContainer.querySelector("#stars b");
	   					againBtn.removeAttribute("style");
	   					clearInterval(mySetInterval);
	   					showStars.textContent = countStars(stars);
	   					showMoves.textContent = moves;
	   					showTime.textContent = formatTime();
	   					winContainer.style.visibility = "visible";
	   					winContainer.style.opacity = "1";
	   				}
	   			} else {
	   				//logic for unvalid pair
	   				moves++;
	   				movesDisplay.textContent = moves;
	   				if(moves % 16 == 0 && moves !== 0) {
	   					decreaseStars(stars);
	   				}
	   				const selectedCards =  document.querySelectorAll('.cursor.flip');
	   				selectedCards.forEach((card)=>{
	   					card.classList.add("unvalid");
	   				});
	   				setTimeout(
	   					function() {
	   						const selectedCards =  document.querySelectorAll('.cursor.flip');
			   				selectedCards.forEach((card)=>{
			   					card.classList.remove('flip',"unvalid");
			   				});
	   					}, 1000);
	   				}
	   			}//comparing end
	   			checkFor = undefined;
	 	}//end card check
	});//end container click listener
});


/**
* @description sets cards height | sets icons line height
* @param {HTMLCollection} cards
*/
function makeItResp(cards) {
	let winWidth = window.innerWidth;
	let icons =  [];
	for(const card of cards){
	 	card.style.height = card.clientWidth * 0.8 + "px";
	 	icons.push(card.querySelector(".fa"));
	 	card.querySelector(".fa").style.lineHeight = card.clientHeight + "px";
	}
	handleImSize(icons,winWidth);
}

/**
* @description shuffles the given array
* @param {Array} a
*/
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}

/**
* @description handles the display of icons on cards
* @param {HTMLCollection} cards
* @param {Array} photos
*/
function displayCards(cards, photos) {
	 for (let i = 0; i < 16; i++) {
	 	cards[i].querySelector('i').classList.add(photos[i]);
	 	cards[i].setAttribute('id',i);
	 	cards[i].setAttribute("data-icon",photos[i]);
	 }
}

/**
* @description initialize the game | initialize variables | run needed functions
* @param {HTMLCollection} cards
* @param {Array} photos
* @param {ElementNode} movesDisplay
* @param {Array} stars
* @param {ElementNode} elapsed_time
*/
function initGame(cards,photos,movesDisplay,stars,elapsed_time) {
	window.checkFor = undefined
	if(window.mySetInterval)
		clearInterval(window.mySetInterval);
	window.mySetInterval = undefined;
	window.moves = 0;
	window.elapsedTime = 0;
	window.valid_pairs = 0;
	elapsed_time.textContent = "0:00";
	for(const card of cards) {
		card.className = "card cursor";
	}
	movesDisplay.textContent = window.moves;
	//shuffle(photos);
	displayCards(cards, photos);
	initializeStars(stars);
}

/**
* @description decrease the number of stars(called every 16 moves)
* @param {Array} stars
*/
function decreaseStars(stars) {
	for(let i = stars.length-1; i >= 0; i--) {
		if(!stars[i].classList.contains("dis-star")){
			stars[i].classList.add("dis-star");
			break;
		}
	}
}

/**
* @description initialize the number of stars(called when reinitializing the game)
* @param {Array} stars
*/
function initializeStars(stars) {
	stars.forEach((star)=>{
		if(star.classList.contains("dis-star"));
			star.classList.remove("dis-star");
	});
}

/**
* @description count the number of stars(called when winning the game for stats displaying)
* @param {Array} stars
*/
function countStars(stars) {
	let nbStars = 0;
	stars.forEach((star)=>{
		if (!star.classList.contains("dis-star"))
			nbStars++;
	});
	return nbStars;
}

/**
* @description used to format elapsed_time variable(accessed from window object)
*/
function formatTime() {
	const min = Math.floor(window.elapsedTime / 60);
	const s = window.elapsedTime % 60;
	return s > 9 ? `${min}:${s}` : `${min}:0${s}`;
}

/**
* @description change icons size based on window width
* @param {Array} icons
* @param {number} winWidth(represents the width of the window)
*/
function handleImSize(icons,winWidth) {
	if (winWidth < 450 && window.screen !== MOBILE_SCREEN) {
		window.screen = MOBILE_SCREEN;
		icons.forEach((icon)=>{
			let dataIcon = icon.closest(".card").getAttribute("data-icon");
		  	icon.className = `fa ${dataIcon} fa-2x`;
		  	icon.style.marginBottom = parseFloat(icon.closest(".card").style.height)/3 + "px";
		});
	}
	else if (winWidth > 450 && winWidth < 768 && window.screen !== TABLET_SCREEN) {
		window.screen = TABLET_SCREEN;
		icons.forEach((icon)=>{
			let dataIcon = icon.closest(".card").getAttribute("data-icon");
		  	icon.className = `fa ${dataIcon} fa-3x`;
		  	icon.style.marginBottom = parseFloat(icon.closest(".card").style.height)/3 + "px";
		});
	}
	else if(winWidth > 768 && window.screen !== PC_SCREEN) {
		window.screen = PC_SCREEN;
		icons.forEach((icon)=>{
			let dataIcon = icon.closest(".card").getAttribute("data-icon");
		  	icon.className = `fa ${dataIcon} fa-3x`;
		});
	}
}