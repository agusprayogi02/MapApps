import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
        marginBottom: 40,
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