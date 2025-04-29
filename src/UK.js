
let growthChart = null;  
let contributionChart = null;  
let controlPanelContainer = null;  

export function initUKMap(mapElementId) {  
  const mapElement = document.getElementById(mapElementId);  
  if (!mapElement) return;  
  
  controlPanelContainer = document.createElement('div');  
  controlPanelContainer.className = 'uk-visualization-container';  
  controlPanelContainer.style.cssText = `  
    position: relative;  
    width: 95%;  
    max-width: 1200px;  
    margin: 20px auto;  
    display: flex;  
    flex-direction: column;  
    background-color: white;  
    border-radius: 8px;  
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);  
    padding: 20px;  
  `;  
  
  controlPanelContainer.innerHTML = `  
    <div class="controls-and-chart" style="display: flex; flex-wrap: wrap; gap: 20px;">  
      <div class="controls-section" style="flex: 1; min-width: 300px; display: flex; flex-direction: column;">  
        <div class="date-controls" style="margin-bottom: 10px; margin-top: 25px;">  
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">  
            <h4 style="margin: 0;">Date Range:</h4>  
            <div class="time-granularity" style="display: flex; align-items: center; gap: 10px;">  
              <label style="font-size: 13px; margin: 0;">Granularity:</label>  
              <select id="time-granularity" style="padding: 5px; border-radius: 4px; border: 1px solid #ddd;">  
                <option value="month">Month</option>  
                <option value="quarter">Quarter</option>  
                <option value="year">Year</option>  
              </select>  
            </div>  
          </div>  
          
          <div style="display: flex; gap: 10px; align-items: center;">  
            <div style="display: flex; flex-direction: column; gap: 5px; flex: 1;">  
              <label>From:</label>  
              <select id="start-date" style="padding: 5px; border-radius: 4px; border: 1px solid #ddd; width: 100%;">  
                <option value="">Loading dates...</option>  
              </select>  
            </div>  
            <div style="display: flex; flex-direction: column; gap: 5px; flex: 1;">  
              <label>To:</label>  
              <select id="end-date" style="padding: 5px; border-radius: 4px; border: 1px solid #ddd; width: 100%;">  
                <option value="">Loading dates...</option>  
              </select>  
            </div>  
            <button id="apply-date-range" style="align-self: flex-end; padding: 5px 15px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Apply</button>  
          </div>  
        </div>  
        
        <div class="industry-selection" style="margin-bottom: 15px;">  
          <h4 style="margin: 8px 0;">Select Industries:</h4>  
          
          <div class="search-box" style="margin-bottom: 8px;">  
            <input type="text" id="industry-search" placeholder="Search industries..."  
              style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">  
          </div>  
          
          <div class="selection-actions" style="display: flex; gap: 10px; margin-bottom: 8px;">  
            <button id="select-all" style="flex: 1; padding: 8px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Select All</button>  
            <button id="deselect-all" style="flex: 1; padding: 8px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">Deselect All</button>  
          </div>  
          
          <div id="industry-list" class="industry-list"  
            style="max-height: 150px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px;"></div>  
        </div>  
        
        <div class="metric-selection" style="margin-bottom: 15px;">  
          <h4 style="margin: 8px 0;">Select Metrics:</h4>  
          
          <div id="metric-list" class="metric-list"  
            style="border: 1px solid #ddd; border-radius: 4px; padding: 10px;"></div>  
        </div>  
        
        <div class="control-panels" style="display: flex; gap: 10px; margin-top: 5px;">  
          <div class="combined-controls" style="display: flex; background-color: rgba(255, 255, 255, 0.9); border-radius: 8px; padding: 10px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); width: 100%;">  
            <div id="display-mode-control" style="flex: 1; padding-right: 15px; border-right: 1px solid #eee;">  
              <div style="font-weight: bold; margin-bottom: 5px;">Display Mode:</div>  
              <label style="display: block; margin-bottom: 3px;">  
                <input type="radio" name="display-mode" value="absolute"> Actual Values  
              </label>  
              <label style="display: block;">  
                <input type="radio" name="display-mode" value="percentage" checked> Change Rate (%)  
              </label>  
            </div>  
            
            <div id="chart-type-control" style="flex: 1; padding-left: 15px;">  
              <div style="font-weight: bold; margin-bottom: 5px;">Chart Type:</div>  
              <label style="display: block; margin-bottom: 3px;">  
                <input type="radio" name="chart-type" value="line" checked> Line Chart  
              </label>  
              <label style="display: block;">  
                <input type="radio" name="chart-type" value="bar"> Bar Chart  
              </label>  
            </div>  
          </div>  
        </div>  
      </div>  
      
      <div class="chart-section" style="flex: 2; min-width: 500px;">  
        <div class="chart-container" style="display: flex; flex-direction: column; height: 700px; width: 100%; position: relative;">  
          <div style="flex: 1; margin-bottom: 10px;">  
            <h4 style="text-align: center; margin: 5px 0;">Growth</h4>  
            <div style="height: 330px; width: 100%; position: relative;">  
              <canvas id="growth-chart"></canvas>  
            </div>  
          </div>  
          
          <div style="flex: 1; margin-top: 10px;">  
            <h4 style="text-align: center; margin: 5px 0;">Contribution</h4>  
            <div style="height: 330px; width: 100%; position: relative;">  
              <canvas id="contribution-chart"></canvas>  
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  
  `;  
  
  mapElement.innerHTML = '';  
  mapElement.appendChild(controlPanelContainer);  
  
  const state = {  
    industries: [],  
    industryData: {},  
    metrics: [],  
    metricPairs: {},  
    dates: [],  
    selectedIndustries: [],  
    selectedMetric: null,  
    displayMode: 'percentage',  
    chartType: 'line',  
    filteredDates: [],  
    dateStart: null,  
    dateEnd: null,  
    timeGranularity: 'month',  
    monthlyDates: [],  
    quarterlyDates: {},  
    yearlyDates: {},  
    dateMapping: {}  
  };  

  const MONTH_ABBRS = {  
    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,  
    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11  
  };  
  
  const MONTH_NAMES = [  
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',  
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'  
  ];  

  function getQuarter(monthIndex) {  
    return Math.floor(monthIndex / 3) + 1;  
  }  
  
  async function loadCSVData() {  
    try {  
      const response = await fetch('/mgdp2.csv');  
      if (!response.ok) {  
        throw new Error(`HTTP error! Status: ${response.status}`);  
      }  
      
      const csvText = await response.text();  
      console.log("CSV loaded successfully, first 500 chars:", csvText.substring(0, 500));  
      const workbook = window.XLSX.read(csvText, { type: 'string' });  
      const firstSheetName = workbook.SheetNames[0];  
      const worksheet = workbook.Sheets[firstSheetName];  
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });  
      
      console.log("JSON data first row:", jsonData[0]);  
      
      processData(jsonData);  
      initUI();  
    } catch (error) {  
      console.error('Error loading CSV data:', error);  
      showError('Failed to load or parse the CSV file. Please check the file format and try again.');  
    }  
  }  
  
  function processData(jsonData) {  
    if (!jsonData || jsonData.length < 2) {  
      throw new Error('Invalid data format');  
    }  
    
    const headers = jsonData[0];  
    console.log("Processing headers:", headers);  
    
    const dateColumnIndex = 0;  
    
    state.dates = [];  
    state.monthlyDates = [];  
    state.quarterlyDates = {};  
    state.yearlyDates = {};  
    state.dateMapping = {};  
    
    let startYear = 2016;  
    let startMonth = 0;  
    
    for (let i = 1; i < jsonData.length; i++) {  
      const row = jsonData[i];  
      if (!row || row.length === 0) continue;  
      
      const dateStr = row[dateColumnIndex] ? String(row[dateColumnIndex]).trim() : '';  
      if (!dateStr) continue;  
      
      state.dates.push(dateStr);  
      
      let year, month, monthIndex;  
      
      let match = dateStr.match(/(\d{4})\s+([A-Za-z]{3})/i);  
      if (match) {  
        year = parseInt(match[1]);  
        const monthAbbr = match[2].toUpperCase();  
        if (MONTH_ABBRS.hasOwnProperty(monthAbbr)) {  
          monthIndex = MONTH_ABBRS[monthAbbr];  
        }  
      }  
      
      if (!year || isNaN(monthIndex)) {  
        const rowIndex = i - 1;  
        
        monthIndex = (startMonth + rowIndex) % 12;  
        year = startYear + Math.floor((startMonth + rowIndex) / 12);  
      }  
      
      const monthlyDisplay = `${year} ${MONTH_NAMES[monthIndex]}`;  
      
      state.monthlyDates.push(monthlyDisplay);  
      
      const quarter = getQuarter(monthIndex);  
      const quarterlyKey = `${year}-Q${quarter}`;  
      const quarterlyDisplay = `Q${quarter} ${year}`;  
      
      if (!state.quarterlyDates[quarterlyKey]) {  
        state.quarterlyDates[quarterlyKey] = {  
          year: year,  
          quarter: quarter,  
          display: quarterlyDisplay,  
          indices: []  
        };  
      }  
      state.quarterlyDates[quarterlyKey].indices.push(i - 1);  
      
      const yearlyKey = year.toString();  
      if (!state.yearlyDates[yearlyKey]) {  
        state.yearlyDates[yearlyKey] = {  
          year: year,  
          display: yearlyKey,  
          indices: []  
        };  
      }  
      state.yearlyDates[yearlyKey].indices.push(i - 1);  
      
      state.dateMapping[dateStr] = {  
        year: year,  
        month: monthIndex,  
        quarter: quarter,  
        rowIndex: i - 1,  
        monthlyDisplay: monthlyDisplay,  
        quarterlyKey: quarterlyKey,  
        yearlyKey: yearlyKey  
      };  
    }  
    
    console.log("Parsed dates:", state.monthlyDates);  
    
    const industries = new Set();  
    const metricMap = new Map();  
    
    const industryMap = new Map();  
    
    for (let i = 1; i < headers.length; i++) {  
      const header = headers[i] ? String(headers[i]) : '';  
      if (!header) continue;  
      
      const match = header.match(/(.*?)\s*\((.*?)\)/);  
      
      if (match) {  
        const industryName = match[1].trim();  
        const metricType = match[2].trim();  
        
        const industryCode = 'IND_' + industryName.replace(/\W+/g, '_').toUpperCase();  
        
        industries.add(industryCode);  
        
        industryMap.set(industryCode, {  
          name: industryName,  
          metrics: new Set()  
        });  
        
        industryMap.get(industryCode).metrics.add(metricType);  
        
        let baseMetric = '';  
        let isGrowth = false;  
        let isContribution = false;  
        
        if (metricType.includes('growth')) {  
          baseMetric = metricType.replace(/\s*growth$/, '');  
          isGrowth = true;  
        } else if (metricType.includes('contribution')) {  
          baseMetric = metricType.replace(/\s*contribution$/, '');  
          isContribution = true;  
        } else {  
          baseMetric = metricType;  
        }  
        
        if (!metricMap.has(baseMetric)) {  
          metricMap.set(baseMetric, {  
            baseMetric: baseMetric,  
            growth: null,  
            contribution: null  
          });  
        }  
        
        if (isGrowth) {  
          metricMap.get(baseMetric).growth = metricType;  
        } else if (isContribution) {  
          metricMap.get(baseMetric).contribution = metricType;  
        }  
      }  
    }  
    
    state.metrics = [];  
    state.metricPairs = {};  
    
    metricMap.forEach((metricInfo, baseMetric) => {  
      if (metricInfo.growth && metricInfo.contribution) {  
        state.metrics.push(baseMetric);  
        state.metricPairs[baseMetric] = {  
          growth: metricInfo.growth,  
          contribution: metricInfo.contribution  
        };  
      } else if (metricInfo.growth) {  
        state.metrics.push(baseMetric);  
        state.metricPairs[baseMetric] = {  
          growth: metricInfo.growth,  
          contribution: null  
        };  
      } else if (metricInfo.contribution) {  
        state.metrics.push(baseMetric);  
        state.metricPairs[baseMetric] = {  
          growth: null,  
          contribution: metricInfo.contribution  
        };  
      }  
    });  
    
    console.log("Metric pairs:", state.metricPairs);  
    console.log("Metrics list:", state.metrics);  
    
    state.industries = [...industries].map(code => ({  
      code: code,  
      name: industryMap.get(code)?.name || code  
    }));  
    
    state.industries.forEach(industry => {  
      state.industryData[industry.code] = {};  
      
      Object.values(state.metricPairs).forEach(pair => {  
        if (pair.growth) {  
          state.industryData[industry.code][pair.growth] = {  
            absolute: Array(state.dates.length).fill(0),  
            percentage: Array(state.dates.length).fill(0),  
            filteredAbsolute: [],  
            filteredPercentage: []  
          };  
        }  
        
        if (pair.contribution) {  
          state.industryData[industry.code][pair.contribution] = {  
            absolute: Array(state.dates.length).fill(0),  
            percentage: Array(state.dates.length).fill(0),  
            filteredAbsolute: [],  
            filteredPercentage: []  
          };  
        }  
      });  
    });  
    
    for (let j = 1; j < headers.length; j++) {  
      const header = headers[j] ? String(headers[j]) : '';  
      if (!header) continue;  
      
      const match = header.match(/(.*?)\s*\((.*?)\)/);  
      if (!match) continue;  
      
      const industryName = match[1].trim();  
      const metricType = match[2].trim();  
      
      const industryCode = 'IND_' + industryName.replace(/\W+/g, '_').toUpperCase();  
      
      if (!industries.has(industryCode)) continue;  
      
      for (let i = 1; i < jsonData.length; i++) {  
        const row = jsonData[i];  
        if (!row || row.length < j+1) continue;  
        
        const value = parseFloat(row[j]) || 0;  
        
        const dataIndex = i - 1;  
        
        if (state.industryData[industryCode] &&   
            state.industryData[industryCode][metricType] &&  
            dataIndex < state.industryData[industryCode][metricType].absolute.length) {  
            
          state.industryData[industryCode][metricType].absolute[dataIndex] = value;  
          
          if (i > 1) {  
            const prevValue = parseFloat(jsonData[i-1][j]) || 0;  
            
            if (prevValue !== 0) {  
              const change = ((value - prevValue) / prevValue) * 100;  
              state.industryData[industryCode][metricType].percentage[dataIndex] = change;  
            } else {  
              state.industryData[industryCode][metricType].percentage[dataIndex] = 0;  
            }  
          }  
        }  
      }  
    }  
    
    state.filteredDates = [...state.monthlyDates];  
    
    state.industries.forEach(industry => {  
      Object.values(state.metricPairs).forEach(pair => {  
        if (pair.growth &&   
            state.industryData[industry.code] &&   
            state.industryData[industry.code][pair.growth]) {  
          
          state.industryData[industry.code][pair.growth].filteredAbsolute =   
            [...state.industryData[industry.code][pair.growth].absolute];  
          
          state.industryData[industry.code][pair.growth].filteredPercentage =   
            [...state.industryData[industry.code][pair.growth].percentage];  
        }  
        
        if (pair.contribution &&   
            state.industryData[industry.code] &&   
            state.industryData[industry.code][pair.contribution]) {  
          
          state.industryData[industry.code][pair.contribution].filteredAbsolute =   
            [...state.industryData[industry.code][pair.contribution].absolute];  
          
          state.industryData[industry.code][pair.contribution].filteredPercentage =   
            [...state.industryData[industry.code][pair.contribution].percentage];  
        }  
      });  
    });  
    
    if (state.industries.length > 0) {  
      state.selectedIndustries = [state.industries[0]];  
    }  
    
    if (state.metrics.length > 0) {  
      state.selectedMetric = state.metrics[0];  
    }  
    
    if (state.dates.length > 0) {  
      state.dateStart = state.dates[0];  
      state.dateEnd = state.dates[state.dates.length - 1];  
    }  
  }  
  
  function initUI() {  
    populateDateDropdowns();  
    
    initIndustrySelection();  
    
    initMetricSelection();  
    
    if (state.industries.length > 0) {  
      state.selectedIndustries = [state.industries[0]];  
    }  
    updateIndustryCheckboxes();  
    
    if (state.metrics.length > 0) {  
      state.selectedMetric = state.metrics[0];  
    }  
    updateMetricRadioButtons();  
    
    document.querySelectorAll('input[name="display-mode"]').forEach(radio => {  
      if (radio.value === state.displayMode) {  
        radio.checked = true;  
      }  
    });  
    
    document.querySelectorAll('input[name="chart-type"]').forEach(radio => {  
      if (radio.value === state.chartType) {  
        radio.checked = true;  
      }  
    });  
    
    createCharts();  
    
    addEventListeners();  
  }  
  
  function populateDateDropdowns() {  
    const startDateSelect = document.getElementById('start-date');  
    const endDateSelect = document.getElementById('end-date');  
    
    if (!startDateSelect || !endDateSelect) return;  
    
    startDateSelect.innerHTML = '';  
    endDateSelect.innerHTML = '';  
    
    state.dates.forEach((dateStr, index) => {  
      const option = document.createElement('option');  
      option.value = dateStr;  
      option.textContent = state.monthlyDates[index];  
      
      startDateSelect.appendChild(option.cloneNode(true));  
      endDateSelect.appendChild(option);  
    });  
    
    if (state.dates.length > 0) {  
      startDateSelect.value = state.dates[0];  
      endDateSelect.value = state.dates[state.dates.length - 1];  
    }  
  }  
  
  function initIndustrySelection() {  
    const industryList = document.getElementById('industry-list');  
    if (!industryList) return;  
    
    industryList.innerHTML = '';  
    
    state.industries.forEach(industry => {  
      const item = document.createElement('div');  
      item.className = 'industry-item';  
      item.style.cssText = 'padding: 8px; border-bottom: 1px solid #eee; display: flex; align-items: center;';  
      item.innerHTML = `  
        <label style="display: flex; align-items: center; width: 100%; cursor: pointer;">  
          <input type="checkbox" value="${industry.code}" style="margin-right: 10px; width: 18px; height: 18px;">  
          <span style="font-size: 14px;">${industry.name}</span>  
        </label>  
      `;  
      
      industryList.appendChild(item);  
    });  
  }  
  
  function initMetricSelection() {  
    const metricList = document.getElementById('metric-list');  
    if (!metricList) return;  
    
    metricList.innerHTML = '';  
    
    state.metrics.forEach(metric => {  
      const item = document.createElement('div');  
      item.className = 'metric-item';  
      item.style.cssText = 'padding: 8px; border-bottom: 1px solid #eee; display: flex; align-items: center;';  
      item.innerHTML = `  
        <label style="display: flex; align-items: center; width: 100%; cursor: pointer;">  
          <input type="radio" name="metric-select" value="${metric}" style="margin-right: 10px; width: 18px; height: 18px;">  
          <span style="font-size: 14px;">${metric}</span>  
        </label>  
      `;  
      
      metricList.appendChild(item);  
    });  
  }  
  
  function updateIndustryCheckboxes() {  
    const checkboxes = document.querySelectorAll('#industry-list input[type="checkbox"]');  
    const selectedCodes = state.selectedIndustries.map(i => i.code);  
    
    checkboxes.forEach(checkbox => {  
      checkbox.checked = selectedCodes.includes(checkbox.value);  
    });  
  }  
  
  function updateMetricRadioButtons() {  
    const radioButtons = document.querySelectorAll('#metric-list input[type="radio"]');  
    
    radioButtons.forEach(radio => {  
      radio.checked = (radio.value === state.selectedMetric);  
    });  
  }  
  
  function addEventListeners() {  
    document.querySelectorAll('input[name="display-mode"]').forEach(radio => {  
      radio.addEventListener('change', function() {  
        state.displayMode = this.value;  
        updateCharts();  
      });  
    });  
    
    document.querySelectorAll('input[name="chart-type"]').forEach(radio => {  
      radio.addEventListener('change', function() {  
        state.chartType = this.value;  
        updateCharts();  
      });  
    });  
    
    document.querySelectorAll('#industry-list input[type="checkbox"]').forEach(checkbox => {  
      checkbox.addEventListener('change', function() {  
        const industryCode = this.value;  
        const industry = state.industries.find(i => i.code === industryCode);  
        
        if (!industry) return;  
        
        if (this.checked) {  
          if (!state.selectedIndustries.some(i => i.code === industryCode)) {  
            state.selectedIndustries.push(industry);  
          }  
        } else {  
          state.selectedIndustries = state.selectedIndustries.filter(i => i.code !== industryCode);  
        }  
        
        updateCharts();  
      });  
    });  
    
    document.querySelectorAll('#metric-list input[type="radio"]').forEach(radio => {  
      radio.addEventListener('change', function() {  
        state.selectedMetric = this.value;  
        updateCharts();  
      });  
    });  
    
    document.getElementById('select-all')?.addEventListener('click', () => {  
      state.selectedIndustries = [...state.industries];  
      updateIndustryCheckboxes();  
      updateCharts();  
    });  
    
    document.getElementById('deselect-all')?.addEventListener('click', () => {  
      state.selectedIndustries = [];  
      updateIndustryCheckboxes();  
      updateCharts();  
    });  
    
    document.getElementById('industry-search')?.addEventListener('input', function() {  
      const searchText = this.value.toLowerCase();  
      const items = document.querySelectorAll('.industry-item');  
      
      items.forEach(item => {  
        const text = item.textContent.toLowerCase();  
        item.style.display = text.includes(searchText) ? 'flex' : 'none';  
      });  
    });  
    
    document.getElementById('time-granularity')?.addEventListener('change', function() {  
      state.timeGranularity = this.value;  
      applyDateRange();  
    });  
    
    document.getElementById('apply-date-range')?.addEventListener('click', applyDateRange);  
  }  
  
  function applyDateRange() {  
    const startDate = document.getElementById('start-date')?.value;  
    const endDate = document.getElementById('end-date')?.value;  
    
    if (!startDate || !endDate) {  
      showError('Please select valid date range');  
      return;  
    }  
    
    const startIndex = state.dates.indexOf(startDate);  
    const endIndex = state.dates.indexOf(endDate);  
    
    if (startIndex > endIndex) {  
      showError('Start date must be before end date');  
      return;  
    }  
    
    state.dateStart = startDate;  
    state.dateEnd = endDate;  
    
    filterData();  
    updateCharts();  
  }  
  
  function filterData() {  
    if (!state.dateStart || !state.dateEnd) return;  
    
    const startIndex = state.dates.indexOf(state.dateStart);  
    const endIndex = state.dates.indexOf(state.dateEnd);  
    
    if (startIndex === -1 || endIndex === -1) return;  
    
    const indices = [];  
    for (let i = startIndex; i <= endIndex; i++) {  
      indices.push(i);  
    }  
    
    if (state.timeGranularity === 'month') {  
      state.filteredDates = indices.map(i => state.monthlyDates[i]);  
      
      state.industries.forEach(industry => {  
        Object.values(state.metricPairs).forEach(pair => {  
          if (pair.growth && state.industryData[industry.code] && state.industryData[industry.code][pair.growth]) {  
            state.industryData[industry.code][pair.growth].filteredAbsolute =   
              indices.map(i => state.industryData[industry.code][pair.growth].absolute[i]);  
              
            state.industryData[industry.code][pair.growth].filteredPercentage =   
              indices.map(i => state.industryData[industry.code][pair.growth].percentage[i]);  
          }  
          
          if (pair.contribution && state.industryData[industry.code] && state.industryData[industry.code][pair.contribution]) {  
            state.industryData[industry.code][pair.contribution].filteredAbsolute =   
              indices.map(i => state.industryData[industry.code][pair.contribution].absolute[i]);  
              
            state.industryData[industry.code][pair.contribution].filteredPercentage =   
              indices.map(i => state.industryData[industry.code][pair.contribution].percentage[i]);  
          }  
        });  
      });  
    }   
    else if (state.timeGranularity === 'quarter') {  
      const quarterGroups = {};  
      
      indices.forEach(idx => {  
        const dateStr = state.dates[idx];  
        if (state.dateMapping[dateStr]) {  
          const quarterlyKey = state.dateMapping[dateStr].quarterlyKey;  
          if (!quarterGroups[quarterlyKey]) {  
            quarterGroups[quarterlyKey] = {  
              indices: [],  
              display: state.quarterlyDates[quarterlyKey].display,  
              year: state.quarterlyDates[quarterlyKey].year,  
              quarter: state.quarterlyDates[quarterlyKey].quarter  
            };  
          }  
          quarterGroups[quarterlyKey].indices.push(idx);  
        }  
      });  
      
      const sortedQuarters = Object.keys(quarterGroups).sort((a, b) => {  
        const yearA = quarterGroups[a].year;  
        const yearB = quarterGroups[b].year;  
        if (yearA !== yearB) return yearA - yearB;  
        return quarterGroups[a].quarter - quarterGroups[b].quarter;  
      });  
      
      state.filteredDates = sortedQuarters.map(qKey => quarterGroups[qKey].display);  
      
      state.industries.forEach(industry => {  
        Object.values(state.metricPairs).forEach(pair => {  
          if (pair.growth && state.industryData[industry.code] && state.industryData[industry.code][pair.growth]) {  
            const absoluteData = [];  
            const percentageData = [];  
            
            sortedQuarters.forEach(qKey => {  
              const quarterIndices = quarterGroups[qKey].indices;  
              
              let absSum = 0, absCount = 0;  
              let pctSum = 0, pctCount = 0;  
              
              quarterIndices.forEach(idx => {  
                absSum += state.industryData[industry.code][pair.growth].absolute[idx] || 0;  
                absCount++;  
                
                pctSum += state.industryData[industry.code][pair.growth].percentage[idx] || 0;  
                pctCount++;  
              });  
              
              absoluteData.push(absCount > 0 ? absSum / absCount : 0);  
              percentageData.push(pctCount > 0 ? pctSum / pctCount : 0);  
            });  
            
            state.industryData[industry.code][pair.growth].filteredAbsolute = absoluteData;  
            state.industryData[industry.code][pair.growth].filteredPercentage = percentageData;  
          }  
          
          if (pair.contribution && state.industryData[industry.code] && state.industryData[industry.code][pair.contribution]) {  
            const absoluteData = [];  
            const percentageData = [];  
            
            sortedQuarters.forEach(qKey => {  
              const quarterIndices = quarterGroups[qKey].indices;  
              
              let absSum = 0, absCount = 0;  
              let pctSum = 0, pctCount = 0;  
              
              quarterIndices.forEach(idx => {  
                absSum += state.industryData[industry.code][pair.contribution].absolute[idx] || 0;  
                absCount++;  
                
                pctSum += state.industryData[industry.code][pair.contribution].percentage[idx] || 0;  
                pctCount++;  
              });  
              
              absoluteData.push(absCount > 0 ? absSum / absCount : 0);  
              percentageData.push(pctCount > 0 ? pctSum / pctCount : 0);  
            });  
            
            state.industryData[industry.code][pair.contribution].filteredAbsolute = absoluteData;  
            state.industryData[industry.code][pair.contribution].filteredPercentage = percentageData;  
          }  
        });  
      });  
    }  
    else {  
      const yearGroups = {};  
      
      indices.forEach(idx => {  
        const dateStr = state.dates[idx];  
        if (state.dateMapping[dateStr]) {  
          const yearKey = state.dateMapping[dateStr].yearlyKey;  
          if (!yearGroups[yearKey]) {  
            yearGroups[yearKey] = {  
              indices: [],  
              display: yearKey,  
              year: state.dateMapping[dateStr].year  
            };  
          }  
          yearGroups[yearKey].indices.push(idx);  
        }  
      });  
      
      const sortedYears = Object.keys(yearGroups).sort((a, b) => {  
        return parseInt(a) - parseInt(b);  
      });  
       
      state.filteredDates = sortedYears.map(yKey => yearGroups[yKey].display);  
      
      state.industries.forEach(industry => {  
        Object.values(state.metricPairs).forEach(pair => {  
          if (pair.growth && state.industryData[industry.code] && state.industryData[industry.code][pair.growth]) {  
            const absoluteData = [];  
            const percentageData = [];  
            
            sortedYears.forEach(yKey => {  
              const yearIndices = yearGroups[yKey].indices;  
              
              let absSum = 0, absCount = 0;  
              let pctSum = 0, pctCount = 0;  
              
              yearIndices.forEach(idx => {  
                absSum += state.industryData[industry.code][pair.growth].absolute[idx] || 0;  
                absCount++;  
                
                pctSum += state.industryData[industry.code][pair.growth].percentage[idx] || 0;  
                pctCount++;  
              });  
              
              absoluteData.push(absCount > 0 ? absSum / absCount : 0);  
              percentageData.push(pctCount > 0 ? pctSum / pctCount : 0);  
            });  
            
            state.industryData[industry.code][pair.growth].filteredAbsolute = absoluteData;  
            state.industryData[industry.code][pair.growth].filteredPercentage = percentageData;  
          }  
          
          if (pair.contribution && state.industryData[industry.code] && state.industryData[industry.code][pair.contribution]) {  
            const absoluteData = [];  
            const percentageData = [];  
            
            sortedYears.forEach(yKey => {  
              const yearIndices = yearGroups[yKey].indices;  
              
              let absSum = 0, absCount = 0;  
              let pctSum = 0, pctCount = 0;  
              
              yearIndices.forEach(idx => {  
                absSum += state.industryData[industry.code][pair.contribution].absolute[idx] || 0;  
                absCount++;  
                
                pctSum += state.industryData[industry.code][pair.contribution].percentage[idx] || 0;  
                pctCount++;  
              });  
              
              absoluteData.push(absCount > 0 ? absSum / absCount : 0);  
              percentageData.push(pctCount > 0 ? pctSum / pctCount : 0);  
            });  
            
            state.industryData[industry.code][pair.contribution].filteredAbsolute = absoluteData;  
            state.industryData[industry.code][pair.contribution].filteredPercentage = percentageData;  
          }  
        });  
      });  
    }  
  }  
  
  function createCharts() {  
    createGrowthChart();  
    createContributionChart();  
  }  
  
  function createGrowthChart() {  
    const canvas = document.getElementById('growth-chart');  
    if (!canvas) return;  
    
    const ctx = canvas.getContext('2d');  
    
    if (growthChart) {  
      growthChart.destroy();  
    }  
    
    const growthMetric = state.selectedMetric ?   
      state.metricPairs[state.selectedMetric]?.growth : null;  
    
    if (!growthMetric) {  
      console.warn(`No growth metric found for selected metric: ${state.selectedMetric}`);  
      return;  
    }  
    
    const brexitEvents = [  
      { date: '2016 JUN', label: 'Brexit Referendum (Jun 2016)' },  
      { date: '2020 JAN', label: 'UK leaves EU (Jan 2020)' },  
      { date: '2020 DEC', label: 'End of transition period (Dec 2020)' }  
    ];  
    
    const datasets = [];  
    
    state.selectedIndustries.forEach((industry, industryIndex) => {  
      if (state.industryData[industry.code] &&   
          state.industryData[industry.code][growthMetric]) {  
        
        const data = state.displayMode === 'absolute'  
          ? state.industryData[industry.code][growthMetric].filteredAbsolute  
          : state.industryData[industry.code][growthMetric].filteredPercentage;  
        
        if (!data || data.length === 0) {  
          console.log(`No growth data for ${industry.name}, metric: ${growthMetric}`);  
          return;  
        }  
        
        const hue = (industryIndex * 137) % 360;  
        const backgroundColor = `hsla(${hue}, 70%, 60%, 0.2)`;  
        const borderColor = `hsla(${hue}, 70%, 60%, 1)`;  
        
        datasets.push({  
          label: industry.name,  
          data: data,  
          backgroundColor: state.displayMode === 'percentage' && state.chartType === 'bar'  
            ? data.map(value => value >= 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)')  
            : backgroundColor,  
          borderColor: borderColor,  
          borderWidth: 2,  
          tension: 0.1  
        });  
      }  
    });  
    
    const config = {  
      type: state.chartType,  
      data: {  
        labels: state.filteredDates,  
        datasets: datasets  
      },  
      options: {  
        responsive: true,  
        maintainAspectRatio: false,  
        scales: {  
          y: {  
            beginAtZero: false,  
            title: {  
              display: true,  
              text: state.displayMode === 'absolute' ? 'Value' : 'Growth Rate (%)',  
              font: {  
                size: 14,  
                weight: 'bold'  
              }  
            }  
          },  
          x: {  
            title: {  
              display: true,  
              text: 'Date',  
              font: {  
                size: 14,  
                weight: 'bold'  
              }  
            },  
            ticks: {  
              maxRotation: 45,  
              minRotation: 45,  
              autoSkip: true,  
              autoSkipPadding: 10  
            }  
          }  
        },  
        plugins: {  
          title: {  
            display: false  
          },  
          legend: {  
            display: false   
          },  
          tooltip: {  
            callbacks: {  
              label: function(context) {  
                let label = context.dataset.label || '';  
                if (label) {  
                  label += ': ';  
                }  
                if (state.displayMode === 'absolute') {  
                  label += context.parsed.y.toFixed(2);  
                } else {  
                  const value = context.parsed.y;  
                  label += value.toFixed(2) + '%';  
                  if (value > 0) {  
                    label += ' growth';  
                  } else if (value < 0) {  
                    label += ' decline';  
                  }  
                }  
                return label;  
              },  
              afterBody: function(context) {  
                const dateLabel = state.filteredDates[context[0].dataIndex];  
                for (const event of brexitEvents) {  
                  if (dateLabel.includes(event.date)) {  
                    return [`\n${event.label}`];  
                  }  
                }  
                return null;  
              }  
            }  
          }  
        }  
      }  
    };  
    
    growthChart = new Chart(ctx, config);  
  }  
  
  function createContributionChart() {  
    const canvas = document.getElementById('contribution-chart');  
    if (!canvas) return;  
    
    const ctx = canvas.getContext('2d');  
    
    if (contributionChart) {  
      contributionChart.destroy();  
    }  
    
    const contributionMetric = state.selectedMetric ?   
      state.metricPairs[state.selectedMetric]?.contribution : null;  
    
    if (!contributionMetric) {  
      console.warn(`No contribution metric found for selected metric: ${state.selectedMetric}`);  
      return;  
    }  
    
    const brexitEvents = [  
      { date: '2016 JUN', label: 'Brexit Referendum (Jun 2016)' },  
      { date: '2020 JAN', label: 'UK leaves EU (Jan 2020)' },  
      { date: '2020 DEC', label: 'End of transition period (Dec 2020)' }  
    ];  
    
    const datasets = [];  
    
    state.selectedIndustries.forEach((industry, industryIndex) => {  
      if (state.industryData[industry.code] &&   
          state.industryData[industry.code][contributionMetric]) {  
        
        const data = state.displayMode === 'absolute'  
          ? state.industryData[industry.code][contributionMetric].filteredAbsolute  
          : state.industryData[industry.code][contributionMetric].filteredPercentage;  
        
        if (!data || data.length === 0) {  
          console.log(`No contribution data for ${industry.name}, metric: ${contributionMetric}`);  
          return;  
        }  
        
        const hue = (industryIndex * 137) % 360;  
        const backgroundColor = `hsla(${hue}, 70%, 60%, 0.2)`;  
        const borderColor = `hsla(${hue}, 70%, 60%, 1)`;  
        
        datasets.push({  
          label: industry.name,  
          data: data,  
          backgroundColor: state.displayMode === 'percentage' && state.chartType === 'bar'  
            ? data.map(value => value >= 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)')  
            : backgroundColor,  
          borderColor: borderColor,  
          borderWidth: 2,  
          tension: 0.1  
        });  
      }  
    });  
    
    const config = {  
      type: state.chartType,  
      data: {  
        labels: state.filteredDates,  
        datasets: datasets  
      },  
      options: {  
        responsive: true,  
        maintainAspectRatio: false,  
        scales: {  
          y: {  
            beginAtZero: false,  
            title: {  
              display: true,  
              text: state.displayMode === 'absolute' ? 'Value' : 'Contribution (%)',  
              font: {  
                size: 14,  
                weight: 'bold'  
              }  
            }  
          },  
          x: {  
            title: {  
              display: true,  
              text: 'Date',  
              font: {  
                size: 14,  
                weight: 'bold'  
              }  
            },  
            ticks: {  
              maxRotation: 45,  
              minRotation: 45,  
              autoSkip: true,  
              autoSkipPadding: 10  
            }  
          }  
        },  
        plugins: {  
          title: {  
            display: false  
          },  
          legend: {  
            display: false   
          },  
          tooltip: {  
            callbacks: {  
              label: function(context) {  
                let label = context.dataset.label || '';  
                if (label) {  
                  label += ': ';  
                }  
                if (state.displayMode === 'absolute') {  
                  label += context.parsed.y.toFixed(2);  
                } else {  
                  const value = context.parsed.y;  
                  label += value.toFixed(2) + '%';  
                  if (value > 0) {  
                    label += ' contribution';  
                  } else if (value < 0) {  
                    label += ' negative contribution';  
                  }  
                }  
                return label;  
              },  
              afterBody: function(context) {  
                const dateLabel = state.filteredDates[context[0].dataIndex];  
                for (const event of brexitEvents) {  
                  if (dateLabel.includes(event.date)) {  
                    return [`\n${event.label}`];  
                  }  
                }  
                return null;  
              }  
            }  
          }  
        }  
      }  
    };  
    
    contributionChart = new Chart(ctx, config);  
  }  
  
  function updateCharts() {  
    createGrowthChart();  
    createContributionChart();  
  }  
  
  function showError(message) {  
    console.error(message);  
    alert(message);  
  }  
  
  loadCSVData();  
  
  return {  
    remove: function() {  
      if (growthChart) {  
        growthChart.destroy();  
        growthChart = null;  
      }  
      
      if (contributionChart) {  
        contributionChart.destroy();  
        contributionChart = null;  
      }  
      
      if (controlPanelContainer) {  
        controlPanelContainer.remove();  
        controlPanelContainer = null;  
      }  
    }  
  };  
}  

export function cleanupUKMap() {  
  if (growthChart) {  
    growthChart.destroy();  
    growthChart = null;  
  }  
  
  if (contributionChart) {  
    contributionChart.destroy();  
    contributionChart = null;  
  }  
  
  if (controlPanelContainer) {  
    controlPanelContainer.remove();  
    controlPanelContainer = null;  
  }  
}  