import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import gql from 'graphql-tag';
import SafeAreaView from 'react-native-safe-area-view';
import { useQuery } from '@apollo/react-hooks';
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

const EditDeckCell = props => {
  const { deck, onPress } = props;
  const title = deck && deck.title ? deck.title : 'Untitled Deck';
  return (
    <TouchableOpacity style={styles.cell} onPress={onPress}>
      <Text style={styles.cellTitle}>{title}</Text>
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
  const query = useQuery(gql`
    query Me {
      me {
        userId
        decks {
          deckId
          title
          initialCard {
            cardId
          }
        }
      }
    }
  `);

  let decks;
  if (!query.loading && !query.error && query.data) {
    decks = query.data.me.decks;
  }

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
          {decks &&
            decks.map(deck => (
              <EditDeckCell
                key={deck.deckId}
                deck={deck}
                onPress={() => {
                  navigation.push('CreateCard', {
                    deckIdToEdit: deck.deckId,
                    cardIdToEdit: deck.initialCard.cardId,
                  });
                }}
              />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateScreen;
