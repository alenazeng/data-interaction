<script>
    import * as d3 from 'd3';
    import {legendColor} from 'd3-svg-legend';

    export let data;
    export let fullData;
    export let selectedArea;

    let width = 500;
    let height = 500;
    let offsetX = -75;
    let hoveredTract = null;
    let selectedTract = null;

    let proj = d3.geoMercator()
        .scale(40000)
        .center([-87.39, 41.52])
        .translate([width, height]);
    let path = d3.geoPath().projection(proj);

    $: scale = d3.scaleSequential(d3.interpolateBlues)
        .domain([
            d3.min(fullData, d => +d.properties.householdIncome),
            d3.max(fullData, d => +d.properties.householdIncome)
        ]);

    let legend;
    $: {	
            const colorLegend = legendColor()
                .shape('rect')
                .cells(9)
                .scale(scale);
            
            d3.select(legend)
                .call(colorLegend);
        }
    
</script>

<main>
    <svg {width} {height} on:click={() => selectedTract = null}>
        <g transform="translate({offsetX}, 0)">
            {#each data as d}
                <path
                    role="button"
                    tabindex="0"
                    style="fill: {scale(+d.properties.householdIncome)};"
                    d={path(d)}

                    on:mouseenter={() => hoveredTract = {
                        name: d.properties.community,
                        income: d.properties.householdIncome
                    }}

                    on:focus={() => hoveredTract = {
                        name: d.properties.community,
                        income: d.properties.householdIncome
                    }}
                
                    on:mouseleave={() => hoveredTract = null}
                    on:blur={() => hoveredTract = null}

                    on:click={() => {
                        selectedArea = selectedArea === d.properties.community 
                            ? null 
                            : d.properties.community;

                        hoveredTract = {
                            name: d.properties.community,
                            income: d.properties.householdIncome
                        };
                    }}
                />
            {/each}

            {#each fullData as d}
                <path class="geooverlay" d={path(d)} />
            {/each}

        </g>

        <g transform="translate({width - 100 + offsetX}, 50)">
            <text x="0" y="-10" font-size="12" font-weight="bold">
                Median Household Income
            </text>
            <g bind:this={legend}></g>
        </g>

    </svg>

    <!-- {#if hoveredTract}
        <div class="tooltip">
            <div><strong>{hoveredTract.name}</strong></div>
            <div>Income: ${hoveredTract.income.toLocaleString()}</div>
        </div>
    {/if} -->

    {#if selectedTract || hoveredTract}
        <div class="tooltip">
            <div><strong>{(selectedTract || hoveredTract).name}</strong></div>
            <div>
                Income: ${(selectedTract || hoveredTract).income.toLocaleString()}
            </div>
        </div>
    {/if}

</main>

<style>
    .geooverlay {
      stroke: grey;
      stroke-width: 1px;
      fill: none;
    }

    main {
      position: relative;
    }

    .tooltip {
      position: absolute;
      top: 10px;
      left: -50px;
      background: white;
      border: 1px solid #ccc;
      padding: 6px 8px;
      font-size: 12px;
      pointer-events: none;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }

  </style>