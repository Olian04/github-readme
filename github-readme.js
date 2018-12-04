window.customElements.define('github-readme', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.prepareAttributes();

        const shadowRoot = this.attachShadow({
            mode: 'open'
        });
        const markdownScript = document.createElement('script');
        markdownScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.0/showdown.min.js';
        markdownScript.async = false;
        const historyScript = document.createElement('script');
        historyScript.src = 'https://unpkg.com/history/umd/history.min.js';
        historyScript.async = false;
        const root = document.createElement('div');
        root.className = 'root';
        const githubStyles = document.createElement('link');
        githubStyles.rel = 'stylesheet';
        githubStyles.href = 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css';
        const style = document.createElement('style');
        style.type = 'text/css';
        const color = {
            light: '#dfe2e5',
            dark: '#4F4F4F'
        }
        style.appendChild(document.createTextNode(`
:host {
    display: block;
    height: -webkit-calc(100vh - 25px);
    height: -moz-calc(100vh - 25px);
    height: calc(100vh - 25px);
    width: 100%;
    padding: 0px;
    margin: 0px;
}

.root {
    position: relative;
    height: 100%;
    padding: 0px;
    margin: 0px;
}

.markdown-body {
    position: absolute;
    overflow-y: auto;
    height: -webkit-calc(100% - 25px);
    height: -moz-calc(100% - 25px);
    height: calc(100% - 25px);
    width: 100%;
}

button {
    background: ${color.dark};
    border: 1px white solid;
    color: white;
}

button:hover {
    border: 1px ${color.dark} solid;
    color: ${color.dark};
    background: transparent;
}

button:disabled {
    background: $ffffff;
}

button:disabled :hover {
    border: 1px white solid;
    color: white;
    background: ${color.light};
}

nav {
    position: relative;
    height: 25px;
    width: 100%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-flex-direction: row;
    -moz-box-orient: horizontal;
    -moz-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border-bottom: 1px $ffffff solid;
    padding-bottom: 2px;
    margin-bottom: 8px;
}

nav .history {
    position: relative;
    height: 100%;
}

nav .history button {
    position: relative;
    height: 25px;
    width: 25px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    margin-left: 2px;
}

nav .bookmarks {
    position: relative;
    margin-left: 5px;
    padding-left: 5px;
    border-left: 1px ${color.light} solid;
}

nav .bookmarks button {
    position: relative;
    height: 25px;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
    margin-left: 2px;
}
        `));
        this.navigation = document.createElement('nav');
        if (this.getAttribute('navigation') !== 'none') {
            root.append(this.navigation);
        }

        const historyNavigation = document.createElement('div');
        historyNavigation.className = 'history';
        this.navigation.append(historyNavigation);

        const backButton = document.createElement('button');
        backButton.innerText = '<';
        backButton.onclick = () => {
            this.history.goBack();
        }
        historyNavigation.append(backButton);
        const forwardButton = document.createElement('button');
        forwardButton.innerText = '>';
        forwardButton.onclick = () => {
            this.history.goForward();
        }
        historyNavigation.append(forwardButton);
        const reloadButton = document.createElement('button');
        reloadButton.innerText = '↻';
        reloadButton.onclick = () => {
            this.history.replace(this.history.entries[this.history.index]); // Reloads the current page
        }
        historyNavigation.append(reloadButton);

        if (this.getAttribute('navigation') === 'full') {
            const bookmarks = document.createElement('div');
            bookmarks.className = 'bookmarks';
            this.navigation.append(bookmarks);

            this.getAttribute('bookmarks')
                .split(';')
                .reduce((res, v) => v ? [...res, v] : res, [])
                .map(md => {
                    // [License](/LICENSE);[Demo](/index.html)
                    const match = /^\[(?<title>.*?)\]\((?<path>.*?)\)$/igm.exec(md);
                    return [match.groups.title, match.groups.path];
                })
                .forEach(([title, path]) => {
                    const bookmark = document.createElement('button');
                    bookmark.innerText = title;
                    bookmark.onclick = () => {
                        if (this.history.entries[this.history.index].pathname === path) {
                            // Don't need to navigate to the page you're already on
                            return;
                        }
                        this.history.push(path);
                    }
                    const intervalID = setInterval(() => {
                        if (this.history !== undefined) {
                            const run = () => {
                                bookmark.disabled = this.history.entries[this.history.index].pathname === path;
                            }

                            this.history.listen(run);
                            run();
                            clearInterval(intervalID);
                        }
                    }, 33);
                    bookmarks.append(bookmark);
                });
        }

        this.renderer = document.createElement('renderer');
        this.renderer.classList.add('markdown-body');
        this.renderer.innerHTML = `<style>.lds-spinner{color:official;display:inline-block;position:relative;width:64px;height:64px;}.lds-spinnerdiv{-webkit-transform-origin:32px32px;-moz-transform-origin:32px32px;-ms-transform-origin:32px32px;-o-transform-origin:32px32px;transform-origin:32px32px;-webkit-animation:lds-spinner1.2slinearinfinite;-moz-animation:lds-spinner1.2slinearinfinite;-o-animation:lds-spinner1.2slinearinfinite;animation:lds-spinner1.2slinearinfinite;}.lds-spinnerdiv:after{content:"";display:block;position:absolute;top:3px;left:29px;width:5px;height:14px;-webkit-border-radius:20%;-moz-border-radius:20%;border-radius:20%;background:#fff;}.lds-spinnerdiv:nth-child(1){-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);-o-transform:rotate(0deg);transform:rotate(0deg);-webkit-animation-delay:-1.1s;-moz-animation-delay:-1.1s;-o-animation-delay:-1.1s;animation-delay:-1.1s;}.lds-spinnerdiv:nth-child(2){-webkit-transform:rotate(30deg);-moz-transform:rotate(30deg);-ms-transform:rotate(30deg);-o-transform:rotate(30deg);transform:rotate(30deg);-webkit-animation-delay:-1s;-moz-animation-delay:-1s;-o-animation-delay:-1s;animation-delay:-1s;}.lds-spinnerdiv:nth-child(3){-webkit-transform:rotate(60deg);-moz-transform:rotate(60deg);-ms-transform:rotate(60deg);-o-transform:rotate(60deg);transform:rotate(60deg);-webkit-animation-delay:-0.9s;-moz-animation-delay:-0.9s;-o-animation-delay:-0.9s;animation-delay:-0.9s;}.lds-spinnerdiv:nth-child(4){-webkit-transform:rotate(90deg);-moz-transform:rotate(90deg);-ms-transform:rotate(90deg);-o-transform:rotate(90deg);transform:rotate(90deg);-webkit-animation-delay:-0.8s;-moz-animation-delay:-0.8s;-o-animation-delay:-0.8s;animation-delay:-0.8s;}.lds-spinnerdiv:nth-child(5){-webkit-transform:rotate(120deg);-moz-transform:rotate(120deg);-ms-transform:rotate(120deg);-o-transform:rotate(120deg);transform:rotate(120deg);-webkit-animation-delay:-0.7s;-moz-animation-delay:-0.7s;-o-animation-delay:-0.7s;animation-delay:-0.7s;}.lds-spinnerdiv:nth-child(6){-webkit-transform:rotate(150deg);-moz-transform:rotate(150deg);-ms-transform:rotate(150deg);-o-transform:rotate(150deg);transform:rotate(150deg);-webkit-animation-delay:-0.6s;-moz-animation-delay:-0.6s;-o-animation-delay:-0.6s;animation-delay:-0.6s;}.lds-spinnerdiv:nth-child(7){-webkit-transform:rotate(180deg);-moz-transform:rotate(180deg);-ms-transform:rotate(180deg);-o-transform:rotate(180deg);transform:rotate(180deg);-webkit-animation-delay:-0.5s;-moz-animation-delay:-0.5s;-o-animation-delay:-0.5s;animation-delay:-0.5s;}.lds-spinnerdiv:nth-child(8){-webkit-transform:rotate(210deg);-moz-transform:rotate(210deg);-ms-transform:rotate(210deg);-o-transform:rotate(210deg);transform:rotate(210deg);-webkit-animation-delay:-0.4s;-moz-animation-delay:-0.4s;-o-animation-delay:-0.4s;animation-delay:-0.4s;}.lds-spinnerdiv:nth-child(9){-webkit-transform:rotate(240deg);-moz-transform:rotate(240deg);-ms-transform:rotate(240deg);-o-transform:rotate(240deg);transform:rotate(240deg);-webkit-animation-delay:-0.3s;-moz-animation-delay:-0.3s;-o-animation-delay:-0.3s;animation-delay:-0.3s;}.lds-spinnerdiv:nth-child(10){-webkit-transform:rotate(270deg);-moz-transform:rotate(270deg);-ms-transform:rotate(270deg);-o-transform:rotate(270deg);transform:rotate(270deg);-webkit-animation-delay:-0.2s;-moz-animation-delay:-0.2s;-o-animation-delay:-0.2s;animation-delay:-0.2s;}.lds-spinnerdiv:nth-child(11){-webkit-transform:rotate(300deg);-moz-transform:rotate(300deg);-ms-transform:rotate(300deg);-o-transform:rotate(300deg);transform:rotate(300deg);-webkit-animation-delay:-0.1s;-moz-animation-delay:-0.1s;-o-animation-delay:-0.1s;animation-delay:-0.1s;}.lds-spinnerdiv:nth-child(12){-webkit-transform:rotate(330deg);-moz-transform:rotate(330deg);-ms-transform:rotate(330deg);-o-transform:rotate(330deg);transform:rotate(330deg);-webkit-animation-delay:0s;-moz-animation-delay:0s;-o-animation-delay:0s;animation-delay:0s;}@keyframeslds-spinner{0%{opacity:1;}100%{opacity:0;}}</style><center><divclass="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></center>`;
        root.append(this.renderer);

        shadowRoot.append(markdownScript);
        shadowRoot.append(historyScript);
        shadowRoot.append(githubStyles);
        shadowRoot.append(style);
        shadowRoot.append(root);

        const intervalID = setInterval(() => {
            let shouldRun = false;
            try {
                if (showdown !== undefined && window.History.createMemoryHistory !== undefined) {
                    clearInterval(intervalID);
                    shouldRun = true;
                }
            } catch (e) {}

            if (shouldRun) {
                // Needs to be outside of the try catch, since its used to discard errors.
                run();
            }
        }, 33);
        const run = () => {
            this.converter = new showdown.Converter();
            this.converter.setOption('tables', true);
            this.converter.setOption('ghCodeBlocks', true);
            this.converter.setOption('emoji', true);
            this.converter.setOption('simplifiedAutoLink', true);
            this.history = window.History.createMemoryHistory();
            this.history.listen((location, action) => {
                // location is an object like window.location
                backButton.disabled = !this.history.canGo(-1);
                forwardButton.disabled = !this.history.canGo(1);
                this.loadPage(location.pathname);
            });
            this.history.replace(this.getAttribute('index'));
        }
    }

    prepareAttributes() {
        // TODO: Add error handling for invalid attribute values
        if (!this.hasAttribute('user')) {
            throw Error('Attribute "user" is required. Please provide a valid github username.');
        }
        if (!this.hasAttribute('repository')) {
            throw Error('Attribute "repository" is required. Please provide a valid github repository owned by the provided user.');
        }
        if (!this.hasAttribute('branch')) {
            this.setAttribute('branch', 'master');
        }
        if (!this.hasAttribute('navigation')) {
            this.setAttribute('navigation', 'full');
        }
        if (!this.hasAttribute('bookmarks')) {
            this.setAttribute('bookmarks', '');
        }
        if (!this.hasAttribute('index')) {
            this.setAttribute('index', 'README.md');
        }
    }

    constructUrl(assetURI) {
        const url = `https://api.github.com/repos/${
      	this.getAttribute('user')}/${
        this.getAttribute('repository')}/contents/${
        assetURI}?ref=${
        this.getAttribute('branch')}`;
        return url;
    }
    loadPage(assetURI) {
        const assetType = assetURI.lastIndexOf('.') > 0 ? assetURI.substring(assetURI.lastIndexOf('.') + 1).toLowerCase() : '';
        const url = this.constructUrl(assetURI);
        fetch(url).then(res => res.json()).then(body => {
            const strBody = atob(body.content);
            switch (assetType) {
                case 'md':
                    this.renderMarkdown(strBody);
                    break;
                default:
                    this.renderMarkdown(`
\`\`\`${assetType}
${strBody}
\`\`\`
            `);
            }

        });

    }
    renderMarkdown(md) {
        this.renderer.innerHTML = this.converter.makeHtml(md);
        this.renderer.querySelectorAll("img,a").forEach(el => {
            if (el.getAttribute('src') && !el.getAttribute('src').startsWith('http')) {
                fetch(this.constructUrl(el.getAttribute('src')))
                    .then(res => res.json())
                    .then(body => {
                        el.setAttribute('src', `data:img/png;base64,${body.content}`);
                    });
            }
            if (el.getAttribute('href')) {
                if (el.getAttribute('href').startsWith('http')) {
                    // External path
                    el.onclick = (ev) => {
                        ev.preventDefault();
                        window.open(el.getAttribute('href'), 'noopener');
                    }
                } else {
                    // Relative path
                    el.onclick = (ev) => {
                        ev.preventDefault();
                        this.history.push(el.getAttribute('href'));
                    }
                }
            }
        });
    }
});
