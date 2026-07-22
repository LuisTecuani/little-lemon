import { Image, View, StyleSheet, Pressable } from "react-native";
import { theme } from "../theme";
import Icon from "react-native-vector-icons/Ionicons";
import LetterIcon from "./LetterIcon";

export default function Header({firstName, lastName, avatarUri, navigation, showBackButton = false}) {
    return (
        <View style={styles.container}>
            {showBackButton && <Icon name="caret-back-circle" size={44} color={theme.colors.primary1} onPress={() => {navigation.navigate('Home')}} />}
            <Image style={styles.image} resizeMode="contain" source={require('../../assets/images/header-logo.jpg')} />
            {avatarUri ? (
                <Pressable onPress={() => {navigation.navigate('Profile')}}><Image source={{ uri: avatarUri }} style={styles.avatarImage} /></Pressable>
            ) : (
                firstName ? <Pressable onPress={() => {navigation.navigate('Profile')}}><LetterIcon firstName={firstName} lastName={lastName} /></Pressable> : null
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    image: {
        width: '60%',
        height: 60,
        paddingHorizontal: 10,
        marginHorizontal: 10,
    },
    avatarImage: {
        height: 60,
        width: 60,
        borderRadius: 20,
    },
})