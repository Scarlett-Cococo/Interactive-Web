// 当前选中的地图  
let currentMap = null;  

// 显示地图页面  
function showMap(region) {  
  // 隐藏首页，显示地图页面  
  document.getElementById('homepage').style.display = 'none';  
  document.getElementById('map-container').style.display = 'block';  
  
  // 设置地图标题  
  const title = region === 'eu' ? 'European Union GDP Map' : '';  
  document.getElementById('map-title').textContent = title;  
  
  if (currentMap) {  
    currentMap.remove();  
  }  
   
  if (region === 'eu') {  
    loadEUMap();  
  } else {  
    loadUKMap();  
  }  
}  

function backToHome() {  
  document.getElementById('homepage').style.display = 'flex';  
  document.getElementById('map-container').style.display = 'none';  
  
 
  if (currentMap) {  
    currentMap.remove();  
    currentMap = null;  
  }  
}  

function loadEUMap() {  
  currentMap = new maplibregl.Map({  
    container: 'map',  
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',  
    center: [10, 50],  
    zoom: 3  
  });  
  
  currentMap.on('load', function() {  
    fetch('Europe.geojson')  
      .then(response => {  
        if (!response.ok) {  
          throw new Error(`HTTP Error: ${response.status}`);  
        }  
        return response.json();  
      })  
      .then(data => {   
        currentMap.addSource('eu-regions', {  
          type: 'geojson',  
          data: data  
        });  
        
        currentMap.addLayer({  
          id: 'eu-regions-fill',  
          type: 'fill',  
          source: 'eu-regions',  
          paint: {  
            'fill-color': [  
              'interpolate',  
              ['linear'],  
              ['get', 'GDP'],  
              10000, '#eff3ff',  
              30000, '#bdd7e7',  
              50000, '#6baed6',  
              70000, '#3182bd',  
              100000, '#08519c'  
            ],  
            'fill-opacity': 0.7  
          }  
        });  
        
        
        currentMap.addLayer({  
          id: 'eu-regions-line',  
          type: 'line',  
          source: 'eu-regions',  
          paint: {  
            'line-color': '#000',  
            'line-width': 0.5  
          }  
        });  
        
        currentMap.on('click', 'eu-regions-fill', function(e) {  
          if (e.features.length > 0) {  
            const feature = e.features[0];  
            const props = feature.properties;  
            
            new maplibregl.Popup()  
              .setLngLat(e.lngLat)  
              .setHTML(`  
                <h3>${props.name || '区域'}</h3>  
                <p>GDP: ${props.GDP ? '€' + props.GDP.toLocaleString() : '数据不可用'}</p>  
              `)  
              .addTo(currentMap);  
          }  
        });  
        currentMap.on('mouseenter', 'eu-regions-fill', function() {  
          currentMap.getCanvas().style.cursor = 'pointer';  
        });  
        
        currentMap.on('mouseleave', 'eu-regions-fill', function() {  
          currentMap.getCanvas().style.cursor = '';  
        });  
      })  
      .catch(error => {  
        console.error('Error loading EU GeoJSON:', error);  
        alert('无法加载欧盟地图数据，请确保Europe.geojson文件存在');  
      });  
  });  
}  

function loadUKMap() {  
  // 创建地图实例  
  currentMap = new maplibregl.Map({  
    container: 'map',  
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',  
    center: [-2, 54],  
    zoom: 5  
  });  
  
  currentMap.on('load', function() {  
    fetch('UK.geojson')  
      .then(response => {  
        if (!response.ok) {  
          throw new Error(`HTTP Error: ${response.status}`);  
        }  
        return response.json();  
      })  
      .then(data => {  
        currentMap.addSource('uk-regions', {  
          type: 'geojson',  
          data: data  
        });  
        
        currentMap.addLayer({  
          id: 'uk-regions-fill',  
          type: 'fill',  
          source: 'uk-regions',  
          paint: {  
            'fill-color': [  
              'interpolate',  
              ['linear'],  
              ['get', 'GDP'],  
              10000, '#edf8e9',  
              30000, '#bae4b3',  
              50000, '#74c476',  
              70000, '#31a354',  
              100000, '#006d2c'  
            ],  
            'fill-opacity': 0.7  
          }  
        });  
        currentMap.addLayer({  
          id: 'uk-regions-line',  
          type: 'line',  
          source: 'uk-regions',  
          paint: {  
            'line-color': '#000',  
            'line-width': 0.5  
          }  
        });  
        
        currentMap.on('click', 'uk-regions-fill', function(e) {  
          if (e.features.length > 0) {  
            const feature = e.features[0];  
            const props = feature.properties;  
            
            new maplibregl.Popup()  
              .setLngLat(e.lngLat)  
              .setHTML(`  
                <h3>${props.name || '区域'}</h3>  
                <p>GDP: ${props.GDP ? '£' + props.GDP.toLocaleString() : '数据不可用'}</p>  
              `)  
              .addTo(currentMap);  
          }  
        });  
        
        currentMap.on('mouseenter', 'uk-regions-fill', function() {  
          currentMap.getCanvas().style.cursor = 'pointer';  
        });  
        
        currentMap.on('mouseleave', 'uk-regions-fill', function() {  
          currentMap.getCanvas().style.cursor = '';  
        });  
      })  
      .catch(error => {  
        console.error('Error loading UK GeoJSON:', error);  
        alert('Cant load UK map data');  
      });  
  });  
}  