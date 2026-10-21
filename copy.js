// Adds a Copy button above every terminal box on the page.
document.querySelectorAll('.terminal-box').forEach((box) => {
    if (box.parentElement.className === 'terminal-wrapper') return;

    const wrapper = document.createElement('div');
    wrapper.className = 'terminal-wrapper';

    const header = document.createElement('div');
    header.style = "display: flex; justify-content: flex-end; padding-bottom: 8px;";
    header.className = 'terminal-header';

    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerText = 'Copy';
    btn.style = "position:static; padding:4px 10px;";

    box.parentNode.insertBefore(wrapper, box);
    wrapper.appendChild(header);
    header.appendChild(btn);
    wrapper.appendChild(box);

    btn.onclick = function () {
        navigator.clipboard.writeText(box.innerText).then(() => {
            btn.innerText = 'Copied!';
            setTimeout(() => { btn.innerText = 'Copy'; }, 2000);
        });
    };
});
