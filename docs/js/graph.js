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
    "au-nsw-far-west",
    "au-pilbara",
    "au-qld-north-west",
    "au-red-centre",
    "au-sa-far-north",
    "au-tas",
    "au-west",
    "au-west-kimberley",
    "cl-norte-de-aysen",
    "cl-sur-de-aysen",
    "emea",
    "jp-okinawa",
    "north-america",
    "nz-north-island",
    "nz-south-island",
    "patagonia-extremo-sur",
    "south-america",
    "tierra-del-fuego"
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
    "au-nsw-far-west": {
      name: "AU NSW Far West",
      nodesCsvFilename: "au_nsw_far_west_localities.csv",
      nearbyEdgesCsvFilename: "au_nsw_far_west_localities_transit_times.csv",
      farEdgesCsvFilename: "au_nsw_far_west_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_nsw_far_west_bounding_polygon.csv",
      defaultCoords: {lat: -31.51, lng: 143.53},
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
    "au-qld-north-west": {
      name: "AU Qld North west",
      nodesCsvFilename: "au_qld_north_west_localities.csv",
      nearbyEdgesCsvFilename: "au_qld_north_west_localities_transit_times.csv",
      farEdgesCsvFilename: "au_qld_north_west_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_qld_north_west_bounding_polygon.csv",
      defaultCoords: {lat: -20.710, lng: 140.449},
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
    "au-sa-far-north": {
      name: "AU SA Far North",
      nodesCsvFilename: "au_sa_far_north_localities.csv",
      nearbyEdgesCsvFilename: "au_sa_far_north_localities_transit_times.csv",
      farEdgesCsvFilename: "au_sa_far_north_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "au_sa_far_north_bounding_polygon.csv",
      defaultCoords: {lat: -28.705, lng: 134.539},
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
    "cl-norte-de-aysen": {
      name: "CL Norte de Aysén",
      nodesCsvFilename: "cl_norte_de_aysen_localities.csv",
      nearbyEdgesCsvFilename: "cl_norte_de_aysen_localities_transit_times.csv",
      farEdgesCsvFilename: "cl_norte_de_aysen_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "cl_norte_de_aysen_bounding_polygon.csv",
      defaultCoords: {lat: -45.487, lng: -72.389},
      defaultZoom: 8
    },
    "cl-sur-de-aysen": {
      name: "CL Sur de Aysén",
      nodesCsvFilename: "cl_sur_de_aysen_localities.csv",
      nearbyEdgesCsvFilename: "cl_sur_de_aysen_localities_transit_times.csv",
      farEdgesCsvFilename: "cl_sur_de_aysen_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "cl_sur_de_aysen_bounding_polygon.csv",
      defaultCoords: {lat: -47.236, lng: -72.614},
      defaultZoom: 8
    },
    "emea": {
      name: "EMEA",
      nodesCsvFilename: "emea_localities.csv",
      nearbyEdgesCsvFilename: "emea_localities_transit_times.csv",
      farEdgesCsvFilename: "emea_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "emea_bounding_polygon.csv",
      defaultCoords: {lat: 48.546, lng: 15.688},
      defaultZoom: 5
    },
    "jp-okinawa": {
      name: "JP Okinawa",
      nodesCsvFilename: "jp_okinawa_localities.csv",
      nearbyEdgesCsvFilename: "jp_okinawa_localities_transit_times.csv",
      farEdgesCsvFilename: "jp_okinawa_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "jp_okinawa_bounding_polygon.csv",
      defaultCoords: {lat: 26.4724, lng: 127.9193},
      defaultZoom: 10
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
    "patagonia-extremo-sur": {
      name: "Patagonia Extremo Sur",
      nodesCsvFilename: "patagonia_extremo_sur_localities.csv",
      nearbyEdgesCsvFilename: "patagonia_extremo_sur_localities_transit_times.csv",
      farEdgesCsvFilename: "patagonia_extremo_sur_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "patagonia_extremo_sur_bounding_polygon.csv",
      defaultCoords: {lat: -51.456, lng: -71.406},
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
    },
    "tierra-del-fuego": {
      name: "Tierra del Fuego",
      nodesCsvFilename: "tierra_del_fuego_localities.csv",
      nearbyEdgesCsvFilename: "tierra_del_fuego_localities_transit_times.csv",
      farEdgesCsvFilename: "tierra_del_fuego_localities_transit_times_floyd_warshall_generated.csv",
      boundingPolygonCsvFilename: "tierra_del_fuego_bounding_polygon.csv",
      defaultCoords: {lat: -54.151, lng: -68.599},
      defaultZoom: 7
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

  const loadBoundingPolygonFromFile = (codes, results) => {
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

    if (!document.getElementById(TOGGLE_EDGES_WRAPPER_ID)) {
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
    }

    if (!document.getElementById(TOGGLE_BOUNDING_POLYGON_WRAPPER_ID)) {
      const toggleBoundingPolygonLabel = document.createElement("label");
      toggleBoundingPolygonLabel.id = TOGGLE_BOUNDING_POLYGON_WRAPPER_ID;

      const toggleBoundingPolygonCheckbox = document.createElement("input");
      toggleBoundingPolygonCheckbox.type = "checkbox";
      toggleBoundingPolygonCheckbox.id = TOGGLE_BOUNDING_POLYGON_ID;
      toggleBoundingPolygonLabel.appendChild(toggleBoundingPolygonCheckbox);
      toggleBoundingPolygonLabel.innerHTML += "Show bounding polygon(s)";
      toggleBoundingPolygonLabel.onclick = onToggleBoundingPolygonCheckboxClick;

      document.querySelector(GRAPH_SELECT_CONTAINER_NAME).appendChild(toggleBoundingPolygonLabel);
    }

    if (codes.length > 1) {
      loadNodesFromUrl(codes.slice(1));
    }
  };

  const loadBoundingPolygonFromUrl = (codes) => {
    Papa.parse(
      `${getCsvUrlPrefix()}${GRAPH_INFO_MAP[codes[0]].boundingPolygonCsvFilename}`,
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

          loadBoundingPolygonFromFile(codes, results.data);
        }
      }
    );
  };

  const loadFarEdgesFromFile = (results) => {
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

  const loadFarEdgesFromUrl = (codes) => {
    Papa.parse(
      `${getCsvUrlPrefix()}${GRAPH_INFO_MAP[codes[0]].farEdgesCsvFilename}`,
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

          loadFarEdgesFromFile(results.data);
        }
      }
    );
  };

  const loadNearbyEdgesFromFile = (codes, results) => {
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

    loadFarEdgesFromUrl(codes);

    loadBoundingPolygonFromUrl(codes);
  };

  const loadNearbyEdgesFromUrl = (codes) => {
    Papa.parse(
      `${getCsvUrlPrefix()}${GRAPH_INFO_MAP[codes[0]].nearbyEdgesCsvFilename}`,
      {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: 'greedy',
        complete: (results) => {
          loadNearbyEdgesFromFile(codes, results.data);
        }
      }
    );
  };

  const loadNodesFromFile = (codes, results) => {
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
        `<strong>${result.name}</strong>` +
        (result.name_romanized ? ` <strong>(${result.name_romanized})</strong>` : '') +
        '<br>' +
        `Area of reference: ${result.area_of_reference}` +
        (result.area_of_reference_romanized ? ` (${result.area_of_reference_romanized})` : '') +
        '<br>' +
        `Point of reference: ${result.point_of_reference}` +
        (result.point_of_reference_romanized ? ` (${result.point_of_reference_romanized})` : '')
      );
      nodes.addLayer(marker);
    }

    nodes.addTo(map);
    map.setView(GRAPH_INFO_MAP[codes[0]].defaultCoords, GRAPH_INFO_MAP[codes[0]].defaultZoom);

    loadNearbyEdgesFromUrl(codes);
  };

  const loadNodesFromUrl = (codes) => {
    Papa.parse(
      `${getCsvUrlPrefix()}${GRAPH_INFO_MAP[codes[0]].nodesCsvFilename}`,
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

          loadNodesFromFile(codes, results.data);
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
      boundingPolygon.clearLayers().removeFrom(map);
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

    if (this.selectedOptions) {
      const codes = Array.from(this.selectedOptions).map(({ value }) => value);
      loadNodesFromUrl(codes);
    }
    else {
      map.setView(LEAFLET_DEFAULT_COORDS, LEAFLET_DEFAULT_ZOOM);
    }
  };

  const initGraphSelect = () => {
    const selectEl = document.createElement("select");
    selectEl.setAttribute("multiple", "");
    selectEl.id = GRAPH_SELECT_ID;

    const defaultOptEl = document.createElement("option");
    defaultOptEl.value = "";
    defaultOptEl.text = "Choose region(s)...";
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
