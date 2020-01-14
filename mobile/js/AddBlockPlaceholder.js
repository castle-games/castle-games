import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  editDescriptionContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    width: '100%',
    height: '100%',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
  },
  editDescriptionField: {
    width: '100%',
    height: '100%',
    color: '#999',
  },
});

const AddBlockPlaceholder = props => {
  return (
    <View style={styles.editDescriptionContainer}>
      <TouchableWithoutFeedback onPress={props.onPress}>
        <Text style={styles.editDescriptionField}>Once upon a time...</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default AddBlockPlaceholder;
