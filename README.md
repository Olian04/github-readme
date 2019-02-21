# github-readme
A custom element that renders the readme of a github repository

```html
<script src="https://unpkg.com/@olian/github-readme"></script>
<github-readme
    user="olian04"
    repository="github-readme"
    ></github-readme>
```

[Click here to see this page rendered using `github-readme`](https://olian04.github.io/github-readme) :smile:

Or [click here to see a multi page demo in a jsfiddle](https://jsfiddle.net/cLyum7jr/33/)

__Help me help you:__ <a href="https://www.buymeacoffee.com/fEvx1NCoS" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

## Install

__NPM:__ [`npm install @olian/github-readme`](https://www.npmjs.com/package/@olian/github-readme)

__CDN:__ `<script src="https://unpkg.com/@olian/github-readme"></script>`

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
    ></github-readme>
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

_**Note:** github-readme uses unauthenticated requests to the github api and is there for limited by [its rate limiting rules](https://developer.github.com/v3/#rate-limiting)._
> For unauthenticated requests, the rate limit allows for up to 60 requests per hour. Unauthenticated requests are associated with the originating IP address, and not the user making requests.

## License

See [Licence](/LICENSE)

