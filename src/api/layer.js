//点位相关
import * as L from 'leaflet'
import "leaflet/dist/leaflet.css";
import "../api/leaflet_markercluster/leaflet.markercluster-src.js";
import "../api/leaflet_markercluster/MarkerCluster.css"
import "../api/leaflet_markercluster/MarkerCluster.Default.css"
/**
* 生成点位背景
* @param {Object} data 点位数据对象
* @param {string} type 点位背景的类型 off：默认；on：选中态；none：无背景
* @returns {Object} icon对象
*/
function create_icon_options(data, type = "off") {
    let options = {
        className: `mark-${data.data.id}`,
        iconUrl: data.data.icon,
        shadowUrl: `https://assets.yuanshen.site/icons/loc_02_${type}.png`,
        iconSize: [22, 22], // size of the icon
        shadowSize: [32, 36], // size of the shadow
        iconAnchor: [11, 30], // point of the icon which will correspond to marker's location
        shadowAnchor: [16, 35], // the same for the shadow
        popupAnchor: [0, -35], // point from which the popup should open relative to the iconAnchor
    };
    if (type == 'none') {
        options = {
            ...options,
            iconSize: [22, 22], // size of the icon
            iconAnchor: [11, 11], // point of the icon which will correspond to marker's location
            popupAnchor: [0, -22], // point from which the popup should open relative to the iconAnchor
        }
    }
    return options
}
/**
* 将获取的点位组信息转化成leaflet的geojson对象
* @param {Object} data 点位组对象信息
* @returns {Object} geojson对象
*/
function create_geojson(data) {
    let item_list = [
        {
            type: "FeatureCollection",
            features: [],
        },
    ];
    for (let i of data) {
        item_list[0].features.push({
            geometry: {
                type: "Point",
                coordinates: i.position.split(","),
            },
            type: "Feature",
            properties: {
                popTitle: i.title,
                popupContent: i.content,
            },
            data: {
                ...i
            }
        });
    }
    return item_list
}
/**
* 生成点位组
* @param {array} layergroup_data  要生成点位的点位组对象数组
* @param {Object} map map实例对象
* @returns {Object} markerClusterGroup对象（聚合后的点位组）
 */
function layergroup_register(layergroup_data, map) {
    let select_Layer = L.layerGroup(map);
    //生成点位
    L.geoJSON(layergroup_data, {
        pointToLayer: function (feature, latlng) {
            let marker = L.marker([latlng.lng, latlng.lat], {
                icon: L.icon(create_icon_options(feature))
            });
            return marker.addTo(select_Layer)
        },
    });
    return select_Layer
}
export {
    create_icon_options,
    create_geojson,
    layergroup_register,
}