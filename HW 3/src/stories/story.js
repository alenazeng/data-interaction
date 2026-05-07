// story.js

export const varLabels = {
  poverty_rate: "Poverty Rate",
  household_income: "Median Household Income",
  college_grad: "College Graduation Rate",
  particulate_matter: "Particulate matter (PM 2.5) concentration",
  environmentalJusticeImpactRate: "Chicago Environmental Justice Impact Rate"
};

export const stages = [
  {
    // Layout: "full" (scatter + map + bars)
    id: "intro",
    copy: `
      There is large income inequality across Chicago, varying widely by community area. 
      Educational attainment patterns partly explain it, as there is a strong positive correlation between 
      college graduation rates (the percentage of residents 25 or older with a bachelor's degree or higher)
      and household income. 
      
      <br>
      <br>
      Click on a community area on the map to filter the plots. Click again to deselect. 
    `,
    views: {
      scatter: {
        xVar: "household_income",
        yVar: "college_grad" 
      },
      bars: {
        xVar: "poverty_rate"
      },
      map: true
    },
    highlightedCities: ["Seattle", "Chicago"],
    annotations: {
      scatter: [
        {
          x1: 60000, y1: 1200,
          x2: 130000, y2: 2700,
          text: "Household income-education trend",
          direction: "SE"
        }
      ],
      // bars: {
      //   threshold: 80000,
      //   direction: "above",
      //   text: "High-income cities"
      // },
      // map: [
      //   // { city: "Seattle", text: "Tech hub", direction: "E" },
      //   // { city: "Chicago", text: "Midwest anchor", direction: "SE" }
      // ]
    }
  },

  {
    // Layout: "scatter-only"
    id: "price_to_income",
    copy: `
      But environmental burden also follows poverty.
      Pollution is not randomly distributed across the city — instead, it appears to disproportionately affect poorer community areas on the South and West Side. 
      Latinx and Black Chicagoans experience more of their neighborhoods zoned for manufacturing compared to other groups, 
      and 50% of the population in the highest air pollution census tracts are Latinx.
      <br>
      <br>
      PM 2.5, or particulate matter smaller than 2.5 microns in diameter, 
      is one of the most dangerous pollutants because the particles can penetrate deep into the alveoli of the lungs,
      causing problems such as premature death in people with heart or lung disease, 
      aggravated asthma, and decreased lung function.
    `,
    views: {
      scatter: {
        xVar: "household_income",
        yVar: "particulate_matter"
      },
      //       bars: {
      //   xVar: "poverty_rate"
      // },

      bars: false,
      map: true
    },
    highlightedCities: ["San Jose", "Seattle", "Denver"],
    annotations: {
      scatter: [
        {
          x1: 55000, y1: 6,
          x2: 135000, y2: 6,
          text: " ",
          direction: "NE"
        }
      ],
      map: [
        { city: "Seattle", text: "Tech hub", direction: "E" },
        { city: "Chicago", text: "Midwest anchor", direction: "SE" }
      ]
    },
  },


  {
    // Layout: "scatter-bar" (scatter + bars, no map)
    id: "rent_burden",
    copy: `
      
      Areas with lower household income tend to have a greater percentage of the population that live in an Environmental Justice (EJ) priority neighborhood, 
      which are neighborhoods that are most burdened by pollution and most vulnerable to its effects. 
      Any census tract with a Chicago EJ Index Score of 75 or greater, or whose Chicago EJ Index score 
      is 70 or greater and contiguous with another census tract with a Chicago EJ Index Score of 75 or
      greater, is designated as an EJ Neighborhood.

      <br>
      <br>

      To address these disparities, Chicago's 2025 Environmental Justice Action Plan has made commitments to
      expanding the city's community air monitoring network, 
      incorporating emission reduction goals into transportation planning,
      and increasing community benefits such as trees, vacant lot greening and expanded waste collection. 
      
      `,
    views: {
      scatter: {
        xVar: "household_income",
        yVar: "environmentalJusticeImpactRate"
      },
      bars: false,
      map: true
    },
    highlightedCities: ["Hyde Park", "New York", "Austin"],
    annotations: {
      scatter: [
        {
          x1: 0, y1: 0,
          x2: 0, y2: 0,
          text: " ",
          direction: " "
        }
      ],
    }
  },
];
