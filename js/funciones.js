


/*--------------------------------------------------------
	homeInit()

	Parametros: ninguno
	Que hace: La función es llamada cuando el HTML del Home la solicita. Por
			  otro lado la función sirve para mover los elementos de la portada.

--------------------------------------------------------*/


//Estos son los elementos que vamos a mover
function homeInit(){


	let tigreIMG = document.querySelector(".portada img");
	let tituloPrincipal= document.querySelector(".portada h1");
	//Decidi agarrar exactamente el punto inicial de como setie mi left en CSS para que si modifico a futuro esta posición se adapte
	let startValueIMG = parseInt(window.getComputedStyle(tigreIMG).getPropertyValue('left'));
	let startValueTitle = parseInt(window.getComputedStyle(tituloPrincipal).getPropertyValue('left'));
	
	window.addEventListener("scroll", ()=>{
		

		let value = window.scrollY;
		
		console.log(startValueIMG, startValueTitle);

		tigreIMG.style.left = (startValueIMG + (value * 0.1)) + "px"; //Para ser precisa con el valor usamos el starting point y le sumamos el valor de scrollY * 0.1 para que no sea muy grande el salto del scroll
		tituloPrincipal.style.left = (startValueTitle - value) + "px"; //Aquí con el valor initial del titulo le vamos a restar el valor porq quiero q se mueva hacia la izquierda
	})

	/*--------------------------------------------------------
	scrollToSection()

	Parametros: ninguno
	Que hace: La funcion es para que el botón de click y vaya a la siguiente sección

	--------------------------------------------------------*/
	const btnExplorar = document.querySelector(".portada button");
	const toSection = document.querySelector(".cuerpoTexto section:first-child");

	btnExplorar.addEventListener('click', () => {
		const topOfElement = toSection.offsetTop;
		window.scrollTo({
			top: topOfElement - 110,
			behavior: 'smooth'  // This makes the scroll movement smooth
		});
	});
}


	
	


/*--------------------------------------------------------
	piecesInit()
	
	Parametros: ninguno
	Que hace: La función es simplemente para que se active solo si el HTML de piezas lo llama. Dentro de ella
			  vienen las funciones importantes para el mecanismo del 360 de las imagenes. 

--------------------------------------------------------*/

