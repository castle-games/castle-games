import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import SafeAreaView from 'react-native-safe-area-view';
import { useNavigation } from 'react-navigation-hooks';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollView: {
    padding: 16,
  },
  decks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    color: '#888',
    fontWeight: '700',
    marginVertical: 8,
  },
  cell: {
    borderColor: '#ccc',
    borderRadius: 6,
    borderWidth: 1,
    width: 128,
    height: 228,
    padding: 8,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    marginRight: 16,
    marginBottom: 16,
  },
  cellTitle: {
    fontSize: 10,
    color: '#333',
  },
  createCell: {
    backgroundColor: '#bbb',
  },
});

const DUMMY_DECKS = [
  {
    deckId: 1,
    title: 'Existing deck 1',
  },
  {
    deckId: 2,
    title: 'Existing deck 2',
  },
  {
    deckId: 3,
    title: 'Existing deck 3',
  },
  {
    deckId: 4,
    title: 'Existing deck 4',
  },
  {
    deckId: 5,
    title: 'Existing deck 5',
  },
  {
    deckId: 6,
    title: 'Existing deck 6',
  },
];

const EditDeckCell = props => {
  const { deck, onPress } = props;
  return (
    <TouchableOpacity style={styles.cell} onPress={onPress}>
      <Text style={styles.cellTitle}>{deck.title}</Text>
    </TouchableOpacity>
  );
};

const CreateDeckCell = props => {
  return (
    <TouchableOpacity style={[styles.cell, styles.createCell]} onPress={props.onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <FastImage
          style={{
            width: 8,
            aspectRatio: 1,
            marginRight: 4,
          }}
          source={require('../assets/images/add.png')}
        />
        <Text style={[styles.cellTitle, { fontWeight: '700', color: '#fff' }]}>Create Deck</Text>
      </View>
    </TouchableOpacity>
  );
};

const CreateScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.sectionTitle}>My Decks</Text>
        <View style={styles.decks}>
          <CreateDeckCell
            key="create"
            onPress={() => {
              navigation.push('CreateCard');
            }}
          />
          {DUMMY_DECKS.map(deck => (
            <EditDeckCell key={deck.deckId} deck={deck} onPress={() => {}} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateScreen;
