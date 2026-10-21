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
  // SHA-256 of the password, so the password itself is not in the source
  const PERSONAL_PASSWORD_SHA256 = "08ef01d39d4a5ae26d9318a33d173bd479dda1af4fd0b80cb97441826cb54bab";

  personalBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // Stop the page from reloading/jumping

    // Simple prompt (Note: This is basic client-side security)
    const password = prompt("Please enter the password to view more:");
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
    const hash = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');

    if (hash === PERSONAL_PASSWORD_SHA256) {
      window.location.href="./personal.html";
    } else {
      alert("Incorrect password!");
    }
  });
