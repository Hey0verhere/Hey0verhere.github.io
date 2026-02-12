const LinuxBtn = document.getElementById('btn-Linux');
const LinuxGroup = document.getElementById('group-Linux');
const WindowsBtn = document.getElementById('btn-Windows');
const WindowsGroup = document.getElementById('group-Windows');


LinuxBtn.addEventListener('click', (e) => {
    e.preventDefault();
    LinuxGroup.classList.toggle('hidden');
    WindowsGroup.classList.add('hidden'); // Hide the other group
  });

  WindowsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    WindowsGroup.classList.toggle('hidden');
    LinuxGroup.classList.add('hidden'); // Hide the other group
  });
