var PONIES_ATLAS_PATH = '../images/';


var debug = true;
var resize = true;
var player = null;


const entities = [];

const styles = ['main.css', 'chat.css'];
const modules = ['vector.js', 'engine/components/base/Component.js', 'engine/components/base/Component.js', 'schedule.js', 'chat.js', 'old-indddex.js', 'ui.js']



function init() {

    let scripts = document.querySelectorAll('script');
    let path = '';

    for (let script of scripts) {

        if (script.src.includes('index.js'))
            path = script.src.slice(0, script.src.indexOf('index.js'))
    }

    for (let file of styles) {

        let link = document.createElement('link');

        link.type = 'text/css';
        link.rel = 'stylesheet';

        link.href = path + '../style/' + file;

        document.head.appendChild(link);
    }

    for (let file of modules) {

        let script = document.createElement('script');

        script.src = path + file;
        script.async = false;

        document.head.appendChild(script);
    }

    for (let file of arguments) {

        let script = document.createElement('script');

        script.src = file;
        script.async = false;

        document.head.appendChild(script);
    }
}