# world-locality-transit-graph

A map of approximate transit times between any two given localities in various parts of
the world.

See the [World Locality Transit Graph](https://jaza.github.io/world-locality-transit-graph/)
in action.

Built as a static site, using [Leaflet](https://leafletjs.com/) as the map engine,
[OpenStreetMap](https://www.openstreetmap.org/) for map data, and
[Mapbox](https://www.mapbox.com/) for map tiles. Graph nodes and edges are stored in
CSV files in the `csv/` directory of this repo.

## GitHub Pages

The live site is deployed on [GitHub Pages](https://pages.github.com/).

## Previewing locally

By default, the CSV files are fetched from GitHub. But they can be made to fetch locally
using the `csv_url_prefix` URL param.

Run a simple local webserver such as [Serve](https://github.com/vercel/serve), e.g. in
one shell, run:

    cd /path/to/world-locality-transit-graph/docs
    npx serve -l 8000

And in another shell, run:

    cd /path/to/world-locality-transit-graph/csv
    npx serve -l 9000 --cors

Then, in a browser, access this URL:

    http://localhost:8000/?csv_url_prefix=http://localhost:9000/

You should see the map rendered.
