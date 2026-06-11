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
  const FLAG_EMOJI_ENGLAND = "\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f";
  const FLAG_EMOJI_SCOTLAND = "\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f";
  const FLAG_EMOJI_WALES = "\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f";
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
  const REGIONS_CSV_FILENAME = "regions.csv";

  const MAX_TRANSIT_TIME_MINS = 330;

  let regionSlugs = null;
  let regionInfoMap = null;
  let map = null;
  let nodes = null;
  let nodeLatsLons = null;
  let nodeNames = null;
  let nearbyEdges = null;
  let farEdges = null;
  let boundingPolygon = null;
  let edgeLocalities = null;

  // Thanks to: https://dev.to/jorik/country-code-to-flag-emoji-a21
  const getFlagEmoji = (countryCode) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const replaceCountryCodesWithFlagEmojis = (name) => {
    if (name.startsWith("GB-ENG: ")) {
      return `${getFlagEmoji("GB")} ${FLAG_EMOJI_ENGLAND} ${name.replace("GB-ENG: ", "")}`;
    }

    if (name.startsWith("GB-SCT: ")) {
      return `${getFlagEmoji("GB")} ${FLAG_EMOJI_SCOTLAND} ${name.replace("GB-SCT: ", "")}`;
    }

    if (name.startsWith("GB-WLS: ")) {
      return `${getFlagEmoji("GB")} ${FLAG_EMOJI_WALES} ${name.replace("GB-WLS: ", "")}`;
    }

    if (name.startsWith("GB-CYM: ")) {
      return `${getFlagEmoji("GB")} ${FLAG_EMOJI_WALES} ${name.replace("GB-CYM: ", "")}`;
    }

    if (!/^[A-Z]{2}(\-[A-Z]{2})*\: .+$/.test(name)) {
      return name;
    }

    const nameParts = name.split(": ");
    const countryCodes = nameParts[0].split("-");
    const flagEmojis = countryCodes.map(getFlagEmoji);
    return `${flagEmojis.join(" ")} ${nameParts.slice(1).join(": ")}`;
  };

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
      `<strong>${replaceCountryCodesWithFlagEmojis(nameA)} <span style="font-size: 1.4em">&harr;</span> ${replaceCountryCodesWithFlagEmojis(nameB)}</strong><br>` +
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
      `${getCsvUrlPrefix()}${regionInfoMap[codes[0]].boundingPolygonCsvFilename}`,
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
      `${getCsvUrlPrefix()}${regionInfoMap[codes[0]].farEdgesCsvFilename}`,
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
      `${getCsvUrlPrefix()}${regionInfoMap[codes[0]].nearbyEdgesCsvFilename}`,
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
        '<strong>' +
        '<span' +
        (
          result.name_lang && result.name_variation1
            ? ` title="Language: ${result.name_lang}"`
            : ''
        ) +
        '>' +
        `${replaceCountryCodesWithFlagEmojis(result.name)}` +
        '</span>' +
        (
          result.name_variation1
            ? (
              ' &ndash; ' +
              '<span' +
              (result.name_variation1_lang ? ` title="Language: ${result.name_variation1_lang}"` : '') +
              '>' +
              `${replaceCountryCodesWithFlagEmojis(result.name_variation1)}` +
              '</span>'
            )
            : ''
        ) +
        (
          result.name_variation2
            ? (
              ' &ndash; ' +
              '<span' +
              (result.name_variation2_lang ? ` title="Language: ${result.name_variation2_lang}"` : '') +
              '>' +
              `${replaceCountryCodesWithFlagEmojis(result.name_variation2)}` +
              '</span>'
            )
            : ''
        ) +
        '</strong>' +
        '<br>' +
        'Area of reference: ' +
        '<span' +
        (
          result.area_of_reference_lang && result.area_of_reference_variation1
            ? ` title="Language: ${result.area_of_reference_lang}"`
            : ''
        ) +
        '>' +
        `${result.area_of_reference}` +
        '</span>' +
        (
          result.area_of_reference_variation1
            ? (
              ' &ndash; ' +
              '<span' +
              (result.area_of_reference_variation1_lang ? ` title="Language: ${result.area_of_reference_variation1_lang}"` : '') +
              '>' +
              `${result.area_of_reference_variation1}` +
              '</span>'
            )
            : ''
        ) +
        (
          result.area_of_reference_variation2
            ? (
              ' &ndash; ' +
              '<span' +
              (result.area_of_reference_variation2_lang ? ` title="Language: ${result.area_of_reference_variation2_lang}"` : '') +
              '>' +
              `${result.area_of_reference_variation2}` +
              '</span>'
            )
            : ''
        ) +
        '<br>' +
        'Point of reference: ' +
        (result.point_of_reference_url ? `<a href="${result.point_of_reference_url}">` : '') +
        '<span' +
        (
          result.point_of_reference_lang && result.point_of_reference_variation1
            ? ` title="Language: ${result.point_of_reference_lang}"`
            : ''
        ) +
        '>' +
        `${result.point_of_reference}` +
        '</span>' +
        (result.point_of_reference_url ? '</a>' : '') +
        (
          result.point_of_reference_variation1
            ? (
              ' &ndash; ' +
              '<span' +
              (result.point_of_reference_variation1_lang ? ` title="Language: ${result.point_of_reference_variation1_lang}"` : '') +
              '>' +
              `${result.point_of_reference_variation1}` +
              '</span>'
            )
            : ''
        ) +
        (
          result.point_of_reference_variation2
            ? (
              ' &ndash; ' +
              '<span' +
              (result.point_of_reference_variation2_lang ? ` title="Language: ${result.point_of_reference_variation2_lang}"` : '') +
              '>' +
              `${result.point_of_reference_variation2}` +
              '</span>'
            )
            : ''
        )
      );
      nodes.addLayer(marker);
    }

    nodes.addTo(map);
    map.setView(regionInfoMap[codes[0]].defaultCoords, regionInfoMap[codes[0]].defaultZoom);

    loadNearbyEdgesFromUrl(codes);
  };

  const loadNodesFromUrl = (codes) => {
    Papa.parse(
      `${getCsvUrlPrefix()}${regionInfoMap[codes[0]].nodesCsvFilename}`,
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

  const loadRegionsFromFile = (results) => {
    if (!regionSlugs) {
      regionSlugs = [];
    }

    if (!regionInfoMap) {
      regionInfoMap = {};
    }

    const selectEl = document.createElement("select");
    selectEl.setAttribute("multiple", "");
    selectEl.id = GRAPH_SELECT_ID;

    const defaultOptEl = document.createElement("option");
    defaultOptEl.value = "";
    defaultOptEl.text = "Choose region(s)...";
    selectEl.appendChild(defaultOptEl);

    while (results.length) {
      const result = results.pop();

      const slug = result.slug;
      const slugUnderscored = slug.replaceAll("-", "_");
      const name = result.name;

      regionSlugs.push(slug);

      regionInfoMap[slug] = {
        name,
        nodesCsvFilename: `${slugUnderscored}_localities.csv`,
        nearbyEdgesCsvFilename: `${slugUnderscored}_localities_transit_times.csv`,
        farEdgesCsvFilename: `${slugUnderscored}_localities_transit_times_floyd_warshall_generated.csv`,
        boundingPolygonCsvFilename: `${slugUnderscored}_bounding_polygon.csv`,
        defaultCoords: {lat: parseFloat(result.lat), lng: parseFloat(result.lon)},
        defaultZoom: parseInt(result.zoom)
      };
    }

    regionSlugs.sort();

    regionSlugs.forEach((slug) => {
      const optEl = document.createElement("option");
      optEl.value = slug;
      optEl.text = regionInfoMap[slug].name;
      selectEl.appendChild(optEl);
    });

    selectEl.onchange = onGraphSelectChange;

    const selectWrapperEl = document.createElement("div");
    selectWrapperEl.appendChild(selectEl);

    document.querySelector(GRAPH_SELECT_CONTAINER_NAME).appendChild(selectWrapperEl);
  };

  const loadRegionsFromUrl = () => {
    Papa.parse(
      `${getCsvUrlPrefix()}${REGIONS_CSV_FILENAME}`,
      {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: 'greedy',
        complete: (results) => {
          if (!results.data.length) {
            console.log('Warning: regions file is empty, not loading regions');
            return;
          }

          loadRegionsFromFile(results.data);
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

  const init = () => {
    const containerEl = document.getElementById(CONTAINER_ID);
    if (containerEl) {
      initMap(CONTAINER_ID);
      loadRegionsFromUrl();
    }
  };

  init();
});
