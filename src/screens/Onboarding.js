
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import InputText from '../components/InputText';
import { useState } from 'react';

export default function Onboarding() {
  const [firstName, setFirstName] = useState('')
  const [isFirstNameValid, setIsFirstNameValid] = useState(false)
  const [firstNameError, setFirstNameError] = useState('')
  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [emailError, setEmailError] = useState('')

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

  const handleNext = () => {
    console.log('Next pressed');
    alert(`hi ${firstName}`)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.image} source={require('../../assets/images/header-logo.png')} />
      </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    justifyContent: 'top',
  },
  formTitle: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Karla-Regular',
    paddingVertical: 40 ,
    marginBottom: 60,
  },
  image: {
    height: 80,
    width: '90%',
  },
  button: {
    color: 'black',
    width: 100,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#5658e8ff',
    borderRadius: 12,
    marginRight: '10%',
    marginTop: 40,

  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Karla-Regular',
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
    fontWeight: 'semibold',
    fontFamily: 'Karla-Regular',
    paddingVertical: 10,
    },
  input: {
    height: 60,
    width: '80%',
    borderWidth: 1.5,
    borderRadius: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontFamily: 'Karla-Regular',
    marginTop: 10,
  },
})