function piecesInit(){

	const elContainer = document.querySelector(".containerPiezas-marco");
	let elContainerHeight;
	const laImagen = document.querySelector(".containerPiezas-marco img");
	let posStart = 0; //posición inicial de la imagen dentro del contenedor
	let posChange; //Esta variable sirve para el desplazamiento de la imagen en la rotación explicada más adelante
	let startPosX = 0; // Con esta variable reconocemos el punto inicial de donde el usuario dio click

	let isMouseDown = false; // Con esta variable traqueamos si mouseDown/touchDown esta activo


	/*--------------------------------------------------------
		initialSetup(event)

		Parametros: event
		Que hace: El objetivo es primero prevenir el default de "drag" cuando damos click a un objeto y movemos el mouse.
				  Luego isMouseDown se convierte en true para dar paso a que el usuario ha dado click en la imagen.
				  startPosX se asigna al event.clientX que es las coordenadas de donde pulso el usuario en la pantalla

	--------------------------------------------------------*/

	function initialSetup(event){
		elContainerHeight = parseInt(window.getComputedStyle(elContainer).height);
		posChange = elContainerHeight;
		// Prevenir el default del evento
		event.preventDefault();
		// Cuando el mouse se presiona esta variable se convierte en true
		isMouseDown = true;
		// almacenamos la posición inicial en X del mouse del usuario 
		startPosX = event.clientX;
		
	}

	/*--------------------------------------------------------
		imageMove (event)

		Parametros: event
		Que hace: El objetivo es primero verificar que isMouseDown es verdadero. Luego creamos la variable currentPosX para 
		identificar las coordenadas de donde esta moviendo el mouse el usuario. Luego creamos diffX que es la diferencia entre 
		la posicion que esta actualmente el usuario, menor la de su posición inicial (startPosX). Con esto identificaremos mas 
		adelante si el usuario se mueve derecha o izquierda. Podemos saber esto comparando si es mayor o menor a cero. 
		Por ejemplo si el usuario dio click en la coordenada 300, y se mueve a la derecha a la coordenada 500, entonces 
		500-300 = 200 (el diffX) 200 si es mayor a 0. Si fuese al revez que se mueve de 300 a 100, entonces 100 - 300 = -200, 
		el cual es menor a 0. Entonces si mueve a la derecha y la posStart (que es la posición inicial de la imagen dentro del
		contenedor) es menor a laImange.height menos el posChange (no queremos que llegue a la altura completa porque se sale 
		la foto del marco) sumamos al posStart el posChange (que es 500px, esto se setea para que este acorde al contenedor de 500px),
		se actualiza laImagen.style.top con el nuevo valor y asi tenemos el primero efecto de rotación. Luego, si diffX es menor a 0, 
		sabemos que se mueve a la izquierda, entonces primero verificamos si posStart es igual a 0, ya que si es asi debemos indicarle
		que la posStart al moverse vamos a "reiniciar" la posición desde la última parte de la imagen. Si posStart no es igual a 0 
		y es mayor a 0, entonces vamos a restarle al posStart el posChange, y hacer el mismo procedimiento de asignarle a laImagen.style.top
		la nueva posición. Cuando en el style de laImagen ponemos un "-", es porque el resultado en positivo hace que la imagen se 
		desplaze hacia abajo, y queremos que el efecto sea el contrario. 

	--------------------------------------------------------*/


	function imageMove(event){
		if (isMouseDown) {
			
			
		    // Calcular la diferencia de la posicion X comparando desde donde inicio

			//esta variable va a ser la posición inicial del usuario 
			let currentPosX; 
			//este toggle sirve para identificar si se trata de un dispositivo mobile o el usuario esta rotando desde desktop
			event instanceof  MouseEvent ? currentPosX = event.clientX : currentPosX = event.touches[0].clientX; 

			//diffX para calcula la diferencia cuando usuario se mueve en X
			let diffX = currentPosX - startPosX;

		     // Si diffX es mayor a cero, mouse se movio a la derecha. Si diffX es menor a cero, mouse se movio a la izquieda.
			if (diffX > 0) {
		            // Mouse se mueve a la derecha
				if(posStart < (laImagen.height - posChange)){
					posStart += posChange;
					//console.log('se sumo' + posStart);
					laImagen.style.top = `-${posStart}px`;
				}else{
					posStart = 0;
					laImagen.style.top = `-${posStart}px`;
				}

			} else if (diffX < 0) {
		            // Mouse se mueve a la izquierda

				if(posStart == 0){
					posStart = laImagen.height - posChange;
					laImagen.style.top = `-${posStart}px`;
				}

				if(posStart > 0){
					posStart -= posChange;
					//console.log('se resto' + posStart);
					laImagen.style.top = `-${posStart}px`;
				}
			}
		        // Update startPosX to currentPosX for continuous movement tracking
			startPosX = currentPosX;
		}
	}


	//Aqui asignamos los eventos que elContainer debe escuchar

	elContainer.addEventListener('mousedown', initialSetup);
	elContainer.addEventListener('touchstart', initialSetup);

	window.addEventListener('mouseup', function(event) {
		// cuando el mouse ya no esta encima del contenedor se desactiva
		isMouseDown = false;
	});

	window.addEventListener('touchend', function(event) {
		// cuando el mouse ya no esta encima del contenedor se desactiva
		isMouseDown = false;
	});

	window.addEventListener('touchcancel', function(event) {
		// cuando el mouse ya no esta encima del contenedor se desactiva
		isMouseDown = false;
	});

	elContainer.addEventListener('mousemove', imageMove);
	elContainer.addEventListener('touchmove', imageMove);



}




//---------------------------------------------------------- PANELES

const btnTabs = document.querySelectorAll(".tabs button");
const paneles = document.querySelectorAll(".panel");


btnTabs.forEach((obj,i)=>{
	
	obj.addEventListener("click", ()=>{
		!obj.classList.contains("activo") ? elToggle(i) : quitarActivo();
	})

});



function elToggle(i){
	quitarActivo();
	ponerActivo(i);
}



function quitarActivo(){
	for(let i=0; i<btnTabs.length; i++){
		btnTabs[i].classList.remove("activo");
		paneles[i].classList.remove("activo");
	}
}

function ponerActivo(i){
	btnTabs[i].classList.add("activo");
	paneles[i].classList.add("activo");
}

/*---------------NAV----------------*/

const navegacion = document.querySelector("nav");
const btnNav = document.querySelectorAll(".abrir , .cerrar");



btnNav.forEach((obj)=>{

	obj.addEventListener("click",()=>{
		navegacion.classList.toggle("desplegado");
	});


}); 