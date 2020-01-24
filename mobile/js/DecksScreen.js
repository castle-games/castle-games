import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useNavigation } from 'react-navigation-hooks';

import GameUrlInput from './GameUrlInput';
import Viewport from './viewport';

const { vw, vh } = Viewport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 12,
  },
  urlInput: {
    width: '100%',
    paddingTop: 4,
    paddingBottom: 12,
  },
  deckFeedItemContainer: {
    width: '100%',
    borderColor: '#ccc',
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    backgroundColor: '#f2f2f2',
    padding: 8,
  },
  deckFeedItemCard: {
    minHeight: 50 * vh,
    width: '56%',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

const DeckFeedItem = (props) => {
  const navigation = useNavigation(); // TODO: navigate to deck
  return (
    <View style={styles.deckFeedItemContainer}>
      <TouchableOpacity style={styles.deckFeedItemCard} onPress={() => {}}>
        <Text>{props.deck.title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const DecksScreen = (props) => {
  const query = useQuery(gql`
    query {
      allDecks {
        deckId
        title
        creatorUserId
        currentCard {
          cardId
        }
      }
    }
  `);
  let decks;
  if (!query.loading && !query.error && query.data) {
    decks = query.data.allDecks;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.urlInput}>
          <GameUrlInput />
        </View>
        <React.Fragment>
          {decks && decks.map((deck) => <DeckFeedItem key={deck.deckId} deck={deck} />)}
        </React.Fragment>
      </ScrollView>
    </View>
  );
};

export default DecksScreen;
