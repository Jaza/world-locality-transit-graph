ready(() => {
  const CONTAINER_ID = "graph";
  const GRAPH_SELECT_CONTAINER_NAME = "header";
  const TOGGLE_EDGES_CONTAINER_NAME = "footer";
  const TOGGLE_EDGES_WRAPPER_ID = "toggle-edges-wrapper";
  const TOGGLE_NEARBY_EDGES_ID = "toggle-nearby-edges";
  const TOGGLE_ALL_EDGES_ID = "toggle-all-edges";
  const TOGGLE_BOUNDING_POLYGON_WRAPPER_ID = "toggle-bounding-polygon-wrapper";
  const TOGGLE_BOUNDING_POLYGON_ID = "toggle-bounding-polygon";
  const GRAPH_SELECT_ID = "graph-select";
  const LEAFLET_MAP_URL = (
    "//api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}" +
    "?access_token={accessToken}"
  );
  const LEAFLET_STYLE_ID = "streets-v12";
  const LEAFLET_DEFAULT_COORDS = {lat: 0, lng: 0};
  const LEAFLET_DEFAULT_ZOOM = 3;
  const LEAFLET_MAX_ZOOM = 18;
  const MAPBOX_ACCESS_TOKEN = (
    "pk.eyJ1IjoiamF6YSIsImEiOiJjbHdjdzRzNGwwN2h" +
    "qMmlwaHlnbnd3dTIyIn0.HYukMJILRBnI9X_6jU3eyw"
  );
  const LEAFLET_MAP_ATTRIBUTION = (
    'Map data &copy; ' +
    '<a href="https://www.openstreetmap.org/">OpenStreetMap</a> ' +
    'contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>, ' +
    'Source <a href="https://github.com/Jaza/world-locality-transit-graph">code on GitHub</a>'
  );
  const CSV_URL_PREFIX = (
    "https://raw.githubusercontent.com/Jaza/world-locality-transit-graph/master/csv/"
  );

  const MAX_TRANSIT_TIME_MINS = 330;

  const GRAPH_CODES = [
    "au-arnhem-land",
    "au-barkly",
    "au-cape-york",
    "au-east",
    "au-east-kimberley",
    "au-north",
    "au-pilbara",
    "au-red-centre",
    "au-tas",
    "au-west",
    "au-west-kimberley",
    "europe",
    "north-america",
    "nz-north-island",
    "nz-south-island",
    "south-america"
  ];

  const GRAPH_INFO_MAP = {
    "au-arnhem-land": {
      name: "AU Arnhem Land",
      nodesCsvFilename: "au_arnhem_land_localities.csv",
      nearbyEdgesCsvFilename: "au_arnhem_land_localities_transit_times.csv",
      farEdgesCsvFilename: "au_arnhem_land_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_arnhem_land_bounding_polygon.csv",
      defaultCoords: {lat: -13.769, lng: 135.319},
      defaultZoom: 7
    },
    "au-barkly": {
      name: "AU Barkly",
      nodesCsvFilename: "au_barkly_localities.csv",
      nearbyEdgesCsvFilename: "au_barkly_localities_transit_times.csv",
      farEdgesCsvFilename: "au_barkly_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_barkly_bounding_polygon.csv",
      defaultCoords: {lat: -19.856, lng: 134.398},
      defaultZoom: 7
    },
    "au-cape-york": {
      name: "AU Cape York",
      nodesCsvFilename: "au_cape_york_localities.csv",
      nearbyEdgesCsvFilename: "au_cape_york_localities_transit_times.csv",
      farEdgesCsvFilename: "au_cape_york_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_cape_york_bounding_polygon.csv",
      defaultCoords: {lat: -12.631, lng: 142.690},
      defaultZoom: 7
    },
    "au-east": {
      name: "AU East",
      nodesCsvFilename: "au_east_localities.csv",
      nearbyEdgesCsvFilename: "au_east_localities_transit_times.csv",
      farEdgesCsvFilename: "au_east_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_east_bounding_polygon.csv",
      defaultCoords: {lat: -28.009906, lng: 145.4592851},
      defaultZoom: 5
    },
    "au-east-kimberley": {
      name: "AU East Kimberley",
      nodesCsvFilename: "au_east_kimberley_localities.csv",
      nearbyEdgesCsvFilename: "au_east_kimberley_localities_transit_times.csv",
      farEdgesCsvFilename: "au_east_kimberley_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_east_kimberley_bounding_polygon.csv",
      defaultCoords: {lat: -16.357, lng: 128.079},
      defaultZoom: 7
    },
    "au-north": {
      name: "AU North",
      nodesCsvFilename: "au_north_localities.csv",
      nearbyEdgesCsvFilename: "au_north_localities_transit_times.csv",
      farEdgesCsvFilename: "au_north_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_north_bounding_polygon.csv",
      defaultCoords: {lat: -14.1, lng: 131.1},
      defaultZoom: 7
    },
    "au-pilbara": {
      name: "AU Pilbara",
      nodesCsvFilename: "au_pilbara_localities.csv",
      nearbyEdgesCsvFilename: "au_pilbara_localities_transit_times.csv",
      farEdgesCsvFilename: "au_pilbara_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_pilbara_bounding_polygon.csv",
      defaultCoords: {lat: -21.782, lng: 118.043},
      defaultZoom: 7
    },
    "au-red-centre": {
      name: "AU Red Centre",
      nodesCsvFilename: "au_red_centre_localities.csv",
      nearbyEdgesCsvFilename: "au_red_centre_localities_transit_times.csv",
      farEdgesCsvFilename: "au_red_centre_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_red_centre_bounding_polygon.csv",
      defaultCoords: {lat: -24.031, lng: 133.187},
      defaultZoom: 7
    },
    "au-tas": {
      name: "AU Tasmania",
      nodesCsvFilename: "au_tas_localities.csv",
      nearbyEdgesCsvFilename: "au_tas_localities_transit_times.csv",
      farEdgesCsvFilename: "au_tas_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_tas_bounding_polygon.csv",
      defaultCoords: {lat: -42.208, lng: 146.492},
      defaultZoom: 8
    },
    "au-west": {
      name: "AU West",
      nodesCsvFilename: "au_west_localities.csv",
      nearbyEdgesCsvFilename: "au_west_localities_transit_times.csv",
      farEdgesCsvFilename: "au_west_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_west_bounding_polygon.csv",
      defaultCoords: {lat: -28.176, lng: 118.081},
      defaultZoom: 6
    },
    "au-west-kimberley": {
      name: "AU West Kimberley",
      nodesCsvFilename: "au_west_kimberley_localities.csv",
      nearbyEdgesCsvFilename: "au_west_kimberley_localities_transit_times.csv",
      farEdgesCsvFilename: "au_west_kimberley_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_west_kimberley_bounding_polygon.csv",
      defaultCoords: {lat: -17.958, lng: 122.245},
      defaultZoom: 7
    },
    "europe": {
      name: "Europe",
      nodesCsvFilename: "europe_localities.csv",
      nearbyEdgesCsvFilename: "europe_localities_transit_times.csv",
      farEdgesCsvFilename: "europe_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "europe_bounding_polygon.csv",
      defaultCoords: {lat: 48.546, lng: 15.688},
      defaultZoom: 5
    },
    "north-america": {
      name: "North America",
      nodesCsvFilename: "north_america_localities.csv",
      nearbyEdgesCsvFilename: "north_america_localities_transit_times.csv",
      farEdgesCsvFilename: "north_america_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "north_america_bounding_polygon.csv",
      defaultCoords: {lat: 53.49, lng: -101.25},
      defaultZoom: 3
    },
    "nz-north-island": {
      name: "NZ North Island",
      nodesCsvFilename: "nz_north_island_localities.csv",
      nearbyEdgesCsvFilename: "nz_north_island_localities_transit_times.csv",
      farEdgesCsvFilename: "nz_north_island_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "nz_north_island_bounding_polygon.csv",
      defaultCoords: {lat: -38.720, lng: 175.847},
      defaultZoom: 7
    },
    "nz-south-island": {
      name: "NZ South Island",
      nodesCsvFilename: "nz_south_island_localities.csv",
      nearbyEdgesCsvFilename: "nz_south_island_localities_transit_times.csv",
      farEdgesCsvFilename: "nz_south_island_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "nz_south_island_bounding_polygon.csv",
      defaultCoords: {lat: -43.914, lng: 170.431},
      defaultZoom: 7
    },
    "south-america": {
      name: "South America",
      nodesCsvFilename: "south_america_localities.csv",
      nearbyEdgesCsvFilename: "south_america_localities_transit_times.csv",
      farEdgesCsvFilename: "south_america_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "south_america_bounding_polygon.csv",
      defaultCoords: {lat: -26.71, lng: -62.93},
      defaultZoom: 3
    }
  };

  let map = null;
  let nodes = null;
  let nodeLatsLons = null;
  let nodeNames = null;
  let nearbyEdges = null;
  let farEdges = null;
  let boundingPolygon = null;
  let edgeLocalities = null;

  const getCsvUrlPrefix = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const csvUrlPrefix = urlParams.get("csv_url_prefix");

    return csvUrlPrefix || CSV_URL_PREFIX;
  };

  const getEdgePopupText = (totalMinutes, nameA, nameB) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const hourOrHours = hours == 1 ? "hour" : "hours";
    const minuteOrMinutes = minutes == 1 ? "minute" : "minutes";
    const hoursMinutesFormatted = (
      (hours ? `${hours} ${hourOrHours} ` : "") + `${minutes} ${minuteOrMinutes}`
    );

    return (
      `<strong>${nameA} <-> ${nameB}</strong><br>` +
      `Transit time: ${hoursMinutesFormatted}`
    );
  };

  const onToggleNearbyEdgesLinkClick = function(e) {
    if (this.classList.contains("active")) {
      return false;
    }

    this.classList.add("active");
    document.getElementById(TOGGLE_ALL_EDGES_ID).classList.remove("active");

    if (farEdges) {
      farEdges.removeFrom(map);
    }

    return false;
  };

  const onToggleAllEdgesLinkClick = function(e) {
    if (this.classList.contains("active")) {
      return false;
    }

    this.classList.add("active");
    document.getElementById(TOGGLE_NEARBY_EDGES_ID).classList.remove("active");

    if (farEdges) {
      farEdges.addTo(map);
    }

    return false;
  };

  const onToggleBoundingPolygonCheckboxClick = function(e) {
    if (document.getElementById(TOGGLE_BOUNDING_POLYGON_ID).checked) {
      boundingPolygon.addTo(map);
    }
    else {
      boundingPolygon.removeFrom(map);
    }
  };

  const loadBoundingPolygonFromFile = (code, results) => {
    const latLons = [];

    while (results.length) {
      const result = results.pop();
      latLons.push([result.lat, result.lon]);
    }

    if (!boundingPolygon) {
      boundingPolygon = L.layerGroup();
    }

    const polygon = L.polygon(latLons);
    boundingPolygon.addLayer(polygon);

    const toggleNearbyEdgesLink = document.createElement("a");
    toggleNearbyEdgesLink.text = "Nearby edges";
    toggleNearbyEdgesLink.href = "#";
    toggleNearbyEdgesLink.id = TOGGLE_NEARBY_EDGES_ID;
    toggleNearbyEdgesLink.classList.add("button");
    toggleNearbyEdgesLink.classList.add("first");
    toggleNearbyEdgesLink.classList.add("active");
    toggleNearbyEdgesLink.onclick = onToggleNearbyEdgesLinkClick;

    const toggleAllEdgesLink = document.createElement("a");
    toggleAllEdgesLink.text = "All edges";
    toggleAllEdgesLink.href = "#";
    toggleAllEdgesLink.id = TOGGLE_ALL_EDGES_ID;
    toggleAllEdgesLink.classList.add("button");
    toggleAllEdgesLink.classList.add("last");
    toggleAllEdgesLink.onclick = onToggleAllEdgesLinkClick;

    const toggleEdgesWrapper = document.createElement("p");
    toggleEdgesWrapper.appendChild(toggleNearbyEdgesLink);
    toggleEdgesWrapper.appendChild(toggleAllEdgesLink);
    toggleEdgesWrapper.id = TOGGLE_EDGES_WRAPPER_ID;
    document.querySelector(TOGGLE_EDGES_CONTAINER_NAME).appendChild(toggleEdgesWrapper);

    const toggleBoundingPolygonLabel = document.createElement("label");
    toggleBoundingPolygonLabel.id = TOGGLE_BOUNDING_POLYGON_WRAPPER_ID;

    const toggleBoundingPolygonCheckbox = document.createElement("input");
    toggleBoundingPolygonCheckbox.type = "checkbox";
    toggleBoundingPolygonCheckbox.id = TOGGLE_BOUNDING_POLYGON_ID;
    toggleBoundingPolygonLabel.appendChild(toggleBoundingPolygonCheckbox);
    toggleBoundingPolygonLabel.innerHTML += "Show bounding polygon";
    toggleBoundingPolygonLabel.onclick = onToggleBoundingPolygonCheckboxClick;

    document.querySelector(GRAPH_SELECT_CONTAINER_NAME).appendChild(toggleBoundingPolygonLabel);
  };

  const loadBoundingPolygonFromUrl = (code, url) => {
    Papa.parse(
      url,
      {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: 'greedy',
        complete: (results) => {
          if (!results.data.length) {
            console.log('Warning: bounding polygon file is empty, not loading bounding polygon');
            return;
          }

          loadBoundingPolygonFromFile(code, results.data);
        }
      }
    );
  };

  const loadFarEdgesFromFile = (code, results) => {
    while (results.length) {
      const result = results.pop();

      if (!farEdges) {
        farEdges = L.layerGroup();
      }

      const slugA = result.locality_a;
      const slugB = result.locality_b;

      if (!edgeLocalities) {
        edgeLocalities = new Set();
      }

      if (
        !(
          edgeLocalities.has(`${slugA};${slugB}`) ||
          edgeLocalities.has(`${slugB};${slugA}`)
        ) &&
        parseInt(result.transit_time_mins) <= MAX_TRANSIT_TIME_MINS
      ) {
        edgeLocalities.add(`${slugA};${slugB}`);

        const latLonA = nodeLatsLons[slugA];
        const latLonB = nodeLatsLons[slugB];

        const edge = L.polyline([latLonA, latLonB], {color: "gray"});
        edge.bindPopup(
          getEdgePopupText(result.transit_time_mins, nodeNames[slugA], nodeNames[slugB])
        );
        farEdges.addLayer(edge);
      }
    }
  };

  const loadFarEdgesFromUrl = (code, url) => {
    Papa.parse(
      url,
      {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: 'greedy',
        complete: (results) => {
          if (!results.data.length) {
            console.log('Warning: far edges file is empty, not loading far edges');
            return;
          }

          loadFarEdgesFromFile(code, results.data);
        }
      }
    );
  };

  const loadNearbyEdgesFromFile = (code, results) => {
    while (results.length) {
      const result = results.pop();

      if (!nearbyEdges) {
        nearbyEdges = L.layerGroup();
      }

      const slugA = result.locality_a;
      const slugB = result.locality_b;

      if (!edgeLocalities) {
        edgeLocalities = new Set();
      }

      edgeLocalities.add(`${slugA};${slugB}`);

      const latLonA = nodeLatsLons[slugA];
      const latLonB = nodeLatsLons[slugB];

      const edge = L.polyline([latLonA, latLonB]);
      edge.bindPopup(
        getEdgePopupText(result.transit_time_mins, nodeNames[slugA], nodeNames[slugB])
      );
      nearbyEdges.addLayer(edge);
    }

    if (nearbyEdges) {
      nearbyEdges.addTo(map);
    }

    const url = `${getCsvUrlPrefix()}${GRAPH_INFO_MAP[code].farEdgesCsvFilename}`;
    loadFarEdgesFromUrl(code, url);

    const polygonUrl = `${getCsvUrlPrefix()}${GRAPH_INFO_MAP[code].boundingPolygonCsvFilename}`;
    loadBoundingPolygonFromUrl(code, polygonUrl);
  };

  const loadNearbyEdgesFromUrl = (code, url) => {
    Papa.parse(
      url,
      {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: 'greedy',
        complete: (results) => {
          loadNearbyEdgesFromFile(code, results.data);
        }
      }
    );
  };

  const loadNodesFromFile = (code, results) => {
    while (results.length) {
      const result = results.pop();

      if (!nodes) {
        nodes = L.layerGroup();
      }

      if (!nodeLatsLons) {
        nodeLatsLons = {};
      }

      if (!nodeNames) {
        nodeNames = {};
      }

      const slug = result.slug;
      const latLon = {lat: result.lat, lng: result.lon};
      nodeLatsLons[slug] = latLon;
      nodeNames[slug] = result.name;

      const marker = L.marker(latLon);
      marker.bindPopup(
        `<strong>${result.name}</strong><br>` +
        `Area of reference: ${result.area_of_reference}<br>` +
        `Point of reference: ${result.point_of_reference}`
      );
      nodes.addLayer(marker);
    }

    nodes.addTo(map);
    map.setView(GRAPH_INFO_MAP[code].defaultCoords, GRAPH_INFO_MAP[code].defaultZoom);

    const url = `${getCsvUrlPrefix()}${GRAPH_INFO_MAP[code].nearbyEdgesCsvFilename}`;
    loadNearbyEdgesFromUrl(code, url);
  };

  const loadNodesFromUrl = (code, url) => {
    Papa.parse(
      url,
      {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: 'greedy',
        complete: (results) => {
          if (!results.data.length) {
            console.log('Warning: nodes file is empty, not loading nodes');
            return;
          }

          loadNodesFromFile(code, results.data);
        }
      }
    );
  };

  const initMap = (containerId) => {
    map = L.map(containerId).setView(LEAFLET_DEFAULT_COORDS, LEAFLET_DEFAULT_ZOOM);

    const defaultStyle = L.tileLayer(LEAFLET_MAP_URL, {
      attribution: LEAFLET_MAP_ATTRIBUTION,
      maxZoom: LEAFLET_MAX_ZOOM,
      id: LEAFLET_STYLE_ID,
      accessToken: MAPBOX_ACCESS_TOKEN,
      tileSize: 512,
      zoomOffset: -1
    });

    map.addLayer(defaultStyle);
  };

  const onGraphSelectChange = function() {
    if (nodes) {
      nodes.clearLayers();
    }

    if (nodeLatsLons) {
      nodeLatsLons = null;
    }

    if (nodeNames) {
      nodeNames = null;
    }

    if (nearbyEdges) {
      nearbyEdges.clearLayers();
    }

    if (farEdges) {
      farEdges.clearLayers();
    }

    if (boundingPolygon) {
      boundingPolygon.clearLayers();
    }

    if (edgeLocalities) {
      edgeLocalities = null;
    }

    const toggleEdgesWrapper = document.getElementById(TOGGLE_EDGES_WRAPPER_ID);

    if (toggleEdgesWrapper) {
      toggleEdgesWrapper.remove();
    }

    const toggleBoundingPolygonWrapper = document.getElementById(TOGGLE_BOUNDING_POLYGON_WRAPPER_ID);

    if (toggleBoundingPolygonWrapper) {
      toggleBoundingPolygonWrapper.remove();
    }

    if (this.value) {
      const code = this.value;
      const url = `${getCsvUrlPrefix()}${GRAPH_INFO_MAP[code].nodesCsvFilename}`;
      loadNodesFromUrl(code, url);
    }
    else {
      map.setView(LEAFLET_DEFAULT_COORDS, LEAFLET_DEFAULT_ZOOM);
    }
  };

  const initGraphSelect = () => {
    const selectEl = document.createElement("select");
    selectEl.id = GRAPH_SELECT_ID;

    const defaultOptEl = document.createElement("option");
    defaultOptEl.value = "";
    defaultOptEl.text = "Choose a region...";
    selectEl.appendChild(defaultOptEl);

    for (const code of GRAPH_CODES) {
      const optEl = document.createElement("option");
      optEl.value = code;
      optEl.text = GRAPH_INFO_MAP[code].name;
      selectEl.appendChild(optEl);
    }

    selectEl.onchange = onGraphSelectChange;

    const selectWrapperEl = document.createElement("div");
    selectWrapperEl.appendChild(selectEl);

    document.querySelector(GRAPH_SELECT_CONTAINER_NAME).appendChild(selectWrapperEl);
  };

  const init = () => {
    const containerEl = document.getElementById(CONTAINER_ID);
    if (containerEl) {
      initMap(CONTAINER_ID);
      initGraphSelect();
    }
  };

  init();
});
