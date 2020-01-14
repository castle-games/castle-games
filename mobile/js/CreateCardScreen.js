import React from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scene: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  buttonLabel: {
    textAlign: 'center',
    color: '#888',
  },
  description: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  editDescriptionContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    width: '100%',
    height: '100%',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
  },
  editDescriptionField: {
    width: '100%',
    height: '100%',
  },
  actions: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
});

const ActionButton = props => {
  const buttonProps = { ...props, children: undefined };
  return (
    <TouchableOpacity style={styles.button} {...buttonProps}>
      <Text style={styles.buttonLabel}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const CreateCardScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.scene}>
        <ActionButton>Edit Scene</ActionButton>
      </View>
      <View style={styles.description}>
        <View style={styles.editDescriptionContainer}>
          <TextInput
            multiline
            numberOfLines={6}
            placeholder="Once upon a time..."
            placeholderTextColor="#999999"
            style={styles.editDescriptionField}
          />
        </View>
      </View>
      <View style={styles.actions}>
        <ActionButton>Add Label</ActionButton>
      </View>
    </View>
  );
};

export default CreateCardScreen;
