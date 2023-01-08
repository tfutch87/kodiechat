const button = document.querySelector('#container button');
const popUpOverLay = document.querySelector('.pop-section');



function closePopUp(e){

    // e.preventDefault();
    
    const tl = gsap.timeline()

    tl.to('.pop-section', {
        y: '1100',
        duration: 0.50,
        opacity: 0,

    })

}



async function renderData() {
    const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
    const data = await response.json();
    document.querySelector('#randomQuote').innerHTML = ` <p>Did you know?</p> ${data.text}`;
  }

  renderData();

//   Typing effect

  function typingEffect(str, element) {
    let i = 0;
    let text = "";
    let speed = 50;
  
    function type() {
      if (i < str.length) {
        text += str.charAt(i);
        element.innerHTML = text;
        i++;
        setTimeout(type, speed);
      }
    }
  
    type();
  }
  
  gsap.set('.name', { opacity: 0});

  setTimeout(()=>{

    const element = document.querySelector(".name");

    gsap.to('.name', {opacity: 1})

    typingEffect(element.innerText, element);

  }, 2500)

  gsap.set('#bottom-section', {y: 20, opacity: 0});
  gsap.set('.welcomeMessage', {y: 20, opacity: 0})


  setTimeout(()=>{


    const element = document.querySelector(".welcomeMessage");

    gsap.to('.welcomeMessage', {opacity: 1})


    typingEffect(element.innerText, element);

   gsap.to('#bottom-section', {y: 0,  ease: "power2.out", opacity: 1, delay:0.02})

    
  }, 4500)

