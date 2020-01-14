import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, TextInput, View } from 'react-native';

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
    color: '#999',
    paddingTop: 0,
    paddingBottom: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#666',
    marginVertical: 8,
  },
  selectContainer: {
    borderRadius: 3,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
  },
});

const EditBlock = props => {
  return (
    <View style={styles.editDescriptionContainer}>
      <TextInput
        style={styles.editDescriptionField}
        multiline
        numberOfLines={2}
        placeholder="Once upon a time..."
        placeholderTextColor="#999"
      />
      <Text style={styles.label}>Block Type</Text>
      <View style={styles.selectContainer}>
        <Text>Text</Text>
      </View>
    </View>
  );
};

export default EditBlock;
