  const personalBtn = document.getElementById('btn-personal');
  const personalGroup = document.getElementById('group-personal');

/*

  const writeUpsBtn = document.getElementById('btn-writeUps');
  const writeUpsGroup = document.getElementById('group-writeUps');

 */


  /* Logic for Home
  writeUpsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    writeUpsGroup.classList.toggle('hidden');
    personalGroup.classList.add('hidden'); // Hide the other group
  });
*/
 
  // Logic for personal with Password
  personalBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Stop the page from reloading/jumping
    
    // Simple prompt (Note: This is basic client-side security)
    const password = prompt("Please enter the password to view more:");
    

    if (password === "EasyPassword") {
      window.location.href="./personal.html";
    } else {
      alert("Incorrect password!");
    }
  });
