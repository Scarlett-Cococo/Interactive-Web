import { initUKMap, cleanupUKMap } from './UK.js';  
import { loadEUMap } from './EU.js';  

let currentMap = null;  
let currentMapType = null;  

function showMap(region) {  
    document.getElementById('homepage').style.display = 'none';  
    document.getElementById('map-container').style.display = 'block';  

    const title = region === 'eu' ? 'European Union GDP Map' : 'UK Industry GDP Analysis';  
    document.getElementById('map-title').textContent = title;  

    cleanupUKMap();  

    if (currentMap && typeof currentMap.remove === 'function') {  
        currentMap.remove();  
    }  

    if (region === 'eu') {  
        currentMap = loadEUMap('map');  
        currentMapType = 'eu';  
    } else {  
        currentMap = initUKMap('map');  
        currentMapType = 'uk';  
    }  
}  

function backToHome() {  
    document.getElementById('homepage').style.display = 'block';  
    document.getElementById('map-container').style.display = 'none';  

    cleanupUKMap();  
    if (currentMap && typeof currentMap.remove === 'function') {  
        currentMap.remove();  
    }  

    currentMap = null;  
    currentMapType = null;  
}  

window.showMap = showMap;  
window.backToHome = backToHome;  

document.addEventListener('DOMContentLoaded', () => {  
    const homepage = document.getElementById('homepage');  
    if (homepage) {  
        homepage.style.backgroundImage = "url('/UK_and_the_European_Union.svg')";  
        homepage.style.backgroundSize = "cover";  
        homepage.style.backgroundPosition = "center";  
        homepage.style.backgroundRepeat = "no-repeat";  
    }  
});  