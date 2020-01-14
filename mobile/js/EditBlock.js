import React from 'react';
import { TouchableOpacity, StyleSheet, Text, TextInput, View } from 'react-native';

import FastImage from 'react-native-fast-image';

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
  editDescriptionRow: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  editDescriptionField: {
    width: '100%',
    flexShrink: 1,
    color: '#999',
    paddingTop: 0,
    paddingBottom: 8,
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
    flexDirection: 'row',
  },
  select: { marginLeft: 4, flexShrink: 0 },
  dismiss: { marginLeft: 4, flexShrink: 0 },
});

const EditBlock = props => {
  return (
    <View style={styles.editDescriptionContainer}>
      <View style={styles.editDescriptionRow}>
        <TextInput
          style={styles.editDescriptionField}
          multiline
          autoFocus
          numberOfLines={2}
          placeholder="Once upon a time..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.dismiss} onPress={props.onDismiss}>
          <FastImage
            style={{
              width: 16,
              aspectRatio: 1,
            }}
            source={require('../assets/images/dismiss.png')}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Block Type</Text>
      <View style={styles.selectContainer}>
        <Text style={{ width: '100%', flexShrink: 1 }}>Text</Text>
        <View style={styles.select}>
          <FastImage
            style={{
              width: 16,
              aspectRatio: 1,
            }}
            source={require('../assets/images/arrow-button-down.png')}
          />
        </View>
      </View>
    </View>
  );
};

export default EditBlock;
