/**
 * Created by grozzzny on 30.06.2017.
 */
function Map() {

    this.center = [54.70739, 20.507307];
    this.zoom = 14;

    var t = this;

    this.map = null;

    t.editPlacemark = {
        run: function () {

            var placemark = new ymaps.Placemark(t.center, {}, {
                preset: 'islands#blueGovernmentIcon',
                draggable: true
            });

            //Установим событие при окончании перетаскивании метки
            placemark.events.add("dragend", function (e) {
                var coords = this.geometry.getCoordinates();
                t.getValues(coords);
            }, placemark);

            //Добавим метку в коллекцию геообъектов
            t.map.geoObjects.add(placemark);


            var searchControl = new ymaps.control.SearchControl({
                options: {
                    noPlacemark: true,
                    provider: 'yandex#map'
                }
            });
            t.map.controls.add(searchControl);

            searchControl.events.add("resultselect", function (e) {
                var coords = searchControl.getResultsArray()[e.get('index')].geometry.getCoordinates();
                placemark.geometry.setCoordinates(coords);
                t.getValues(coords);
            });

        }
    };

    t.editPolyline = {
        run: function () {

            var polyline = new ymaps.Polyline([
                [54.707390, 20.507307],
                [54.711870, 20.507223]
            ], {}, {
                draggable: true,
                // Цвет с прозрачностью.
                strokeColor: "#00000088",
                // Ширину линии.
                strokeWidth: 6
            });

            polyline.events.add('geometrychange', function (e) {
                var coords = polyline.geometry.getCoordinates();
                t.getValues(coords);
            });

            polyline.events.add('dblclick', function (e) {
                e.stopPropagation();
                if (polyline.editor.state.get('editing')){
                    polyline.editor.stopEditing();
                }else{
                    polyline.editor.startEditing();
                }
            });

            // Добавляем линию на карту.
            t.map.geoObjects.add(polyline);

            var searchControl = new ymaps.control.SearchControl({
                options: {
                    noPlacemark: true,
                    provider: 'yandex#map'
                }
            });
            t.map.controls.add(searchControl);

            searchControl.events.add("resultselect", function (e) {
                var coords = searchControl.getResultsArray()[e.get('index')].geometry.getCoordinates();
                var old_coords = polyline.geometry.getCoordinates();

                var bias_x = coords[0]-old_coords[0][0];
                var bias_y = coords[1]-old_coords[0][1];

                var new_coords = [];
                $.each(old_coords, function () {
                    var x = this[0] + bias_x;
                    var y = this[1] + bias_y;
                    new_coords.push([x, y]);
                });

                polyline.geometry.setCoordinates(new_coords);
            });
        }
    };

    t.editPolygon = {
        run: function () {
            // Создаем многоугольник без вершин.
            var polygon = new ymaps.Polygon([
                [
                    [54.705661, 20.504817],
                    [54.705884, 20.510310],
                    [54.708469, 20.513100],
                    [54.710283, 20.507692],
                    [54.708220, 20.502972],
                ]
            ], {}, {
                draggable: true,
                editorDrawingCursor: "crosshair",
                fillColor: '#ffffff',
                fillOpacity: 0.5,
                strokeColor: '#00000088',
                strokeWidth: 6
            });
            // Добавляем многоугольник на карту.
            t.map.geoObjects.add(polygon);

            polygon.events.add('geometrychange', function (e) {
                var coords = polygon.geometry.getCoordinates()[0];
                t.getValues(coords);
            });

            polygon.events.add('dblclick', function (e) {
                e.stopPropagation();
                if (polygon.editor.state.get('editing')){
                    polygon.editor.stopEditing();
                }else{
                    polygon.editor.startEditing();
                }
            });

            var searchControl = new ymaps.control.SearchControl({
                options: {
                    noPlacemark: true,
                    provider: 'yandex#map'
                }
            });
            t.map.controls.add(searchControl);

            searchControl.events.add("resultselect", function (e) {
                var coords = searchControl.getResultsArray()[e.get('index')].geometry.getCoordinates();
                var old_coords = polygon.geometry.getCoordinates()[0];

                var bias_x = coords[0]-old_coords[0][0];
                var bias_y = coords[1]-old_coords[0][1];

                var new_coords = [];
                $.each(old_coords, function () {
                    var x = this[0] + bias_x;
                    var y = this[1] + bias_y;
                    new_coords.push([x, y]);
                });

                polygon.geometry.setCoordinates([new_coords]);
            });
        }
    };

    t.editRoute = {
        run: function () {
            var multiRoute = new ymaps.multiRouter.MultiRoute({
                // Описание опорных точек мультимаршрута.
                referencePoints: [[54.70739, 20.507307]],
                // Параметры маршрутизации.
                params: {
                    //Тип маршрута
                    routingMode: 'auto',
                    // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
                    results: 2
                }
            },{

                // Внешний вид линии маршрута.
                routeStrokeWidth: 6,
                routeStrokeColor: '#00000088',
                routeActiveStrokeWidth: 6,
                routeActiveStrokeColor: '#00000088',

                // Внешний вид линии пешеходного маршрута.
                routeActivePedestrianSegmentStrokeStyle: "solid",
                routeActivePedestrianSegmentStrokeColor: '#00000088',
            });

            t.map.geoObjects.add(multiRoute);

            // Создаем кнопки.
            var routingModeButton = new ymaps.control.ListBox({
                data: {content: "Тип маршрута"},
                items: [
                    new ymaps.control.ListBoxItem('Пешеходный'),
                    new ymaps.control.ListBoxItem('Автомобильный'),
                    new ymaps.control.ListBoxItem('Транспортный')
                ],
            });
            routingModeButton.get(1).select();

            routingModeButton.get(0).events.add('click', function () {
                routingModeButton.get(1).deselect();
                routingModeButton.get(2).deselect();
                multiRoute.model.setParams({routingMode: 'pedestrian'}, true);
            });
            routingModeButton.get(1).events.add('click', function () {
                routingModeButton.get(0).deselect();
                routingModeButton.get(2).deselect();
                multiRoute.model.setParams({routingMode: 'auto'}, true);
            });
            routingModeButton.get(2).events.add('click', function () {
                routingModeButton.get(0).deselect();
                routingModeButton.get(1).deselect();
                multiRoute.model.setParams({routingMode: 'masstransit'}, true);
            });


            t.map.controls.add(routingModeButton);

            multiRoute.model.events.once("requestsuccess", function () {
                multiRoute.editor.start({
                    addWayPoints: true,
                    removeWayPoints: true
                });
            });


            multiRoute.events.add('update', function (e) {
                var coords = [];
                $.each(multiRoute.model.getAllPoints(), function () {
                    coords.push(this.geometry.getCoordinates());
                });
                t.getValues(coords);
            });

            var searchControl = new ymaps.control.SearchControl({
                options: {
                    noPlacemark: true,
                    provider: 'yandex#map'
                }
            });
            t.map.controls.add(searchControl);

            searchControl.events.add("resultselect", function (e) {
                var coords = searchControl.getResultsArray()[e.get('index')].geometry.getCoordinates();

                var point = multiRoute.model.getAllPoints()[0]
                point.setReferencePoint(coords);

            });
        }
    };

    t.view = {
        placemark: {
            add: function (ob) {
                var sizeIco = (ob.sizeIco) ? 50 * ob.sizeIco : 50;

                var optionPlacemarkIco = {
                    iconLayout: 'default#image',
                    iconImageHref: ob.src,
                    iconImageSize: [sizeIco, sizeIco],
                    iconImageOffset: [-sizeIco/2, -sizeIco]
                };

                var optionPlacemarkIcoDefault = {
                    //blue | darkGreen | red | violet | darkOrange | black | night | brown
                    //yellow | darkBlue | green | pink | orange | gray | lightBlue | olive
                    preset: 'islands#' + ob.icoColor + 'CircleDotIconWithCaption'
                };

                //Если нет иконки, то включить дефолтную иконку
                var option = ob.src == null ? optionPlacemarkIcoDefault : optionPlacemarkIco ;

                var placemark = new ymaps.Placemark(ob.coords, {
                    hintContent: ob.title,
                    balloonContentBody: ob.content,
                    iconCaption: ob.title
                }, option);

                t.map.geoObjects.add(placemark);
            }
        },

        polygon: {
            add: function (ob) {

                var polygon = new ymaps.Polygon([ob.coords], {
                    hintContent: ob.title,
                    balloonContentBody: ob.content
                }, {
                    openEmptyBalloon: true,
                    fillColor: ob.fillColor,
                    strokeColor: ob.strokeColor,
                    fillOpacity: ob.fillOpacity,
                    strokeWidth: ob.strokeWidth
                });

                t.map.geoObjects.add(polygon);
            }
        },

        polyline: {
            add: function (ob) {

                // Создаем ломаную с помощью вспомогательного класса Polyline.
                var polyline = new ymaps.Polyline(ob.coords, {
                    hintContent: ob.title,
                    balloonContentBody: ob.content
                }, {
                    strokeColor: ob.strokeColor,
                    strokeWidth: ob.strokeWidth,
                    strokeOpacity: 1
                });

                t.map.geoObjects.add(polyline);
            }
        },

        route: {
            add: function (ob) {
                var sizeIcoStart = (ob.sizeIcoStart) ? 50 * ob.sizeIcoStart : 50;
                var sizeIcoFinish = (ob.sizeIcoFinish) ? 50 * ob.sizeIcoFinish : 50;

                var multiRoute = new ymaps.multiRouter.MultiRoute({
                    // Описание опорных точек мультимаршрута.
                    referencePoints: ob.coords,
                    // Параметры маршрутизации.
                    params: {
                        //Тип маршрута
                        routingMode: ob.mode,
                        // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
                        results: 2
                    }
                },{
                    wayPointStartIconLayout: "default#image",
                    wayPointStartIconImageHref: ob.srcStart,
                    wayPointStartIconImageSize: [sizeIcoStart, sizeIcoStart],
                    wayPointStartIconImageOffset: [-sizeIcoStart/2, -sizeIcoStart],

                    wayPointFinishIconLayout: "default#image",
                    wayPointFinishIconImageHref: ob.srcFinish,
                    wayPointFinishIconImageSize: [sizeIcoFinish, sizeIcoFinish],
                    wayPointFinishIconImageOffset: [-sizeIcoFinish/2, -sizeIcoFinish],

                    // Внешний вид линии маршрута.
                    routeStrokeWidth: ob.strokeWidth,
                    routeStrokeColor: ob.strokeColor,
                    routeActiveStrokeWidth: ob.strokeWidth,
                    routeActiveStrokeColor: ob.strokeColor,

                    // Внешний вид линии пешеходного маршрута.
                    routeActivePedestrianSegmentStrokeStyle: "solid",
                    routeActivePedestrianSegmentStrokeColor: ob.strokeColor
                });

                /**
                 * Ждем, пока будут загружены данные мультимаршрута и созданы отображения путевых точек.
                 * @see https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/multiRouter.MultiRouteModel-docpage/#event-requestsuccess
                 */
                multiRoute.model.events.once("requestsuccess", function () {
                    var pointStart = multiRoute.getWayPoints().get(0);
                    // Создаем балун у метки второй точки.
                    ymaps.geoObject.addon.balloon.get(pointStart);
                    pointStart.options.set({
                        balloonContentLayout: ymaps.templateLayoutFactory.createClass(ob.contentStart)
                    });

                    var pointFinish = multiRoute.getWayPoints().get(multiRoute.getWayPoints().getLength()-1);
                    // Создаем балун у метки второй точки.
                    ymaps.geoObject.addon.balloon.get(pointFinish);
                    pointFinish.options.set({
                        balloonContentLayout: ymaps.templateLayoutFactory.createClass(ob.contentFinish)
                    });
                });


                t.map.geoObjects.add(multiRoute);
            }
        },

        /**
         * Проверка на наличие переменной с данными о геообъектах
         * @returns {boolean}
         */
        hasData: function () {
            if (typeof dataGeoObjects == 'undefined') {
                console.error('Not defined dataGeoObjects. Please define a variable var dataGeoObjects = {}');
                return false;
            } else {
                return true;
            }
        },

        /**
         * Нанесение объектов геолокаций на карту
         */
        addGeoObjects: function () {
            $.each(dataGeoObjects, function () {
                t.view[this.type].add(this);
            });

            t.setCenter();
        },

        /**
         * Запуск построения карты с геообъектами
         * @returns {boolean}
         */
        run: function () {
            //Проверка на наличие объекта с геоданными
            if (!t.view.hasData()) return false;

            //Нанесение объектов геолокаций на карту
            t.view.addGeoObjects();

        }
    };

    /**
     * Отцентровка карты
     */
    this.setCenter = function (zoom) {

        zoom = zoom ? zoom : t.zoom;

        //Получим область координат нанесенных точек и сцентрируем карту
        var bounds = t.map.geoObjects.getBounds();
        t.map.setBounds(bounds, {
            checkZoomRange: true
        }).then(function(){
            if(t.map.getZoom() > zoom) t.map.setZoom(zoom);
        });
    };

    /**
     * Инициализация карты
     */
    this.init = function (id, scenario) {
        t.map = new ymaps.Map(id, {
            center: this.center,
            zoom: t.zoom,
            controls: ['geolocationControl']
        }, {
            suppressMapOpenBlock: true,
            searchControlProvider: 'yandex#search',
            //Автоматическое слежение за размером контейнера карты
            autoFitToViewport: 'always' //всегда
        });

        //Определение сценария
        t[scenario].run();
    };

    this.getValues = function(data) {console.warn('Callback function not defined')};

    this.destroyMap = function () {
        t.map.destroy();
    };
}