# github-readme
A custom element that renders the readme of a github repository

```html
<script src="https://unpkg.com/@olian04/github-readme"></script>
<github-readme
    user="olian04"
    repository="github-readme"
    />
```

## Advanced

```html
<github-readme
    user="olian04"
    repository="github-readme"
    branch="master"
    index="/README.md"
    hideNavigation="false"
    bookmarks=""
    style=""
    id=""
    class=""
    />
```

Note to self:
* Cache is always JIT
* Theme is always github
* No breadcrumbs navigation 
* History is on when navigation bar is shows
* Links is always internal
* Persist is always false

## Old deprecated design

```html
<github-readme
    user="olian04"
    repository="github-readme"
    branch="master"
    index="/README.md"
    cache="jit"
    persist="false"
    links="internal"
    history="true"
    breadcrumbs="false"
    theme="github"
    style=""
    id=""
    class=""
    />
```

property | default | description
-----------|----------|--------------
user |  | The name of the github user that owns the repository
repository |  | The name of the github repository you want to display
branch | master | The name of the git branch you want to display
index | /README.md | The path to the index file. Supported file extensions are `.html` & `.md`
cache | jit | The caching mode you want to use. __jit__ will cache assets as they are loaded. __pre__ will traverse links and cache all assets on page load. __index__ will only cache the README.md file and its direct assets. __none__ will turn off caching.
persist | false | Will reload the current page on page reload instead of returning to the index page
links | internal | The navigation mode you want to use. __external__ will allow navigation through links in the readme. __internal__ will allow navigation through links in the readme, limited to links within the same repository.  __none__ will disallow navigating away from the readme.
history | true | Adds a backwards and forwards button to the top of the renderer.
breadcrumbs | false | Adds a breadcrumbs navigation bar to the top of the renderer. The crumbs will display the file hierarchy from the root to where the current file you're watching is located.
theme | github | Will include a set of css rules. __github__ will use a github inspired theme. __none__ won't apply any styles.
style |  | Optional styles passed down to the top most element of the component.
id |  | Optional id passed down to the top most element of the component.
class |  | Optional class passed down to the top most element of the component.
