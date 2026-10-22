// Shared side menu for every page on the site.
// To add a machine, add it to MENU below and every page picks it up.
(function () {
    const MENU = [
        {
            name: 'Linux',
            groups: [
                {
                    name: 'Easy',
                    machines: [
                        ['Alert', '/linux/Easy/Alert'],
                        ['Beep', '/linux/Easy/Beep'],
                        ['Bashed', '/linux/Easy/Bashed'],
                        ['Orion', '/linux/Easy/Orion'],
                        ['Artificial', '/linux/Easy/Artificial'],
                        ['BoardLight', '/linux/Easy/BoardLight'],
                        ['Cap', '/linux/Easy/Cap'],
                    ],
                },
                {
                    name: 'Medium',
                    machines: [
                        ['Cronos', '/linux/Medium/Cronos'],
                    ],
                },
            ],
        },
        {
            name: 'Windows',
            groups: [
                {
                    name: 'Easy',
                    machines: [
                        ['Active', '/windows/Easy/Active'],
                    ],
                },
            ],
        },
    ];

    // Compare paths without ".html" or a trailing "/", so "/linux/Easy/Alert.html" matches "/linux/Easy/Alert".
    const normalize = (path) => path.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    const current = normalize(location.pathname);

    const groupsHtml = (os) => os.groups.map((group) => {
        const id = `${os.name}-${group.name}`.toLowerCase();
        const sorted = [...group.machines].sort(([a], [b]) => a.localeCompare(b));
        const items = sorted.map(([name, url]) => {
            const active = normalize(url) === current ? ' class="active"' : '';
            return `<li><a href="${url}"${active}><h5>${name}</h5></a></li>`;
        }).join('');
        return `
                <li class="diff-item">
                    <button class="diff-btn" onclick="toggleGroup('${id}')"><h4>${group.name}</h4></button>
                    <ul id="${id}" class="sub-machine-list hidden">${items}</ul>
                </li>`;
    }).join('');

    const osHtml = MENU.map((os) => {
        const id = `group-${os.name}`.toLowerCase();
        return `
        <div class="nav-item">
            <button class="category-btn" onclick="toggleGroup('${id}')"><h3>${os.name}</h3></button>
            <ul id="${id}" class="machine-list hidden">${groupsHtml(os)}
            </ul>
        </div>`;
    }).join('');

    const aside = document.createElement('aside');
    aside.className = 'site-nav';
    aside.innerHTML = `
        <a href="/machines.html" class="category-btn"><h1>Write Ups 📜</h1></a>
        <nav>
            <div class="nav-item">
                <a href="/index.html" class="category-btn"><h3>Home</h3></a>
            </div>
            ${osHtml}
        </nav>`;

    // Move the existing page into a content column beside the menu.
    const content = document.createElement('div');
    content.className = 'site-content';
    content.append(...document.body.childNodes);

    const layout = document.createElement('div');
    layout.className = 'site-layout';
    layout.append(aside, content);
    document.body.append(layout);

    // Open the group that holds the page you are on.
    const active = aside.querySelector('a.active');
    for (let list = active && active.closest('ul'); list; list = list.parentElement.closest('ul')) {
        list.classList.remove('hidden');
    }

    window.toggleGroup = (id) => document.getElementById(id).classList.toggle('hidden');

    // Styles are scoped to the menu, so every page looks the same whatever CSS it already has.
    const style = document.createElement('style');
    style.textContent = `
        body { margin: 0; }
        .site-layout { display: flex; min-height: 100vh; width: 100%; }
        .site-content { flex: 1; min-width: 0; }
        .site-nav {
            width: 300px; flex-shrink: 0; height: 100vh; position: sticky; top: 0; overflow-y: auto;
            padding: 2rem 1rem; background: #161b22; border-right: 1px solid #30363d;
            font-family: 'Courier New', monospace;
        }
        .site-nav h1 { font-size: 1.4rem; text-align: center; padding-bottom: 1rem; margin-bottom: 2rem; border-bottom: 1px solid #30363d; color: #79c0ff; }
        .site-nav ul { list-style: none; margin: 0; padding: 0; }
        .site-nav li { margin: 0; }
        .site-nav h1, .site-nav h3, .site-nav h4, .site-nav h5 { margin: 0; line-height: 1.3; }
        .site-nav a, .site-nav button { font-family: inherit; text-decoration: none; }
        .site-nav .category-btn { display: block; width: 100%; padding: 10px; background: none; border: none; text-align: left; color: #79c0ff; cursor: pointer; }
        .site-nav h3 { font-size: 1.1rem; }
        .site-nav h4 { font-size: 1rem; }
        .site-nav h5 { font-size: .95rem; }
        .site-nav .category-btn:hover, .site-nav .diff-btn:hover { color: #58a6ff; }
        .site-nav .machine-list { padding-left: 15px; margin: 5px 0 15px 10px; border-left: 1px solid #30363d; }
        .site-nav .diff-btn { display: block; width: 100%; padding: 5px 10px; background: none; border: none; text-align: left; color: #79c0ff; cursor: pointer; }
        .site-nav .diff-btn:hover { color: #ff7b72; }
        .site-nav .sub-machine-list { padding-left: 20px; margin: 0 0 10px 15px; border-left: 1px dashed #30363d; }
        .site-nav .sub-machine-list a { display: block; padding: 6px 0; color: #8b949e; }
        .site-nav .sub-machine-list a:hover { color: #58a6ff; }
        .site-nav .sub-machine-list a.active { color: #3fb950; font-weight: bold; }
        .site-nav .hidden { display: none; }
        @media (max-width: 768px) {
            .site-layout { flex-direction: column; }
            .site-nav { width: 100%; height: auto; position: relative; border-right: none; border-bottom: 1px solid #30363d; }
        }
    `;
    document.head.append(style);
})();
