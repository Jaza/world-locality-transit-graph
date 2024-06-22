# world-locality-transit-graph

A map of approximate transit times between any two given localities in various parts of
the world.

See the [World Locality Transit Graph](https://jaza.github.io/world-locality-transit-graph/)
in action.

## About the graph

A "locality", for the purposes of this graph, is:

- In a large metropolitan area: a group of neighbourhoods / suburbs, e.g. "inner city",
  "southern suburbs"; such a locality should (as a rough guide) be 15-30 minutes transit
  time from its adjacent metropolitan localities
- In a (small urban area or) semi-rural area: the whole main town / city, and usually
  also neighbouring towns / countryside, e.g. "foobar valley", "fizzbuzz peninsula";
  such a locality should (as a rough guide) be 1-2 hours transit time from its adjacent
  semi-rural localities
- In a remote rural area: all of the towns / countryside within a large area, e.g.
  "far north", "highlands"; such a locality should (as a rough guide) be 3-5 hours
  transit time from all adjacent localities

Additionally, regardless of whether it's big-city or middle-of-nowhere:

- Someone who lives in one locality, should consider anyone living in the same locality
  as being "in my area" (folks in a city of several million people have quite a
  different definition of "in my area", compared to folks whose next-door neighbour is
  over the horizon!)
- Each locality should have its own identity, both geographical and cultural; a person
  who lives in a locality should feel some connection (could be positive or negative!)
  to their locality's identity

Each locality is represented as a node in the graph. Two localities should be connected
as "nearby edges" (i.e. there should be an edge connecting their nodes in the graph) if
and only if:

- They are geographically adjacent
- It's possible to travel between them using one or more spontaneous transport modes,
  e.g. private car, some trains / buses / ferries, walking, bicycle, taxi (**not**
  non-spontaneous transport, i.e. not transport that has to be booked in advance, that
  may have infrequent service, and that may not be available 24/7, e.g. flights, some
  trains / buses / ferries)
- Travel between them using the fastest available spontaneous transport mode is no more
  than approximately 5 hours (under ideal conditions, i.e. very low traffic, no adverse
  weather, no roadwork / trackwork)

There is also an edge for every single possible pair of localities (in each connected
graph), with a transit time of up to 5.5 hours, which can be seen in the "all edges" map
view. These edges are calculated and generated in advance, using the
[Floyd-Warshall CSV Generator](https://github.com/Jaza/floyd-warshall-csv-generator).

Due to the "5-hour max transit time" rule, and due to the "only spontaneous transport
modes" rule, it's actually multiple graphs, not just one graph. This is because there
is often no way to travel between two localities while adhering to those rules,
usually due to a body of water being in the way, but sometimes due to a land route
being extremely long and desolate (e.g. crossing the Nullarbor Plain between South
Australia and Western Australia takes at least 12 hours of non-stop driving).

Why these rules? Because, being a "transit graph", the idea is that it only models
"local" travel, i.e. travel that someone would undertake with little or no notice,
at little or no financial cost, ideally (for metropolitan localities) local enough that
one could still make it back home for the night, or (for rural and semi-rural
localities) at least local enough that one could easily complete the journey one-way in
a single day.

So, the aim of this graph is to model, for each locality, all of the other nearby
localities that are "close enough", in terms of transit time, for casual travel -
perhaps to catch up with friends / family, perhaps for local tourism, perhaps for
shopping - to be feasible on a regular basis.

Built as a static site, using [Leaflet](https://leafletjs.com/) as the map engine,
[OpenStreetMap](https://www.openstreetmap.org/) for map data, and
[Mapbox](https://www.mapbox.com/) for map tiles. Graph nodes and edges are stored in
CSV files in the `csv/` directory of this repo.

So far, there is only data for Australia and New Zealand. More world regions coming soon.

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
