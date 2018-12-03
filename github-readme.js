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
        const root = document.createElement('div');
        const githubStyles = document.createElement('link');
        githubStyles.rel = 'stylesheet';
        githubStyles.href = 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css';
        const style = document.createElement('style');

        this.renderer = document.createElement('renderer');
        this.renderer.classList.add('markdown-body');
        root.append(this.renderer);
        
        shadowRoot.append(markdownScript);
        shadowRoot.append(githubStyles);
        shadowRoot.append(style);
        shadowRoot.append(root);

        const intervalID = setInterval(() => {
            let shouldRun = false;
            try {
                if (showdown) {
                    clearInterval(intervalID);
                    this.converter = new showdown.Converter();
                    shouldRun = true;
                }
            } catch (e) {}
            
            if (shouldRun) {
                // Needs to be outside of the try catch, since its used to discard errors.
                run();
            }
        }, 33);
        const run = () => {
            this.fetchAsset('README.md');
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

    }

		constructUrl(assetURI) {
    	const url = `https://api.github.com/repos/${
      	this.getAttribute('user')}/${
        this.getAttribute('repository')}/contents/${
        assetURI}?ref=${
        this.getAttribute('branch')}`;
      return url;
    }
    fetchAsset(assetURI) {
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
                this.fetchAsset(el.getAttribute('href'));
              }
            }
          }
        });
    }
});
