mapboxgl.accessToken = mapToken;

// Convert allCampgrounds to GeoJSON with safe properties
const geojson = {
  type: 'FeatureCollection',
  features: allCampgrounds.map(cg => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [cg.geometry.coordinates[0], cg.geometry.coordinates[1]]
    },
    properties: {
      title: cg.title ? String(cg.title) : 'No title',
      description: cg.description ? String(cg.description) : '',
      location: cg.location ? String(cg.location) : '',
      id: cg._id ? String(cg._id) : ''
    }
  }))
};

// Initialize the map
const map = new mapboxgl.Map({
  container: 'cluster-map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [0, 0], // temporary center, will fit bounds
  zoom: 2
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {
  map.addSource('campgrounds', {
    type: 'geojson',
    data: geojson,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 40
  });

  // Cluster circles
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#F7B267',
        10,
        '#F4845F',
        50,
        '#F25C54'
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        10,
        30,
        50,
        40
      ]
    }
  });

  // Cluster count labels
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'campgrounds',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  });

  // Individual points
  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'campgrounds',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 6,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  });

  // Zoom in when clicking a cluster
  map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('campgrounds').getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
      });
    });
  });

  // Popup for unclustered points
  map.on('click', 'unclustered-point', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const { title, description, location, id } = e.features[0].properties;
    map.easeTo({
      center: coordinates,
      zoom: 14, 
      duration: 3000
    });
    const popupContent = `
      <strong>${title}</strong><br>
      <small>${location}</small><br>
      <a href="/campgrounds/${id}">View Details</a>
    `;

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(map);
  });

  // Cursor pointer effects
  ['clusters', 'unclustered-point'].forEach(layer => {
    map.on('mouseenter', layer, () => map.getCanvas().style.cursor = 'pointer');
    map.on('mouseleave', layer, () => map.getCanvas().style.cursor = '');
  });

  // Auto-zoom and center to fit all campgrounds
  if (geojson.features.length > 0) {
    const bounds = new mapboxgl.LngLatBounds();
    geojson.features.forEach(f => bounds.extend(f.geometry.coordinates));
    map.fitBounds(bounds, { padding: 60 });
  }
});
