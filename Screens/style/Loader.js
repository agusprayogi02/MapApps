import Geolocation from 'react-native-geolocation-service'
import React, { Component } from 'react'

class Fire extends Component {

    constructor(props) {
        super(props)
        this.state = {
            coordinate: null
        }
    }

    currentLoc = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                var lat = position.coords.latitude
                var lon = position.coords.longitude
                var coordinate = {
                    lat, lon
                }
                this.setState({ coordinate })
            }
        )
    }
}

const fire = new Fire();
export default fire