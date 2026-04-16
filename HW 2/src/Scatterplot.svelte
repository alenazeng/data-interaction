<script>
    import * as d3 from 'd3';
    export let data;
    export let fullData;
    export let xVar;
    export let yVar;
    export let filter;
    export let update;


    let margin = {top: 20, right: 30, bottom: 45, left: 50};
    let width = 360;
    let height = 200;

    let chartW = width - margin.left - margin.right;
    let chartH = height - margin.top - margin.bottom;
    
    let brushLayer;
    let xAxis;
    let yAxis;

    const brush = d3.brushX()
        .extent([[0, 0], [chartW, chartH]])
        .on("brush", brushed)
        .on("end", brushended);        

    function brushed(event) {
        if (event && event.selection) {
            filter = [xScale.invert(event.selection[0]), xScale.invert(event.selection[1])];
            update();
        }
    }

    function brushended(event) {
        if (event && !event.selection) {
            filter = [];
            update();
        }
    }

    $: xScale = d3.scaleLinear()
        .domain(d3.extent(fullData, d => d.properties[xVar]))
        .range([0, chartW]);

    $: yScale = d3.scaleLinear()
        .domain(d3.extent(fullData, d => d.properties[yVar]))
        .range([chartH, 0]);
    $: {
        d3.select(xAxis).call(d3.axisBottom(xScale));
        d3.select(yAxis).call(d3.axisLeft(yScale));
    }
    $: {	
        d3.select(brushLayer)
            .call(brush);
        d3.select(xAxis)
            .call(d3.axisBottom(xScale));

        d3.select(yAxis)
            .call(d3.axisLeft(yScale));
    }
    $: labelMap = {
        povertyIndex: "Poverty rate (% of residents)",
        collegeGrad: "College graduation rate (%)",
    };

</script>

<svg {width} {height}>
    <g transform="translate({margin.left}, {margin.top})">

    {#each fullData as d}
        <circle
        cx={xScale(d.properties[xVar])}
        cy={yScale(d.properties[yVar])}
        r="2"
        fill="lightgrey"
        />
    {/each}

    <!-- filtered points -->
    {#each data as d}
        <circle
        cx={xScale(d.properties[xVar])}
        cy={yScale(d.properties[yVar])}
        r="3"
        fill="goldenrod"
        />
    {/each}

    </g>
    <g
        transform="translate({margin.left}, {chartH + margin.top})"
        bind:this={xAxis}
    />
    <g
        transform="translate({margin.left}, {margin.top})"
        bind:this={yAxis}
    />
    <text
        x={margin.left + chartW / 2}
        y={height - 5}
        text-anchor="middle"
    >
        {labelMap[xVar] || xVar}
    </text>
    <text
        transform={`translate(15, ${margin.top + chartH / 2}) rotate(-90)`}
        text-anchor="middle"
        font-size=14
    >
        {labelMap[yVar] || yVar}
    </text>

    <g transform="translate({margin.left}, {margin.top})"
        bind:this={brushLayer} />
    
    <g transform="translate({margin.left}, {chartH + margin.top})" 
        bind:this={xAxis} />

    <g transform="translate({margin.left}, {margin.top})"
        bind:this={yAxis} />

</svg>