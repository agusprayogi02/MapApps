import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, Image
} from 'react-native';
import Prompt from 'react-native-simple-prompt';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'rn-fetch-blob';
import RNFileSelector from 'react-native-file-selector';
import * as firebase from 'firebase';
import MapView, {
    PROVIDER_GOOGLE,
    Marker,
    Polyline,
    ProviderPropType,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service'
import PriceMarker from './Map/PriceMarker'
import { getDistance } from 'geolib'
import { Costum } from "./Map/Map";
import icon from './assets/icon.png'
import Sqlite from "./database/SQLite"
import IOSIcon from 'react-native-vector-icons/Ionicons'

const { width, height } = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const center = 40
const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT
const LATITUDE_DELTA = 0.0022
const LONGITUDE_DELTA = 0.0020
let id = 0;
const db = new Sqlite()
// const LONGITUDE_DELTA = 0.035
const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};

function randomColor() {
    return `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, 0)}`;
    // return 'rgb(' + (Math.floor(Math.random() * 256)) + ', ' + (Math.floor(Math.random() * 256)) + ', ' + (Math.floor(Math.random() * 256)) + ')'
}

function log(eventName, e) {
    console.log(eventName, e.nativeEvent);
}

class HomeScreen extends React.Component {
    static navigationOptions = {
        headerLeft: () => (
            <View style={{ marginLeft: 8 }}>
                <Button
                    onPress={() => {
                        // db.init().transaction(function (txn) {
                        //     txn.executeSql("SELECT * FROM `kondisi` where id=1", [], function (tx, res) {
                        //         for (let i = 0; i < res.rows.length; ++i) {
                        //             console.log("P:", res.rows.item(i));
                        //             var xx = res.rows.item(i)
                        //             xx = xx.name
                        //             if (xx == 1) {
                        //                 db.init().transaction(function (txn) {
                        //                     txn.executeSql("UPDATE kondisi SET name=:name WHERE id=1", [0], function (tx) {
                        //                         console.log("isi", tx);
                        //                     })
                        //                 })
                        //             } else {
                        //                 db.init().transaction(function (txn) {
                        //                     txn.executeSql("UPDATE kondisi SET name=:name WHERE id=1", [1], function (tx) {
                        //                         console.log("kamu : ", tx);
                        //                     })
                        //                 })
                        //             }

                        //         }
                        //     });
                        // })
                    }}
                    icon={<IOSIcon name="ios-menu" size={24} color="black" />}
                    type="clear"
                />
            </View>
        ),
        headerRight: () => (
            <View style={{ marginRight: 8 }}>
                <Button
                    onPress={() => firebase.auth().signOut()}
                    icon={<Icon name="sign-out" size={24} color="black" />}
                    type="clear"
                />
            </View>
        ),
        transitionSpec: {
            open: config,
            close: config,
        },
        headerTitleAlign: "center"
    };

    // static navigationOptions = {
    //     drawerLabel: 'Notifications',
    //     drawerIcon: ({ tintColor }) => (
    //         <View style={{ marginLeft: 8 }}>
    //             <Button
    //                 onPress={() => this.props.navigation.navigate("DrawerOpen")}
    //                 icon={<IOSIcon name="ios-menu" size={24} color="black" />}
    //                 type="clear"
    //             />
    //         </View>
    //     ),
    // };

    constructor(props) {
        super(props)
        this.state = {
            region: {
                latitude: -7.9606086,
                longitude: 112.6508681,
            },
            changeRegion: global.changeRegion,
            markers: [],
            coordinates: [],
            jarak: 0,
            accuracy: null,
            add: 0,
            drag: "Add Loc",
            plus: false,
            changePos: 0,
            edit: false,
            change: false,
            loading: true,
            path: null,
            exportData: null,
            plusCoor: false,
            tambah: false,
            color: null,
            coordinatesAll: [],
            index: null,
        }
        // this.locateCurrentPosition()
    }

    componentDidMount() {
        this.locateCurrentPosition()
        global.dt = null
        global.menbar = true
        db.init()
    }

