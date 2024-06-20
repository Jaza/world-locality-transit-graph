ready(() => {
  const CONTAINER_ID = "graph";
  const GRAPH_SELECT_CONTAINER_NAME = "header";
  const TOGGLE_EDGES_CONTAINER_NAME = "footer";
  const TOGGLE_EDGES_WRAPPER_ID = "toggle-edges-wrapper";
  const TOGGLE_NEARBY_EDGES_ID = "toggle-nearby-edges";
  const TOGGLE_ALL_EDGES_ID = "toggle-all-edges";
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
    "au-east",
    "au-west",
    "au-north-west",
    "au-north",
    "au-tas",
    "nz-north-island"
  ];

  const GRAPH_INFO_MAP = {
    "au-east": {
      name: "AU East",
      nodesCsvFilename: "au_east_localities.csv",
      nearbyEdgesCsvFilename: "au_east_localities_transit_times.csv",
      farEdgesCsvFilename: "au_east_localities_transit_times_floyd_warshall_generated.csv",
      defaultCoords: {lat: -28.009906, lng: 145.4592851},
      defaultZoom: 5
    },
    "au-west": {
      name: "AU West",
      nodesCsvFilename: "au_west_localities.csv",
      nearbyEdgesCsvFilename: "au_west_localities_transit_times.csv",
      farEdgesCsvFilename: "au_west_localities_transit_times_floyd_warshall_generated.csv",
      defaultCoords: {lat: -28.176, lng: 118.081},
      defaultZoom: 6
    },
    "au-north-west": {
      name: "AU North West",
      nodesCsvFilename: "au_north_west_localities.csv",
      nearbyEdgesCsvFilename: "au_north_west_localities_transit_times.csv",
      farEdgesCsvFilename: "au_north_west_localities_transit_times_floyd_warshall_generated.csv",
      defaultCoords: {lat: -17.958, lng: 122.245},
      defaultZoom: 7
    },
    "au-north": {
      name: "AU North",
      nodesCsvFilename: "au_north_localities.csv",
      nearbyEdgesCsvFilename: "au_north_localities_transit_times.csv",
      farEdgesCsvFilename: "au_north_localities_transit_times_floyd_warshall_generated.csv",
      defaultCoords: {lat: -18.854, lng: 132.891},
      defaultZoom: 6
    },
    "au-tas": {
      name: "AU Tasmania",
      nodesCsvFilename: "au_tas_localities.csv",
      nearbyEdgesCsvFilename: "au_tas_localities_transit_times.csv",
      farEdgesCsvFilename: "au_tas_localities_transit_times_floyd_warshall_generated.csv",
      defaultCoords: {lat: -42.208, lng: 146.492},
      defaultZoom: 8
    },
    "nz-north-island": {
      name: "NZ North Island",
      nodesCsvFilename: "nz_north_island_localities.csv",
      nearbyEdgesCsvFilename: "nz_north_island_localities_transit_times.csv",
      farEdgesCsvFilename: "nz_north_island_localities_transit_times_floyd_warshall_generated.csv",
      defaultCoords: {lat: -38.720, lng: 175.847},
      defaultZoom: 7
    }
  };

  let map = null;
  let nodes = null;
  let nodeLatsLons = null;
  let nodeNames = null;
  let nearbyEdges = null;
  let farEdges = null;
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

    farEdges.removeFrom(map);

    return false;
  };

  const onToggleAllEdgesLinkClick = function(e) {
    if (this.classList.contains("active")) {
      return false;
    }

    this.classList.add("active");
    document.getElementById(TOGGLE_NEARBY_EDGES_ID).classList.remove("active");

    farEdges.addTo(map);

    return false;
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

    nearbyEdges.addTo(map);

    const url = `${getCsvUrlPrefix()}${GRAPH_INFO_MAP[code].farEdgesCsvFilename}`;
    loadFarEdgesFromUrl(code, url);
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
          if (!results.data.length) {
            console.log('Warning: nearby edges file is empty, not loading nearby edges');
            return;
          }

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

    if (edgeLocalities) {
      edgeLocalities = null;
    }

    const toggleEdgesWrapper = document.getElementById(TOGGLE_EDGES_WRAPPER_ID);

    if (toggleEdgesWrapper) {
      toggleEdgesWrapper.remove();
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
    selectWrapperEl.appendChild(selectEl)

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
