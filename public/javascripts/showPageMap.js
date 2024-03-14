

const goodPlace = place;
// const goodCampground = campground;

  mapboxgl.accessToken =mapToken;
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: goodPlace.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
  });

  map.addControl(new mapboxgl.NavigationControl());

  new mapboxgl.Marker()
  .setLngLat(goodPlace.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
                .setHTML(
                    `<h3>${goodPlace.title}</h3><p>${goodPlace.location}</p>`
                )
  )
  .addTo(map);
 