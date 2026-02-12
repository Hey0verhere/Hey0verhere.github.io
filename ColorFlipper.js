
 function randomColor() {
   // Instead of return I could use 'const random = ...
    return `rgb(
    ${Math.floor(Math.random() * 255)} , ${Math.floor(Math.random() * 255)} , ${Math.floor(Math.random() * 255)})`

 /*   document.body.style.backgroundColor = random1;
 
    const random2 = `rgb(
    ${Math.round(Math.random() * 255)} ,
    ${Math.round(Math.random() * 255)} ,
    ${Math.round(Math.random() * 255)})`
    document.getElementById("color").style.background= random2;
 */
    }

 function randomColorAndPosition() {
    const buttonColor = randomColor();
    const bgColor = randomColor();

    document.body.style.backgroundColor =  bgColor;

    const button = document.getElementById("color");
    button.style.backgroundColor = buttonColor;

    const maxX = window.innerWidth - button.offsetWidth;
    const maxY = window.innerHeight - button.offsetHeight;
  
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
  
    button.style.left = randomX + "px";
    button.style.top = randomY + "px";
 }