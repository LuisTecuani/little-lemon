import { Image, StyleSheet, Text, View } from "react-native";

export default function Splash() {
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/header-logo.png')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
})