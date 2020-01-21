import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, TextInput, View } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';

import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  editDescriptionContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    width: '100%',
    minHeight: 72,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
  },
  editDescriptionRow: {
    minHeight: 20,
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  editDescriptionField: {
    width: '100%',
    flexShrink: 1,
    color: '#000',
    paddingTop: 0,
    paddingBottom: 8,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 12,
  },
  selectContainer: {
    borderRadius: 3,
    borderWidth: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selection: { width: '100%', flexShrink: 1 },
  select: { marginLeft: 4, flexShrink: 0 },
  dismiss: { marginLeft: 4, flexShrink: 0 },
});

const textTypeStyles = StyleSheet.create({
  editDescriptionContainer: {
    backgroundColor: '#fff',
  },
  editDescriptionRow: {},
  editDescriptionField: {
    color: '#000',
  },
  selectContainer: {
    borderColor: '#ccc',
  },
  selection: {
    color: '#000',
  },
  label: {
    color: '#666',
  },
});

const choiceTypeStyles = StyleSheet.create({
  editDescriptionContainer: {
    backgroundColor: '#000',
  },
  editDescriptionRow: {},
  editDescriptionField: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 6,
  },
  selectContainer: {
    borderColor: '#2b2b2b',
  },
  selection: {
    color: '#fff',
  },
  label: {
    color: '#888',
  },
});

const BLOCK_TYPES = [
  {
    name: 'Text',
    type: 'text',
  },
  {
    name: 'Choice',
    type: 'choice',
  },
];

const Dropdown = props => {
  const { onPress, styleSheet, value } = props;
  const valueToDisplay = value !== null ? value : '';
  return (
    <TouchableOpacity
      style={[styles.selectContainer, styleSheet.selectContainer]}
      onPress={onPress}>
      <Text style={[styles.selection, styleSheet.selection]}>{valueToDisplay}</Text>
      <View style={styles.select}>
        <FastImage
          style={{
            width: 16,
            aspectRatio: 1,
          }}
          source={require('../assets/images/arrow-button-down.png')}
        />
      </View>
    </TouchableOpacity>
  );
};

const EditBlock = props => {
  const [selectedType, setSelectedType] = useState('text');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const { showActionSheetWithOptions } = useActionSheet();

  const selectBlockType = () =>
    showActionSheetWithOptions(
      {
        title: 'Block Type',
        options: BLOCK_TYPES.map(type => type.name).concat(['Cancel']),
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        if (buttonIndex < BLOCK_TYPES.length) {
          setSelectedType(BLOCK_TYPES[buttonIndex].type);
        }
      }
    );

  const selectDestination = () => {
    const { deck } = props;
    if (!deck || !deck.cards || !deck.cards.length) return false;

    showActionSheetWithOptions(
      {
        title: 'Destination',
        options: deck.cards.map(card => card.name).concat(['Cancel']),
        cancelButtonIndex: deck.cards.length,
      },
      buttonIndex => {
        if (buttonIndex < deck.cards.length) {
          setSelectedDestination(deck.cards[buttonIndex].name);
        }
      }
    );
  };

  const blockType = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
  const typeStyles = selectedType === 'choice' ? choiceTypeStyles : textTypeStyles;
  const maybeBlockIcon =
    selectedType === 'choice' ? (
      <FastImage
        style={{
          width: 12,
          aspectRatio: 1,
          marginTop: 2,
          marginLeft: 2,
        }}
        source={require('../assets/images/add.png')}
      />
    ) : null;
  return (
    <View style={[styles.editDescriptionContainer, typeStyles.editDescriptionContainer]}>
      <View style={styles.editDescriptionRow}>
        {maybeBlockIcon}
        <TextInput
          style={[styles.editDescriptionField, typeStyles.editDescriptionField]}
          multiline
          autoFocus
          numberOfLines={2}
          placeholder="Once upon a time..."
          placeholderTextColor="#999"
          onFocus={props.onTextInputFocus}
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
      <Text style={[styles.label, typeStyles.label]}>Block Type</Text>
      <Dropdown onPress={selectBlockType} value={blockType} styleSheet={typeStyles} />
      {selectedType == 'choice' ? (
        <React.Fragment>
          <Text style={[styles.label, typeStyles.label]}>Destination</Text>
          <Dropdown
            onPress={selectDestination}
            value={selectedDestination}
            styleSheet={typeStyles}
          />
        </React.Fragment>
      ) : null}
    </View>
  );
};

export default EditBlock;
