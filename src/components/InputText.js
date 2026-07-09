import { StyleSheet, Text, TextInput, View } from "react-native";

export default function InputText(props) {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>
                {props.title}
            </Text>
            <TextInput style={styles.input} placeholder={props.title} />
        </View>
    )
}
   
const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'semibold',
        fontFamily: 'Karla-Regular',
        paddingVertical: 20,
    },
    input: {
        height: 60,
        width: '80%',
        borderWidth: 1.5,
        borderRadius: 12,
    },
})