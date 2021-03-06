/**
 * @file 船舶-航标
 */

import CesiumCtl from '@map/Model/CesiumCtl'
import Entites from '@map/Model/Entites'

let entites = new Entites ( {
    detail: '船舶-航标.',
    opt: {
        billboardOpt: {
            image: '/static/img/large-screen/navigation.png',
            width: Entites.scaleW * 32,
            height: Entites.scaleH * 32,
            ...Entites.billboardOpt,
        }
    }
} )

let position = {
    "lng": "113.92013547683357",
    "lat": "22.480926047508664",
    "height": "-0.34529696783119174"
}

CesiumCtl.promise.then( () => {
    entites.add( new Cesium.Entity( {
        billboard: entites.opt.billboardOpt,
        position: Cesium.Cartesian3.fromDegrees(
            +position.lng,
            +position.lat,
            +position.height + 1
        )
    } ), true )
} )

export default entites
