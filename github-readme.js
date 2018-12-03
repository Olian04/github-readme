window.customElements.define('github-readme', class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.prepareAttributes();

        const shadowRoot = this.attachShadow({mode: 'open'});
        const markdownScript = document.createElement('script');
        markdownScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.0/showdown.min.js';
        markdownScript.async = false;
        const historyScript = document.createElement('script');
        historyScript.src = 'https://unpkg.com/history/umd/history.min.js';
        historyScript.async = false;
        const root = document.createElement('div');
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
        	nav {
          	position: relative;
            height: 25px;
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            border-bottom: 1px ${color.light} solid;
            padding-bottom: 2px;
            margin-bottom: 8px;
          }
         nav .history {
           position: relative;
           height: 100%;
           width: 100px;
         }
         nav .history button {
         	 position: relative;
           height: 25px;
           width: 25px;
           border-radius: 50%;
           margin-left: 2px;
         	 background: ${color.dark};
           border: 1px white solid;
           color: white;
         }
         nav .history button:hover {
           border: 1px ${color.dark} solid;
           color: ${color.dark};
           background: transparent;
         }
         nav .history button:disabled {
         	background: ${color.light};
         }
         nav .history button:disabled:hover {
           border: 1px white solid;
           color: white;
           background: ${color.light};
         }
        `));
        // TODO: Add bookmarks
        // TODO: Add back, forward, reload buttons
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

        this.renderer = document.createElement('renderer');
        this.renderer.classList.add('markdown-body');
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
            this.history = window.History.createMemoryHistory();
            this.history.listen((location, action) => {
              // location is an object like window.location
              backButton.disabled = !this.history.canGo(-1);
              forwardButton.disabled = !this.history.canGo(1);
              this.loadPage(location.pathname);
            });
        		this.history.replace('README.md');
        }
    }

    prepareAttributes() {
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
        	// TODO: Change the default to "full" when bookmarks are implemented
        	this.setAttribute('navigation', 'history');
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
        const assetType = assetURI.substring(assetURI.lastIndexOf('.')+1).toLowerCase();
        const url = this.constructUrl(assetURI);
        
        switch(assetType) {
            case 'md':
                fetch(url).then(res => res.json()).then(body => {
                		const strBody = atob(body.content);
                    this.renderMarkdown(strBody);
                });
                break;
        }
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
                window.open(el.getAttribute('href'),'noopener');
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
