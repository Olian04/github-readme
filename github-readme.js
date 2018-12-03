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
            background: ${color.light};
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
         }
         nav .history button {
         	 position: relative;
           height: 25px;
           width: 25px;
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
           border-radius: 20px;
           margin-left: 2px;
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
        this.renderer.innerHTML = `<style>.lds-spinner{color:official;display:inline-block;position:relative;width:64px;height:64px;}.lds-spinnerdiv{transform-origin:32px32px;animation:lds-spinner1.2slinearinfinite;}.lds-spinnerdiv:after{content:"";display:block;position:absolute;top:3px;left:29px;width:5px;height:14px;border-radius:20%;background:#fff;}.lds-spinnerdiv:nth-child(1){transform:rotate(0deg);animation-delay:-1.1s;}.lds-spinnerdiv:nth-child(2){transform:rotate(30deg);animation-delay:-1s;}.lds-spinnerdiv:nth-child(3){transform:rotate(60deg);animation-delay:-0.9s;}.lds-spinnerdiv:nth-child(4){transform:rotate(90deg);animation-delay:-0.8s;}.lds-spinnerdiv:nth-child(5){transform:rotate(120deg);animation-delay:-0.7s;}.lds-spinnerdiv:nth-child(6){transform:rotate(150deg);animation-delay:-0.6s;}.lds-spinnerdiv:nth-child(7){transform:rotate(180deg);animation-delay:-0.5s;}.lds-spinnerdiv:nth-child(8){transform:rotate(210deg);animation-delay:-0.4s;}.lds-spinnerdiv:nth-child(9){transform:rotate(240deg);animation-delay:-0.3s;}.lds-spinnerdiv:nth-child(10){transform:rotate(270deg);animation-delay:-0.2s;}.lds-spinnerdiv:nth-child(11){transform:rotate(300deg);animation-delay:-0.1s;}.lds-spinnerdiv:nth-child(12){transform:rotate(330deg);animation-delay:0s;}@keyframeslds-spinner{0%{opacity:1;}100%{opacity:0;}}</style><center><divclass="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></center>`;
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
        const assetType = assetURI.lastIndexOf('.') > 0 ? assetURI.substring(assetURI.lastIndexOf('.')+1).toLowerCase() : '';
        const url = this.constructUrl(assetURI);
        fetch(url).then(res => res.json()).then(body => {
          const strBody = atob(body.content);
          switch(assetType) {
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
