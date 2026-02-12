let startTime = 0;
let timeElapsed = 0;
let intervalId = null;

const MAX_TIME =  5 * 60 * 1000;

document.addEventListener("DOMContentLoaded", () => {
  const time = document.getElementById("time");
  startTimer(time);
});

/*
function start() {
    if (intervalId) return; 
    startTime = Date.now() - timeElapsed;
    intervalId = setInterval(() => {
        timeElapsed = Date.now() - startTime;
        if (timeElapsed >= MAX_TIME) {
            alert('Do you like it this much?')
            reset();
            return;
        }
        time.innerHTML = formatTime(timeElapsed);
  }, 1000);
}

function pause() {
    clearInterval(intervalId);
    intervalId = null;
}

*/

function reset(time) {
    clearInterval(intervalId);
    intervalId = null;
    timeElapsed = 0;
    startTime = 0;
    time.innerHTML = "00:00";
  }


function startTimer(time) { 
  if (intervalId) return; 
  startTime = Date.now() - timeElapsed;
  intervalId = setInterval(() => {
      timeElapsed = Date.now() - startTime;
      if (timeElapsed >= MAX_TIME) {
          alert('Do you like it this much?')
          reset(time);
          startTimer(time);
          return;
      }
      time.textContent = formatTime(timeElapsed);
}, 1000);
}



  function formatTime(ms) {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms /1000 )% 60);
  
     return (
       String(minutes).padStart(2, "0") + ":" +
       String(seconds).padStart(2, "0") 
     );
   }



  
/* I could use this type of function for the alert action.

setTimeout(reset, 3600000);

*/
