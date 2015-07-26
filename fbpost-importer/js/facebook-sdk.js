var socialHtml = document.createElement('div');
socialHtml.setAttribute('id', 'fb-root');

var socialJS = document.createElement('script');
socialJS.setAttribute('type', 'text/javascript');
socialJS.innerText = '(function(d, s, id) {' +
    'var js, fjs = d.getElementsByTagName(s)[0]; ' +
    'if (d.getElementById(id)) return;' +
    'js = d.createElement(s); js.id = id;' +
    'js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4";' +
    'fjs.parentNode.insertBefore(js, fjs);' +
    '}(document, "script", "facebook-jssdk"));';

document.body.insertBefore(socialJS, document.body.firstChild);
document.body.insertBefore(socialHtml, document.body.firstChild);