    locateCurrentPosition = async () => {
        Geolocation.getCurrentPosition(
            position => {
                // console.log(JSON.stringify(position));

                var latitude = position.coords.latitude
                var longitude = position.coords.longitude
                var accuracy = position.coords.accuracy
                var region = {
                    latitude: latitude,
                    longitude: longitude,
                }
                var inlang = {
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }
                global.changeRegion = inlang
                this.setState({ region, changeRegion: inlang, accuracy })
                // console.log("lokasi : ", this.state.latitude, this.state.longitude);

                this.setState({
                    markers: [
                        ...this.state.markers,
                        {
                            coordinate: region,
                            key: id++,
                            color: 'red',
                        },
                    ],
                    coordinates: [
                        ...this.state.coordinates,
                        region
                    ],
                    color: randomColor(),
                    index: 0
                })

            },
            error => console.log(error.message),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
        )
    }

    change(event, marker) {
        event.id = marker.key
        let { markers } = this.state
        // console.log(event.id, " , ", markers.key)
        if (markers.key = event) {
            let mar = markers
            let i = event.id
            var a = mar[i].key
            var drag = "Edit Loc"
            this.setState({ add: a, drag, edit: true })
            // console.log(this.state.drag)
        }
    }

    resetMarker() {
        id = 0
        var drag = "Add Loc"
        var r = this.state.region
        this.setState({
            markers: [{
                coordinate: r,
                key: id++,
                color: "red",
            }], coordinates: [r], jarak: 0, plus: false, drag, color: randomColor
        })
    }

    onSet() {
        this.setState({ plus: false })
        let { region, changePos } = this.state
        var latitude = changePos.latitude
        var longitude = changePos.longitude
        region = {
            latitude: latitude,
            longitude: longitude,
        }
        // console.log(region);

        this.setState({
            markers: [
                ...this.state.markers,
                {
                    coordinate: region,
                    key: id++,
                    color: randomColor(),
                },
            ],
            coordinates: [
                ...this.state.coordinates,
                region
            ]
        });
        // console.log(e.nativeEvent.coordinate);

        const nat = region
        let meter = 0
        // console.log(this.state.coordinates)
        this.state.markers.map((koor) => {
            meter = getDistance(
                koor.coordinate, nat,
            );
            // console.log(meter);
        })
        var jarak = this.state.jarak += meter
        var drag = "Add Loc"
        this.setState({ jarak, drag: drag })
    }

    set() {
        if (this.state.tambah == true) {
            this.onTambahLine()
        } else {
            if (this.state.edit == false) {
                this.onSet()
            } else {
                this.onChangeLoc()
            }
        }
    }

    onTambahLine() {
        this.setState({ tambah: false, plus: false, })
        id = 0
        let { region, changePos } = this.state
        var latitude = changePos.latitude
        var longitude = changePos.longitude
        region = {
            latitude: latitude,
            longitude: longitude,
        }
        this.setState({
            markers: [
                ...this.state.markers,
                {
                    coordinate: region,
                    key: id++,
                    color: 'red',
                },
            ],
            coordinates: [
                ...this.state.coordinates,
                region
            ],
            color: randomColor()
        });
        this.state.coordinatesAll.map(
            e => {
                console.log(e.coordinates);
            }
        )

    }
    onChangeLoc() {
        const { add, markers, coordinates, changePos } = this.state
        var mar = markers
        // console.log("awal : ", this.state.coordinates);

        mar[add] = {
            coordinate: {
                latitude: changePos.latitude,
                longitude: changePos.longitude
            },
            key: add,
            color: mar[add].color,
        }

        var ad = {
            latitude: changePos.latitude,
            longitude: changePos.longitude
        }
        let cob = coordinates.slice();
        cob[add].pop
        cob[add] = ad

        // console.log("cor2 ", jar);
        var drag = "Add Loc"
        this.setState({ markers: mar, plus: false, edit: false, drag: drag, coordinates: cob })
        // console.log("akhir : ", this.state.coordinates);
        let i = 0, jar = 0
        // coordi.map(coor => {
        //     var meter = getDistance(
        //         coordi[i], coordi[i++],
        //     );
        //     console.log("mter : ", coordi[i], coordi[i + 1]);
        //     i++

        //     jar += meter
        //     this.setState({ jarak: jar })
        //     console.log("cor1 : ", jar);

        // })
        for (let e = 1; e < cob.length; e++) {
            var meter = getDistance(
                cob[i], cob[i + 1],
            );
            i++
            jar += meter
            this.setState({ jarak: jar })
        }
        // console.log("akhir ", this.state.coordinates);

    }

