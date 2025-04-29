/**  
 * Load EU GDP Map  
 * @param {string} containerId - Map container ID  
 * @returns {Object} - MapLibre map instance  
 */  
export function loadEUMap(containerId) {  
  // Set year range and default year  
  const years = ['2017', '2018', '2019', '2020', '2021', '2022', '2023'];  
  let currentYear = '2023'; // Default to latest year  
  
  // Create map instance  
  const map = new maplibregl.Map({  
    container: containerId,  
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',  
    center: [10, 50],  
    zoom: 3  
  });  
  
  // Utility functions  
  const applyStyles = (element, styles) => {  
    Object.assign(element.style, styles);  
    return element;  
  };  
  
  const createDOMElement = (tag, text = '', styles = {}, attributes = {}) => {  
    const element = document.createElement(tag);  
    if (text) element.textContent = text;  
    applyStyles(element, styles);  
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));  
    return element;  
  };  
  
  // Get GDP value, ensuring year is properly formatted  
  const getGDPValue = (props, year) => props[String(year).trim()];  
  
  // Format GDP value for readability  
  const formatGDP = (value) => {  
    if (value === undefined || value === null || value === '') return 'Data not available';  
    
    const num = Number(value);  
    if (isNaN(num)) return 'Data not available';  
    
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)} trillion`;  
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)} billion`;  
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)} million`;  
    return `$${num.toLocaleString()}`;  
  };  
  
  // Update map data function  
  const updateMapData = () => {  
    if (!map.getSource('eu-regions')) return;  
    
    const gdpExpression = ['to-number', ['get', String(currentYear)], 0];  
    
    map.setPaintProperty('eu-regions-fill', 'fill-color', [  
      'interpolate',  
      ['linear'],  
      gdpExpression,  
      1e9, '#eff3ff',     // $1 billion  
      10e9, '#bdd7e7',    // $10 billion  
      100e9, '#6baed6',   // $100 billion  
      1e12, '#3182bd',    // $1 trillion  
      4e12, '#08519c'     // $4 trillion  
    ]);  
  };  
  
  // Create year control interface  
  const createYearControl = () => {  
    // Create control container  
    const controlDiv = createDOMElement('div', '', {  
      backgroundColor: 'white',  
      padding: '10px',  
      margin: '10px',  
      borderRadius: '4px',  
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',  
      position: 'absolute',  
      zIndex: '1',  
      bottom: '20px',  
      left: '50%',  
      transform: 'translateX(-50%)',  
      display: 'flex',  
      flexDirection: 'column',  
      alignItems: 'center'  
    }, { className: 'year-control maplibregl-ctrl' });  
    
    // Create title  
    const title = createDOMElement('div', 'GDP Data Year', {  
      marginBottom: '8px',  
      fontWeight: 'bold'  
    });  
    controlDiv.appendChild(title);  
    
    // Create slider container  
    const sliderContainer = createDOMElement('div', '', {  
      display: 'flex',  
      alignItems: 'center',  
      width: '100%'  
    });  
    
    // Create year slider  
    const slider = createDOMElement('input', '', {  
      width: '250px',  
      margin: '0 10px'  
    }, {  
      type: 'range',  
      min: '0',  
      max: String(years.length - 1),  
      value: String(years.indexOf(currentYear)),  
      step: '1'  
    });  
    
    // Create current year label  
    const yearLabel = createDOMElement('div', currentYear, {  
      fontWeight: 'bold',  
      minWidth: '40px',  
      textAlign: 'center'  
    });  
    
    // Slider event listener  
    slider.addEventListener('input', function() {  
      currentYear = years[this.value];  
      yearLabel.textContent = currentYear;  
      updateMapData();  
      
      // Update the map title directly  
      document.title = `EU GDP Map (${currentYear})`;  
    });  
    
    sliderContainer.appendChild(slider);  
    sliderContainer.appendChild(yearLabel);  
    controlDiv.appendChild(sliderContainer);  
    
    map.getContainer().appendChild(controlDiv);  
  };  
  
  // Create legend  
  const createLegend = () => {  
    const legend = createDOMElement('div', '', {  
      position: 'absolute',  
      right: '10px',  
      bottom: '20px',  
      backgroundColor: 'white',  
      padding: '10px',  
      borderRadius: '4px',  
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',  
      zIndex: '1'  
    }, { className: 'map-legend' });  
    
    legend.appendChild(createDOMElement('div', 'GDP', {  
      fontWeight: 'bold',  
      marginBottom: '5px'  
    }));  
    
    const colors = ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'];  
    const labels = [  
      '< $10 billion',  
      '$10 - $100 billion',  
      '$100 billion - $1 trillion',  
      '$1 - $4 trillion',  
      '> $4 trillion'  
    ];  
    
    labels.forEach((label, i) => {  
      const item = createDOMElement('div', '', {  
        display: 'flex',  
        alignItems: 'center',  
        marginBottom: '5px'  
      });  
      
      const colorBox = createDOMElement('div', '', {  
        width: '20px',  
        height: '20px',  
        backgroundColor: colors[i],  
        marginRight: '5px'  
      });  
      
      item.appendChild(colorBox);  
      item.appendChild(createDOMElement('span', label));  
      legend.appendChild(item);  
    });  
    
    legend.appendChild(createDOMElement('div', 'GDP data range: $1B - $4T', {  
      fontSize: '0.8em',  
      marginTop: '10px',  
      color: '#666'  
    }));  
    
    map.getContainer().appendChild(legend);  
  };  
  
  // Handle map loading and data  
  map.on('load', () => {  
    // Set the document title initially  
    document.title = `EU GDP Map (${currentYear})`;  
    
    fetch('/Interactive-Web/public/EU_GDP.geojson') 
      .then(response => {  
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);  
        return response.json();  
      })  
      .then(data => {  
        // Add data source  
        map.addSource('eu-regions', { type: 'geojson', data });  
        
        // Add fill layer  
        map.addLayer({  
          id: 'eu-regions-fill',  
          type: 'fill',  
          source: 'eu-regions',  
          paint: {  
            'fill-color': [  
              'interpolate',  
              ['linear'],  
              ['to-number', ['get', String(currentYear)], 0],  
              1e9, '#eff3ff',     // $1 billion  
              10e9, '#bdd7e7',    // $10 billion  
              100e9, '#6baed6',   // $100 billion  
              1e12, '#3182bd',    // $1 trillion  
              4e12, '#08519c'     // $4 trillion  
            ],  
            'fill-opacity': 0.7  
          }  
        });  
        
        // Add boundary lines  
        map.addLayer({  
          id: 'eu-regions-line',  
          type: 'line',  
          source: 'eu-regions',  
          paint: {  
            'line-color': '#000',  
            'line-width': 0.5  
          }  
        });  
        
        // Add click event for region details  
        map.on('click', 'eu-regions-fill', e => {  
          if (!e.features.length) return;  
          
          const feature = e.features[0];  
          const props = feature.properties;  
          const countryName = props.NAME || props.name || props.Name || props.COUNTRY || 'Unknown region';  
          
          // Generate historical data table  
          const gdpTrend = years.map(year =>   
            `<tr><td>${year}</td><td>${formatGDP(getGDPValue(props, year))}</td></tr>`  
          ).join('');  
          
          // Create and show popup  
          new maplibregl.Popup()  
            .setLngLat(e.lngLat)  
            .setHTML(`  
              <div style="max-width: 300px;">  
                <h3 style="margin-top: 0;">${countryName}</h3>  
                <p><strong>GDP (${currentYear}):</strong> ${formatGDP(getGDPValue(props, currentYear))}</p>  
                <div style="font-size: 0.9em; margin-top: 10px;">  
                  <strong>Historical GDP Data:</strong>  
                  <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">  
                    <tr style="border-bottom: 1px solid #ddd;">  
                      <th style="text-align: left;">Year</th>  
                      <th style="text-align: left;">GDP</th>  
                    </tr>  
                    ${gdpTrend}  
                  </table>  
                </div>  
              </div>  
            `)  
            .addTo(map);  
        });  
        
        // Add hover cursor effects  
        map.on('mouseenter', 'eu-regions-fill', () => {  
          map.getCanvas().style.cursor = 'pointer';  
        });  
        
        map.on('mouseleave', 'eu-regions-fill', () => {  
          map.getCanvas().style.cursor = '';  
        });  
        
        // Initialize UI components  
        createYearControl();  
        createLegend();  
      })  
      .catch(error => {  
        console.error('Failed to load map data:', error);  
        
        const errorDiv = createDOMElement('div', 'Failed to load map data. Please try again later.', {  
          position: 'absolute',  
          top: '50%',  
          left: '50%',  
          transform: 'translate(-50%, -50%)',  
          backgroundColor: 'rgba(255,255,255,0.8)',  
          padding: '20px',  
          borderRadius: '5px',  
          color: 'red'  
        });  
        
        map.getContainer().appendChild(errorDiv);  
      });  
  });  
  
  return map;  
}  