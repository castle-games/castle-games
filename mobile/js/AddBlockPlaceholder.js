import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View } from 'react-native';

import Viewport from './viewport';

const { vw, vh } = Viewport;

const styles = StyleSheet.create({
  editDescriptionContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
  },
  editDescriptionField: {
    width: '100%',
    minHeight: 20 * vh,
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