    UploadData(name) {
        const { coordinates, markers, changeRegion, color } = this.state
        let content = JSON.stringify({ coordinates: coordinates, changeRegion: changeRegion, markers: markers, id: id, color: color })

        const dirs = '/storage/emulated/0/MapApps/'
        const path = dirs + name + '.txt'

        const fs = RNFetchBlob.fs;
        fs.isDir(dirs)
            .then((isDir) => {
                if (isDir == false) {
                    fs.mkdir(dirs)
                        .then((b) => {
                            console.log(b)
                            if (b == true) {
                                fs.createFile(path, content, 'utf8')
                                    .then((lo) => this.setState({ path: lo }))
                                    .catch((err) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                    })
                            }
                        })
                        .catch((err) => { console.log(err) })
                }
            })
        fs.createFile(path, content, 'utf8')
            .then((lo) => this.setState({ path: lo }))
            .catch((err) => {
                if (err) {
                    console.log(err);
                }
            })
        // console.log("Path: ", this.state.path);
    }

    ChangeUpload() {
        const { path, markers, coordinates, changeRegion, color } = this.state
        let content = JSON.stringify({ coordinates: coordinates, changeRegion: changeRegion, markers: markers, id: id, color: color })
        if (path == null) {
            Prompt.show('Export To File TXT', 'Set Name File', name =>
                this.UploadData(name),
            )
        } else {
            RNFetchBlob.fs.writeFile(path, content, 'utf8')
                .then((e) => {
                    console.log("berhasil: ", e);
                })
        }
    }

    ImportData() {
        // console.log(this.state.path);
        // let p = this.state.path
        // if (p != null) {
        // RNFetchBlob.fs.readFile(p, 'utf8')
        //     .then((data) => {
        //         global.dt = data
        //         console.log(data)

        //         this.setState({ exportData: data })
        //     })
        // console.log(data.coordinates)
        //     RNFetchBlob.fs.readStream(p, 'utf8')
        //         .then((stream) => {
        //             let data = ''
        //             stream.open()
        //             stream.onData((chunk) => {
        //                 data += chunk
        //             })
        //             stream.onEnd(() => {
        //                 // console.log(data)
        //                 data = JSON.parse(data)
        //                 this.setState({ markers: data.markers, coordinates: data.coordinates, changeRegion: data.changeRegion })
        //                 id = data.id
        //             })
        //         })
        // if (global.dt != null) {
        //     var data = global.dt

        //     id = data.id
        // }
        // } else {
        RNFileSelector.Show(
            {
                path: '/storage/emulated/0/MapApps/',
                title: 'Select File',
                onDone: (path) => {
                    // console.log('file selected: ' + path)
                    RNFetchBlob.fs.readStream(path, 'utf8')
                        .then((stream) => {
                            let data = ''
                            stream.open()
                            stream.onData((chunk) => {
                                data += chunk
                            })
                            stream.onEnd(() => {
                                // console.log(data)
                                data = JSON.parse(data)
                                this.setState({ markers: data.markers, coordinates: data.coordinates, changeRegion: data.changeRegion, color: data.color })
                                id = data.id
                            })
                        })
                },
                onCancel: () => {
                    console.log('cancelled')
                }
            }
        )
        // }
    }

    dialog() {
        if (this.state.plus == true) {
            Alert.alert(
                'Warning',
                'Batalkan Menambahkan / Merubah Lokasi??',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: 'OK', onPress: (e) => this.setState({ plus: false, edit: false, drag: "Add Loc" }), style: "destructive" },
                ],
                { cancelable: false },
            );
        }
    }

    tambahLine() {
        const { markers, coordinates, changeRegion, color, index } = this.state
        let content = { coordinates: coordinates, changeRegion: changeRegion, markers: markers, id: id, color: color, index: index }
        this.setState({
            coordinatesAll: [
                ...this.state.coordinatesAll,
                content
            ]
        })
        var index1 = index
        index1++
        this.setState({
            tambah: true, plus: true, markers: [], coordinates: [], color: null, index: index1
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    customMapStyle={Costum}
                    showsUserLocation={true}
                    initialRegion={this.state.changeRegion}
                    // onPress={e => log("Screen Cor : ", e)}
                    onRegionChangeComplete={e => this.setState({ changePos: e })}
                    onPress={() => this.dialog()}
                    provider={PROVIDER_GOOGLE}>
                    {this.state.markers.map(marker => (
                        <Marker
                            key={marker.key}
                            coordinate={marker.coordinate}
                            pinColor={marker.color}
                            onPress={e => this.change(e, marker)}
                        >
                            <PriceMarker
                                fontSize={12}
                                amount={marker.key}
                                borderColor={marker.color}
                            />
                        </Marker>
                    ))}

                    <Polyline coordinates={this.state.coordinates} onPress={e => console.log("ini : ", e)} strokeColor={this.state.color} strokeWidth={3} />
                </MapView>
                {this.state.plus == true &&
                    <View style={{ ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" }}>
                        <Image
                            source={icon}
                            style={styles.gambar}
                        />
                    </View>
                }
                <Prompt />
                {/* <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('sqlite')}
                        style={styles.bubble}>
                        <Text>Upload</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={[styles.map, {
                    marginTop: 10, marginHorizontal: 15,
                }]}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.btnshow}>
                            <View style={{ justifyContent: "center" }}>
                                <TouchableOpacity
                                    style={[styles.street, { backgroundColor: '#fff', opacity: 0.8, height: 40, width: 40 }]}
                                    onPress={() => this.setState({ plusCoor: !this.state.plusCoor })}
                                >
                                    <IOSIcon
                                        name="ios-map"
                                        size={20}
                                        color="#000"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.state.plusCoor == true && <View style={styles.isi}>
                            <View style={{ justifyContent: "center" }}>
                                <TouchableOpacity style={[styles.street, { backgroundColor: this.state.color }]}>
                                    <Icon
                                        name="check"
                                        size={20}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ justifyContent: "center" }}>
                                <TouchableOpacity style={[styles.street, { backgroundColor: "#0086cc" }]}
                                    onPress={() => this.tambahLine()}
                                >
                                    <Icon
                                        name="plus"
                                        size={20}
                                        color="#fff"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>}
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    {/* <TouchableOpacity
                        onPress={() => this.props.navigation.toggleDrawer()}
                        style={styles.bubble}>
                        <Icon name='map-pin' color="red" />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        onPress={() => this.ChangeUpload()}
                        style={styles.bubble}>
                        <Icon name="upload" size={18} color="black" />
                    </TouchableOpacity>
                    <View style={[styles.bubble, { marginHorizontal: 20 }]}>
                        <Text>Jarak : {this.state.jarak} M</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.ImportData()}
                        style={styles.bubble}>
                        <Icon name="download" size={18} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => this.resetMarker()}
                        style={styles.bubble}
                    >
                        <Text>Tap to Reset Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.setState({ plus: true })}
                        style={[styles.bubble, { marginLeft: 15 }]}
                    >
                        <Text>{this.state.drag} </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.set()}
                        style={[styles.bubble, { marginLeft: 15 }]}
                        disabled={!this.state.plus}
                    >
                        <Icon name="map-pin" size={18} color="black" />
                    </TouchableOpacity>
                </View>
            </View >
        );
    }
}

HomeScreen.propTypes = {
    provider: ProviderPropType,
};

export default HomeScreen;

const styles = StyleSheet.create({
    isi: {
        height: 50,
        flex: 1,
        backgroundColor: "#fff",
        opacity: 0.7,
        borderRadius: 5,
        flexDirection: "row"
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    header: {
        padding: 10,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'row',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    gambar: {
        marginBottom: center,
        backgroundColor: 'transparent',
        width: 40,
        height: 40,
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    export: {
        marginBottom: 40,
        backgroundColor: 'transparent',
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 10
    },
    street: {
        height: 35,
        width: 35,
        borderRadius: 35,
        marginLeft: 7,
        justifyContent: "center",
        alignItems: "center",
    },
    btnshow: {
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: 20
    }
});
