import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Profile Page</Text>
            <Text style={styles.greeting}>Hello, {AsyncStorage.getItem('user').firstName}!</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
})

export default Profile
