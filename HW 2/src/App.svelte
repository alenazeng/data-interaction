<script>
  import * as d3 from 'd3';
	import {onMount} from 'svelte';
  import Map from './Map.svelte';
  import Histogram from './Histogram.svelte';
  import Scatterplot from './Scatterplot.svelte';

	let data = [];
  let fullData = [];
  let filter1 = [];
  let filter2 = [];
  let filter3 = [];
  let selectedArea = null;

  let var1 = 'environmentalJusticeImpactRate';
  let var2 = 'particulateMatter';
  let var3 = 'povertyIndex';
  let var4 = 'collegeGrad';

	onMount(async function() {
    let table = d3.csv('env-income-data.csv', (d) => ({
          ...d,
          'Name': d['Name'],
          'CHAVCNN_2023': +d['CHAVCNN_2023'],
          'PMC_2020': +d['PMC_2020'],
          'INC_2020-2024': +d['INC_2020-2024'],
          'EDE_2020-2024': +d['EDE_2020-2024'],
          'POV_2020-2024': +d['POV_2020-2024'],
          'CHAKUCW_2017': +d['CHAKUCW_2017']
        }));

    let geocoord = d3.json('community-areas.geojson')
        .then((d) => d.features);

    await Promise.all([table, geocoord]).then((values) => {
      let table = values[0];
      let geocoord = values[1];

      for (let i = 0; i < geocoord.length; i++) {
        let area = geocoord[i].properties.community;
        let found = false;
        let j = 0;

        while (!found && table.length > j) {
          if (table[j].Name.toUpperCase() == area) {
            found = true;
            data.push(geocoord[i]);
            data[data.length - 1].properties['environmentalJusticeImpactRate'] = table[j]['CHAVCNN_2023']
            data[data.length - 1].properties['particulateMatter'] = table[j]['PMC_2020']
            data[data.length - 1].properties['householdIncome'] = table[j]['INC_2020-2024']
            data[data.length - 1].properties['collegeGrad'] = table[j]['EDE_2020-2024']
            data[data.length - 1].properties['povertyIndex'] = table[j]['POV_2020-2024']
            data[data.length - 1].properties['treeCanopy'] = table[j]['CHAKUCW_2017']
          } else {
            j++;
          }
        }
      }
      data = [...data];
      fullData = [...data];
    });
	});

  function updateData() {
    data = fullData.filter(d => {
      const cond1 = filter1.length === 0 || 
        (d.properties[var1] >= filter1[0] && d.properties[var1] < filter1[1]);

      const cond2 = filter2.length === 0 || 
        (d.properties[var2] >= filter2[0] && d.properties[var2] < filter2[1]);

      const cond3 = filter3.length === 0 || 
        (d.properties[var3] >= filter3[0] && d.properties[var3] < filter3[1]);

      const cond4 = !selectedArea || 
        d.properties.community === selectedArea;

      return cond1 && cond2 && cond3 && cond4;
  });
  }
  $: [filter1, filter2, filter3, selectedArea], updateData();

</script>

<main>
  <h1>Chicago Community Areas:</h1>
  <h1>Environmental and Economic Data</h1>
  <div class="flex-container row">
    <div class="map">
      <h4>Click on a community area to filter graphs, click on it again to deselect</h4>
      <Map data={data} fullData={fullData} bind:selectedArea></Map>
    </div>
    <div class="flex-container col">
      <div class="hist"><Histogram data={data} fullData={fullData} variable={var1} bind:filter={filter1} update={updateData}></Histogram></div>
      <div class="hist"><Histogram data={data} fullData={fullData} variable={var2} bind:filter={filter2} update={updateData}></Histogram></div>
      <div class="scatter"><Scatterplot data={data} fullData={fullData} xVar={var3} yVar={var4} bind:filter={filter3} update={updateData}/></div>
    </div>
    <div>
      <p style="text-align: left;"><b>Chicago Environmental Justice Impact Rate:</b> 
        Estimated % of population within a community area that live in an Environmental Justice (EJ) priority neighborhood, which faces high combined burdens of pollution and social vulnerability.</p>
      <p style="text-align: left;"><b>Particulate matter (PM 2.5) concentration: </b>Annual average concentration in micrograms per cubic meter. PM 2.5, or particulate matter smaller than 2.5 microns in diameter, is one of the most dangerous pollutants because the particles can penetrate deep into the alveoli of the lungs.</p>
      <p style="text-align: left;"><b>Poverty rate (% of residents): </b>Percent of residents in families that are below the Federal Poverty Level.</p>
      <p style="text-align: left;"><b>College graduation rate (% of residents): </b>Residents 25 or older with a four-year college (bachelor's) degree or higher.</p>    
    </div>
  </div>
</main>

<style>
  .flex-container {

    display: flex;
    
    justify-content: center;  
    /* flex-flow: row; */ 
    

    height: 100%;
    padding: 15px;
    gap: 5px;

  }

  .flex-container > div{
    padding: 8px;
  }

  .flex-container .row {
    flex-direction: row;  
  }

  .flex-container .col {
    flex-direction: column;  
  }

  .map { 
    /* flex:1 1 auto; */
    flex-grow:1;
  }
			
  .hist { 
    /* flex:0 1 auto; */
    flex-grow:0;
  }
			

</style>