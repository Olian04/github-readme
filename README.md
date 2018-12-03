# github-readme
A custom element that renders the readme of a github repository

```html
<script src="https://unpkg.com/@olian04/github-readme"></script>
<github-readme
    user="olian04"
    repository="github-readme"
    />
```

[Click here to see this page rendered using `github-readme`](https://olian04.github.io/github-readme) :smile:

## Advanced

```html
<github-readme
    user="olian04"
    repository="github-readme"
    branch="master"
    index="/README.md"
    navigation="full"
    bookmarks="[License](/LICENSE);[Demo](/index.html)"
    style=""
    id=""
    class=""
    />
```

|property | default | description|
|:-----------:|:----------:|:--------------|
|user |  | The name of the github user that owns the repository|
|repository |  | The name of the github repository you want to display|
|branch | master | The name of the git branch you want to display|
|index | /README.md | The path to the index file.|
|navigation | full | `none` will hide the navigation bar. `history` will only show the back, forward and reload buttons. `full` will show the history navigation as well as a bookmarks row.|
|bookmarks | | Optional bookmarks provided in the form of a simecolon separated string of markdown links. `[TITLE](LINK);[TITLE](LINK);[TITLE](LINK)`|
|style |  | Optional styles passed down to the top most element of the component.|
|id |  | Optional id passed down to the top most element of the component.|
|class |  | Optional class passed down to the top most element of the component.|

## TODO:
* Syntax highlighting for codeblocks
* Add cache for offline browsing


WIP: https://jsfiddle.net/pw2dz9ax/613/
