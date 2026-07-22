import { Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { theme } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LetterIcon from "../components/LetterIcon";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import Icon from "react-native-vector-icons/Ionicons";
import Header from "../components/Header";

export default function Profile({ navigation, checkOnboardingCompleted }) {
    const [avatarUri, setAvatarUri] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
    
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');

    const [orderStatuses, setOrderStatuses] = useState(false);
    const [passwordChanges, setPasswordChanges] = useState(false);
    const [specialOffers, setSpecialOffers] = useState(false);
    const [newsletter, setNewsletter] = useState(false);

    const storage = AsyncStorage;

    useEffect(() => {
        getUser();
    }, []);

    async function getUser() {
        const user = await storage.getItem('user');
        const { 
            avatarUri, 
            firstName, 
            lastName, 
            email, 
            phoneNumber,
            orderStatuses,
            passwordChanges,
            specialOffers,
            newsletter,
        } = JSON.parse(user || '{}');
        setAvatarUri(avatarUri || '');
        setFirstName(firstName || '');
        setLastName(lastName || '');
        setEmail(email || '');
        setPhoneNumber(phoneNumber || '');
        setOrderStatuses(orderStatuses || false);
        setPasswordChanges(passwordChanges || false);
        setSpecialOffers(specialOffers || false);
        setNewsletter(newsletter || false);
    }

    const handleAvatarClick = async () => {
        console.log('Avatar clicked');
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log('permission', permission);
        if (permission.status !== 'granted') {
            console.log('permission denied');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            cropShape: 'oval'
        });
        console.log('result', result);

        if (!result.canceled) {
            setAvatarUri(result.assets[0].uri);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarUri(null);
    };

    const handleFirstNameChange = (value) => {
        setFirstName(value);
        setIsFirstNameValid(false);
    };

    const handleLastNameChange = (value) => {
        setLastName(value);
        value ? setIsLastNameValid(false) : setIsLastNameValid(true);
    };

    const handleEmailChange = (value) => {
        setEmail(value);
        setIsEmailValid(false);
    };

    const handlePhoneNumberChange = (value) => {
        setPhoneNumber(value);
        value ? setIsPhoneNumberValid(false) : setIsPhoneNumberValid(true);
    };
    const nameRegex = /^[A-Za-z\s]+$/;
    const validateFirstName = () => {
        if (!firstName || firstName.trim() === '') {
            setFirstNameError('First name is required');
            setIsFirstNameValid(false);
        } else if (!nameRegex.test(firstName)) {
            setFirstNameError('First name is invalid');
            setIsFirstNameValid(false);
        } else {
            console.log('First name is valid');
            setFirstNameError('');
            setIsFirstNameValid(true);
        }
    };

    const validateLastName = () => {
        if (!lastName) {
            return
        } else if (!nameRegex.test(lastName)) {
            setLastNameError('Last name is invalid');
            setIsLastNameValid(false);
        } else {
            console.log('Last name is valid');
            setLastNameError('');
            setIsLastNameValid(true);
        }
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || email.trim() === '') {
            setEmailError('Email is required');
            setIsEmailValid(false);
        } else if (!emailRegex.test(email)) {
            setEmailError('Email is invalid');
            setIsEmailValid(false);
        } else {
            console.log('Email is valid');
            setEmailError('');
            setIsEmailValid(true);
    }
    };

    const validatePhoneNumber = () => {
        const phoneRegex = /^\d{10}$/;
        if (!phoneNumber) {
            return
        } else if (!phoneRegex.test(phoneNumber)) {
            setPhoneNumberError('Phone number is invalid');
            setIsPhoneNumberValid(false);
        } else {
            console.log('Phone number is valid');
            setPhoneNumberError('');
            setIsPhoneNumberValid(true);
        }
    };

    const handleSave = async () => {
        console.log('Saving user...');
        await storage.setItem('user', JSON.stringify({ 
            avatarUri, 
            firstName, 
            lastName, 
            email, 
            phoneNumber,
            orderStatuses,
            passwordChanges,
            specialOffers,
            newsletter,
        }));
    };

    const handleLogout = async () => {
        await storage.removeItem('user');
        await storage.removeItem('onboardingCompleted');
        checkOnboardingCompleted();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
            <Header
                firstName={firstName}
                lastName={lastName}
                avatarUri={avatarUri}
                navigation={navigation}
                showBackButton={true}
            />
            <View style={styles.content}>
                <Text style={styles.contentTitle}>Personal Information</Text>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.label}>Avatar</Text>
                        <View style={styles.avatarImageContainer}>
                            {avatarUri ? (
                                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                            ) : (
                                <LetterIcon firstName={firstName} lastName={lastName} />
                            )}
                            <Pressable style={styles.avatarChangeButton} onPress={handleAvatarClick}>
                                <Text style={styles.changeAvatarText}>Change</Text>
                            </Pressable>
                            <Pressable style={styles.avatarRemoveButton} onPress={handleRemoveAvatar}>
                                <Text style={styles.removeAvatarText}>Remove</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            First name
                        </Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Enter your first name"
                            value={firstName}
                            onChangeText={handleFirstNameChange}
                            onBlur={validateFirstName}
                        />
                        {firstNameError ? (
                            <Text style={styles.errorText}>{firstNameError}</Text>
                        ) : null}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Last name
                        </Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Enter your last name"
                            value={lastName}
                            onChangeText={handleLastNameChange}
                            onBlur={validateLastName}
                        />
                        {lastNameError ? (
                            <Text style={styles.errorText}>{lastNameError}</Text>
                        ) : null}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Email
                        </Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={handleEmailChange}
                            onBlur={validateEmail}
                        />
                        {emailError ? (
                            <Text style={styles.errorText}>{emailError}</Text>
                        ) : null}
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Phone number
                        </Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Enter your phone number"
                            value={phoneNumber}
                            onChangeText={handlePhoneNumberChange}
                            onBlur={validatePhoneNumber}
                        />
                        {phoneNumberError ? (
                            <Text style={styles.errorText}>{phoneNumberError}</Text>
                        ) : null}
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.contentTitle}>
                        Email notifications
                    </Text>
                    <View style={styles.notificationsContainer}>
                        <View style={styles.notificationItem}>
                            <Switch
                                value={orderStatuses}
                                onValueChange={() => setOrderStatuses(!orderStatuses)}
                            />
                            <Text style={styles.notificationText}>
                                Order statuses
                            </Text>
                        </View>
                        <View style={styles.notificationItem}>
                            <Switch
                                value={passwordChanges}
                                onValueChange={() => setPasswordChanges(!passwordChanges)}
                            />
                            <Text style={styles.notificationText}>
                                Password changes
                            </Text>
                        </View>
                        <View style={styles.notificationItem}>
                            <Switch
                                value={specialOffers}
                                onValueChange={() => setSpecialOffers(!specialOffers)}
                            />
                            <Text style={styles.notificationText}>
                                Special offers
                            </Text>
                        </View>
                        <View style={styles.notificationItem}>
                            <Switch
                                value={newsletter}
                                onValueChange={() => setNewsletter(!newsletter)}
                            />
                            <Text style={styles.notificationText}>
                                Newsletter
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.buttonsContainer}>
                    <Pressable 
                        disabled={!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPhoneNumberValid}
                        style={styles.saveButton} 
                        onPress={handleSave}
                    >
                        <Text style={styles.saveButtonText}>Save changes</Text>
                    </Pressable>
                    <Pressable style={styles.discardButton} onPress={getUser}>
                        <Text style={styles.discardButtonText}>Discard Changes</Text>
                    </Pressable>
                </View>
                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </Pressable>
            </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.highlightLight,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    image: {
        width: '60%',
        height: '100%',
        paddingHorizontal: 10,
        marginHorizontal: 10,
        resizeMode: 'contain',
    },
    avatarImage: {
        height: 60,
        width: 60,
        borderRadius: 20,
    },
    avatarChangeButton: {
        width: '35%',
        height: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: theme.colors.primary1,
        borderRadius: 12,
    },
    avatarRemoveButton: {
        width: '35%',
        height: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        borderColor: theme.colors.primary1,
        borderWidth: 1,
        borderRadius: 12,
    },
    changeAvatarText: {
        color: theme.colors.highlightLight,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: theme.fonts.regular,
        alignSelf: 'center',
    },
    removeAvatarText: {
        color: theme.colors.primary1,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: theme.fonts.regular,
        alignSelf: 'center',
    },
    content: {
        width: '100%',
        justifyContent: 'flex-start',
        borderColor: theme.colors.highlightDark,
        borderWidth: 1,
        paddingVertical: 20,
        borderRadius: 20,
    },
    contentTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary1,
        fontFamily: theme.fonts.heading,
        marginLeft: 20,
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    userInfo: {
        width: '100%',
        alignItems: 'center',
    },
    avatar: {
        width: '100%',
    },
    avatarImageContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        marginBottom: 10,
    },
    avatarButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    label: {
        color: theme.colors.primary1,
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: theme.fonts.regular,
        marginRight: 20,
        marginLeft: 40,
        alignSelf: 'flex-start',
    },
    buttonsContainer: {
        width: '90%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
    },
    discardButton: {
        width: '45%',
        height: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        borderColor: theme.colors.primary1,
        borderWidth: 1,
        borderRadius: 12,
        marginTop: 10,
    },
    saveButton: {
        width: '45%',
        height: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: theme.colors.primary1,
        borderRadius: 12,
        marginTop: 10,
    },
    logoutButton: {
        color: theme.colors.highlightDark,
        width: '90%',
        height: 40,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: theme.colors.primary2,
        borderRadius: 12,
        marginTop: 10,
    },
    saveButtonText: {
        color: theme.colors.highlightLight,
        fontSize: 16,
        fontWeight: 700,
        fontFamily: theme.fonts.regular,
        textAlign: 'center',
    },
    discardButtonText: {
        color: theme.colors.primary1,
        fontSize: 16,
        fontWeight: 700,
        fontFamily: theme.fonts.regular,
        textAlign: 'center',
    },
    logoutButtonText: {
        color: theme.colors.highlightDark,
        fontSize: 16,
        fontWeight: 700,
        fontFamily: theme.fonts.regular,
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    inputTitle: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 600,
        fontFamily: theme.fonts.regular,
        paddingVertical: 10,
        },
    input: {
        height: 40,
        width: '80%',
        borderWidth: 1,
        borderRadius: 12,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 16,
        fontFamily: theme.fonts.regular,
        marginTop: 10,
    },
    switchContainer: {
        width: '100%',
        alignItems: 'center',
    },
    switch: {
        width: '100%',
        alignItems: 'center',
    },
    notificationsContainer: {
        width: '80%',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    notificationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 1,
    },
    notificationText: {
        color: theme.colors.primary1,
        fontSize: 16,
        fontFamily: theme.fonts.regular,
        fontWeight: 'bold',
        marginRight: 40,
        marginLeft: 20,
    },
    notificationSwitch: {
        color: theme.colors.primary1,
        fontSize: 16,
        fontWeight: 'bold',
    },
})
