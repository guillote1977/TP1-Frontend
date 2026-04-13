const btnTheme = document.getElementById('btn-theme');
const body = document.body;

if (btnTheme) {
    const THEME_KEY = 'devpet-theme';

    const setDarkMode = (isDark) => {
        body.classList.toggle('dark-mode', isDark);
        btnTheme.textContent = isDark ? 'Modo Claro ☀️' : 'Modo Oscuro 🌙';
    };

    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark') {
        setDarkMode(true);
    } else if (stored === 'light') {
        setDarkMode(false);
    } else {
        setDarkMode(window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false);
    }

    btnTheme.addEventListener('click', () => {
        const nextIsDark = !body.classList.contains('dark-mode');
        setDarkMode(nextIsDark);
        localStorage.setItem(THEME_KEY, nextIsDark ? 'dark' : 'light');
    });
}

const ensurePawLayer = () => {
    let layer = document.getElementById('paw-rain');
    if (!layer) {
        layer = document.createElement('div');
        layer.id = 'paw-rain';
        document.body.appendChild(layer);
    }
    return layer;
};

const pawCascade = () => {
    const layer = ensurePawLayer();
    const count = 70;
    const width = window.innerWidth || 1;

    for (let i = 0; i < count; i += 1) {
        const paw = document.createElement('span');
        paw.className = 'paw-print';
        paw.textContent = '🐾';

        const x = 12 + Math.random() * Math.max(1, width - 24);
        const clampedX = Math.max(12, Math.min(width - 12, x));

        paw.style.left = `${clampedX}px`;
        paw.style.setProperty('--paw-delay', `${Math.random() * 1.25}s`);
        paw.style.setProperty('--paw-duration', `${3.6 + Math.random() * 3.2}s`);
        paw.style.setProperty('--paw-rot', `${Math.round(Math.random() * 90 - 45)}deg`);
        paw.style.setProperty('--paw-size', `${Math.round(14 + Math.random() * 18)}px`);
        paw.style.setProperty('--paw-drift', `${Math.round(Math.random() * 140 - 70)}px`);
        paw.style.setProperty('--paw-opacity', `${(0.45 + Math.random() * 0.40).toFixed(2)}`);

        paw.addEventListener('animationend', () => {
            paw.remove();
        }, { once: true });

        layer.appendChild(paw);
    }

    while (layer.childElementCount > 280) {
        layer.firstElementChild?.remove();
    }
};

const brandLink = document.querySelector('.brand');
if (brandLink) {
    brandLink.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : null;
        const clickedImage = target?.closest('img');
        if (!clickedImage) return;

        const url = new URL(brandLink.getAttribute('href') || '', window.location.href);
        const isSamePage = url.pathname === window.location.pathname;

        event.preventDefault();
        pawCascade();

        if (!isSamePage) {
            window.setTimeout(() => {
                window.location.href = url.toString();
            }, 420);
        }
    });
}

const ensurePageLoader = () => {
    let loader = document.getElementById('page-loader');
    if (loader) return loader;

    loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.dataset.visible = 'false';
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-live', 'polite');
    loader.setAttribute('aria-label', 'Cargando');

    const panel = document.createElement('div');
    panel.className = 'loader-panel';

    const scan = document.createElement('div');
    scan.className = 'loader-scan';

    const top = document.createElement('div');
    top.className = 'loader-top';

    const dots = document.createElement('div');
    dots.className = 'loader-dots';
    const dotRed = document.createElement('span');
    dotRed.className = 'loader-dot is-red';
    const dotYellow = document.createElement('span');
    dotYellow.className = 'loader-dot is-yellow';
    const dotGreen = document.createElement('span');
    dotGreen.className = 'loader-dot is-green';
    dots.append(dotRed, dotYellow, dotGreen);

    const title = document.createElement('div');
    title.className = 'loader-title';
    title.textContent = 'Cargando portafolio';

    top.append(dots, title);

    const code = document.createElement('div');
    code.className = 'loader-code';
    code.dataset.role = 'loader-code';
    code.textContent = '$ build --optimize';

    const cursor = document.createElement('span');
    cursor.className = 'loader-cursor';
    cursor.textContent = '▌';
    code.append(cursor);

    const bar = document.createElement('div');
    bar.className = 'loader-bar';

    panel.append(scan, top, code, bar);
    loader.append(panel);
    document.body.append(loader);

    return loader;
};

const showPageLoader = (line) => {
    const loader = ensurePageLoader();
    const code = loader.querySelector('[data-role="loader-code"]');

    if (code) {
        const cursor = code.querySelector('.loader-cursor');
        code.textContent = line;
        if (cursor) code.append(cursor);
        else {
            const nextCursor = document.createElement('span');
            nextCursor.className = 'loader-cursor';
            nextCursor.textContent = '▌';
            code.append(nextCursor);
        }
    }

    document.body.classList.add('is-loading');
    loader.dataset.visible = 'true';
};

const hidePageLoader = () => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.dataset.visible = 'false';
    document.body.classList.remove('is-loading');
};

window.addEventListener('pageshow', () => {
    hidePageLoader();
});

document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest('a.btn-perfil');
    if (!link) return;
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== '_self') return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();

    const lines = [
        '$ npm run build',
        '$ ng build --configuration production',
        '$ python -m pip install -r requirements.txt',
        '$ cargo build --release',
        '$ docker compose up --build',
        '$ make deploy',
    ];
    showPageLoader(lines[Math.floor(Math.random() * lines.length)]);

    window.setTimeout(() => {
        window.location.href = url.toString();
    }, 2400);
});
