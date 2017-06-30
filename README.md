##Конструктор карты яндекс

```html
<section>
  <div class="map" id="map" ontouchmove="event.stopPropagation();"></div>

  <script>
      var dataGeoObjects = [
          {
              type: 'placemark',
              coords: [54.718504, 20.509194],
              //src: null,
              src: '/images/location-14-512.png',
              icoColor: 'darkGreen', //blue | darkGreen | red | violet | darkOrange | black | night | brown | yellow | darkBlue | green | pink | orange | gray | lightBlue | olive
              sizeIco: 1,
              title: 'Новая метка',
              content: 'Контент новой метки HTML'
          },
          {
              type: 'polygon',
              coords: [
                  [54.719444, 20.505435],
                  [54.719891, 20.508139],
                  [54.716376, 20.509555],
                  [54.715898, 20.505896]
              ],
              title: 'Полигон',
              content: 'Контент полигона HTML',
              fillColor: '#ff0600',
              strokeColor: '#5b0003',
              strokeWidth: 1,
              fillOpacity: '0.1'
          },
          {
              type: 'polyline',
              coords: [
                  [54.716407, 20.509812],
                  [54.716948, 20.512902],
                  [54.717985, 20.512859],
                  [54.720398, 20.514133]
              ],
              title: 'Ломанная',
              content: 'Контент ломанной <b>HTML</b>',
              strokeWidth: 2,
              strokeColor: '#002eb8'
          },
          {
              type: 'route',
              mode: 'auto', //masstransit | pedestrian | auto
              coords: [
                  [54.715547, 20.513425],
                  [54.715920, 20.505893]
              ],
              contentStart: 'Контент маршрута в точке START <i>HTML</i>',
              srcStart: '/images/20151120224636875.png',
              sizeIcoStart: 5,

              contentFinish: 'Контент маршрута в точке FINISH <i>HTML</i>',
              srcFinish: '/images/2015923223658445.png',
              sizeIcoFinish: 1,

              strokeWidth: 20,
              strokeColor: '#002eb8'
          },
      ];

      var my_map = new Map;

      //Инициализация карты
      ymaps.ready(function () {
          // view | editRoute | editPolyline | editPolygon | editPlacemark
          my_map.init('map', 'view');
          my_map.getValues = function (data) {console.log(data);};
      });

      function selectMap (ob) {
          my_map.destroyMap();
          my_map.init('map', $(ob).val());
          my_map.getValues = function (data) {console.log(data);};
      }
  </script>

  <select class="form-control" style="position: absolute; width: 200px; max-width: 100%; top: 115px; right: 10px; " onchange="selectMap(this);">
      <option value="view">Просмотр всех точек</option>
      <option value="editRoute">Добавить маршрут</option>
      <option value="editPolyline">Добавить ломанную линию</option>
      <option value="editPolygon">Добавить полигон</option>
      <option value="editPlacemark">Добавить точку</option>
  </select>

</section>
```