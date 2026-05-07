<script>
  import * as d3 from "d3";

  export let data = [];
  export let geojson = null;
  export let mesh = null;
  export let width = 500;
  export let height = 290;
  export let selectedCommunity = null;

  // --- Resolve label position with edge-clipping detection ---
  const DIR_OFFSETS = {
    N:  { dx: 0,  dy: -1, anchor: "middle" },
    S:  { dx: 0,  dy:  1, anchor: "middle" },
    E:  { dx:  1, dy:  0, anchor: "start" },
    W:  { dx: -1, dy:  0, anchor: "end" },
    NE: { dx:  1, dy: -1, anchor: "start" },
    NW: { dx: -1, dy: -1, anchor: "end" },
    SE: { dx:  1, dy:  1, anchor: "start" },
    SW: { dx: -1, dy:  1, anchor: "end" },
  };
  const FLIP_H = { E:"W", W:"E", NE:"NW", NW:"NE", SE:"SW", SW:"SE", N:"N", S:"S" };
  const FLIP_V = { N:"S", S:"N", NE:"SE", SE:"NE", NW:"SW", SW:"NW", E:"E", W:"W" };

  function resolveLabel(baseX, baseY, direction, text, bounds, d = 20, fontSize = 18) {
    const charW = fontSize * 0.6;
    const textW = text.length * charW;
    const textH = fontSize;
    const [minX, minY, maxX, maxY] = bounds;

    function test(dir) {
      const o = DIR_OFFSETS[dir] || DIR_OFFSETS.E;
      const x = baseX + o.dx * d, y = baseY + o.dy * d;
      const left  = o.anchor === "start" ? x : o.anchor === "end" ? x - textW : x - textW / 2;
      const right = left + textW;
      return {
        x, y, anchor: o.anchor,
        clipsH: left < minX || right > maxX,
        clipsV: (y - textH / 2) < minY || (y + textH / 2) > maxY,
      };
    }

    for (const dir of [
      direction,
      FLIP_H[direction],
      FLIP_V[direction],
      FLIP_V[FLIP_H[direction]],
    ]) {
      const r = test(dir);
      if (!r.clipsH && !r.clipsV) return { x: r.x, y: r.y, anchor: r.anchor };
    }

    let { x, y, anchor } = test(direction);
    const left  = anchor === "start" ? x : anchor === "end" ? x - textW : x - textW / 2;
    const right = left + textW;
    if (right > maxX) x -= right - maxX;
    if (left  < minX) x += minX - left;
    if (y - textH / 2 < minY) y = minY + textH / 2;
    if (y + textH / 2 > maxY) y = maxY - textH / 2;
    return { x, y, anchor };
  }

  let projection;
  let path;

  $: if (geojson) {
    projection = d3.geoMercator()
      .fitSize([width, height], geojson);

    path = d3.geoPath().projection(projection);
  }

  $: dataMap = new Map(
    data.map(d => [d.community_name?.toUpperCase(), d])
  );

  $: features = geojson
    ? geojson.features.map(f => ({
        ...f,
        data: dataMap.get(f.properties.community) // adjust key!
      }))
    : [];

</script>

<svg viewBox="0 0 960 600" {width} {height}>
  <g id="context">
    {#if geojson}
      {#each features as feature}
        <path
            d={path(feature)}
            fill = {"steelblue"}
            stroke={  selectedCommunity === feature.data?.community_name
                ? "black"
                : "#fff"
            }
            stroke-width={  selectedCommunity === feature.data?.community_name
                ? "3"
                : "1"
            }
            style="cursor: pointer; pointer-events: all"

            on:click={() => {
            const community = feature.data?.community_name;
            console.log(community)
            selectedCommunity =
              selectedCommunity === community
                ? null
                : community;
          }}
        />
      {/each}  
      

      {#if selectedCommunity}
        <g transform={`translate(${width - 180}, 40)`}>
          
          Box
          <rect
            width="180"
            height="50"
            fill="#ffffff"
            stroke="#ccc"
            rx="10"
          />          
          
          <!-- Title -->
          <text
            x="10"
            y="20"
            font-size="17"
            font-weight="600"
          >
            Community Area:
          </text>

          <text
            x="10"
            y="40"
            font-size="15"
          >
            {selectedCommunity}
          </text>

        </g>
      {/if}

    {/if}
    {#if mesh}
      <path d={path(mesh)} fill="none" stroke="#bbb"
        stroke-width="1" stroke-linejoin="round" />
    {/if}
  </g>
</svg>

<style>
  .annotation-label {
    font-size: 18px;
    fill: crimson;
    font-weight: 600;
    paint-order: stroke;
    stroke: white;
    stroke-width: 3px;
  }
</style>
