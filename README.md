# Exercise 6 – Interactivity (histogram, filters, scatterplot, tooltips)

COS30045 Data Visualisation – Demonstration 2 (Week 7)
Chung Hien Thong (106212681), Swinburne University of Technology

**Live site (Mercury):** http://mercury.swin.edu.au/cos30045/s106212681/dv-06-interactivity/index.html

## What this is

A histogram of TV energy consumption with screen-type and screen-size filter buttons (6.1, 6.2) and a scatterplot of energy use against star rating, coloured by screen type, with a legend and tooltips (6.3, 6.4). The filters also update the scatterplot (linked views).

All four Demonstration 2 exercises share the same navigation bar, so they work as one website on Mercury:

| Exercise | Folder / repository |
|---|---|
| 4.1 SVG house | `dv-03-svg-exercise` |
| 4.3–4.7 Website with bar chart | `dv-04-bar-chart-exercise` |
| 5 Multi-chart page | `dv-05-multichart-webpage` |
| 6 Interactivity | `dv-06-interactivity` |

## Files

```
index.html              page with both charts
css/base.css            page styles
css/visualisation.css   styles shared by both charts
js/load-data.js         loads the CSV once and calls every chart/interaction
js/shared-constants.js  sizes, scales, colours, bin generator, filter arrays
js/interactions.js      6.2 filters + updateHistogram, 6.4 tooltip + mouse events
js/histogram.js         6.1 histogram
js/scatterplot.js       6.3 scatterplot + legend
data/Ex6_TVdata_withStar.csv   data set from Canvas (Week 6)
```

## Running locally

`d3.csv()` uses `fetch`, so the page must be served over HTTP (opening the file directly with `file://` blocks the CSV).
Use the VS Code **Live Server** extension, or run `python -m http.server 8000` in this folder and open http://localhost:8000.
D3 v7 is loaded from `https://d3js.org/d3.v7.min.js`.

## References

- Dufour, A. M. & Meeks, E. (2024). *D3.js in Action* (3rd ed.). Manning Publications.
- COS30045 Week 4–6 exercise instructions (Canvas, 2026).
- Australian Government Energy Rating – television registration data (2026); Australian Energy Regulator – annual spot prices (1998–2024).
