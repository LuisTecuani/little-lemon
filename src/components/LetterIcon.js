import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function LetterIcon({ firstName, lastName }) {

  return (
    <View style={styles.circle}>
      <Text style={styles.text}>
        {((firstName[0] || '') + (lastName ? lastName[0] : '')).toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.colors.highlightLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
