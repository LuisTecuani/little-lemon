
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../theme';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '@/components/Header';

export default function Onboarding({ navigation, checkOnboardingCompleted }) {
  const [firstName, setFirstName] = useState('')
  const [isFirstNameValid, setIsFirstNameValid] = useState(false)
  const [firstNameError, setFirstNameError] = useState('')
  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [emailError, setEmailError] = useState('')

  const storage = AsyncStorage;

  const handleFirstNameChange = (value) => {
    setFirstName(value)
  }

  const validateFirstName = () => {
    setIsFirstNameValid(false)
    if (!firstName || firstName.trim() === '') {
      return setFirstNameError('First name is required');
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(firstName)) {
      return setFirstNameError('First name should contain only letters and spaces');
    }

    setFirstNameError('');
    setIsFirstNameValid(true);
  }

  const handleEmailChange = (value) => {
    setEmail(value)
  }

  const validateEmail = () => {
    setIsEmailValid(false)
    if (!email || email.trim() === '') {
      setEmailError('Email is required')
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Email is invalid')
      return;
    }

    setEmailError('');
    setIsEmailValid(true);
  }

  const handleNext = async () => {
    await storage.setItem('user', JSON.stringify({ firstName, email }));
    await storage.setItem('onboardingCompleted', 'true');
    checkOnboardingCompleted();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        firstName={firstName || ""}
        lastName={""}
        avatarUri={""}
        navigation={navigation}
        showBackButton={false}
      />
      <View style={styles.form}>
        <Text style={styles.formTitle}>Let us get to know you.</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>
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
          <Text style={styles.inputTitle}>
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
      </View>
      <Pressable 
        style={styles.button} 
        disabled={!isFirstNameValid || !isEmailValid}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
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
    justifyContent: 'center',
    marginBottom: 40,
  },
  form: {
    width: '100%',
    flex: .9,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  formTitle: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: theme.fonts.regular,
    paddingVertical: 40 ,
    marginBottom: 60,
  },
  image: {
    height: 80,
    width: '80%',
    resizeMode: 'contain',
  },
  button: {
    color: 'black',
    width: 100,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary1,
    borderRadius: 12,
    marginRight: '10%',
    marginTop: 40,

  },
  buttonText: {
    color: theme.colors.highlightLight,
    fontSize: 24,
    fontWeight: 'bold',
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
    height: 60,
    width: '80%',
    borderWidth: 1.5,
    borderRadius: 12,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    marginTop: 10,
  },
})