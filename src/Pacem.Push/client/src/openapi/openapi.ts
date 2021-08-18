(function () {
    window.addEventListener('load', () => {

        // replace title
        document.title = 'Open API Documentation | Pacem.Push';

        // remove default icons
        const favicons = document.head.querySelectorAll('link[rel=icon]');
        favicons.forEach(i => i.remove());

        const favicon = document.createElement('link');
        favicon.setAttribute('rel', 'icon');
        favicon.setAttribute('href', '/favicon.ico');
        document.head.appendChild(favicon);

    }, false);
})();