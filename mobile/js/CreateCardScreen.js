import React from 'react';
import gql from 'graphql-tag';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SafeAreaView from 'react-native-safe-area-view';
import { withNavigation } from 'react-navigation';

import * as Session from './Session';

import CardBlocks from './CardBlocks';
import CardHeader from './CardHeader';
import EditBlock from './EditBlock';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    flexShrink: 1,
    backgroundColor: '#f2f2f2',
  },
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  actions: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
});

const getDeckById = async deckId => {
  const result = await Session.apolloClient.query({
    query: gql`
      query GetDeckById($deckId: ID!) {
        deck(deckId: $deckId) {
          deckId
          title
          cards {
            cardId
            title
            blocks {
              cardBlockId
              type
              title
              destinationCardId
            }
          }
        }
      }
    `,
    variables: { deckId },
  });
  return result.data.deck;
};

const ActionButton = props => {
  const buttonProps = { ...props, children: undefined };
  return (
    <TouchableOpacity style={styles.button} {...buttonProps}>
      <Text style={styles.buttonLabel}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const EMPTY_DECK = {
  title: '',
  cards: [],
};

const EMPTY_CARD = {
  title: '',
  blocks: [],
};

class CreateCardScreen extends React.Component {
  static defaultProps = {
    saveCard: card => {},
  };

  state = {
    deck: EMPTY_DECK,
    card: EMPTY_CARD,
    isEditingBlock: false,
    isHeaderExpanded: false,
  };

  componentDidMount() {
    this._update(null, this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    this._update(prevProps, this.props);
  }

  _update = async (prevProps, props) => {
    const prevDeckIdToEdit =
      prevProps && prevProps.navigation.state.params
        ? prevProps.navigation.state.params.deckIdToEdit
        : undefined;
    const prevCardIdToEdit =
      prevProps && prevProps.navigation.state.params
        ? prevProps.navigation.state.params.cardIdToEdit
        : undefined;
    const params = props.navigation.state.params || {};
    if (
      !prevProps ||
      prevDeckIdToEdit !== params.deckIdToEdit ||
      prevCardIdToEdit !== params.cardIdToEdit
    ) {
      let deck = EMPTY_DECK,
        card = EMPTY_CARD;
      if (params.deckIdToEdit) {
        try {
          deck = await getDeckById(params.deckIdToEdit);
          card = deck.cards.find(card => card.cardId == params.cardIdToEdit);
        } catch (_) {}
      }
      this.setState({ deck, card });
    }
  };

  _handleEditBlock = () => this.setState({ isEditingBlock: true });

  _handleDismissEditing = () => this.setState({ isEditingBlock: false });

  _handleBlockTextInputFocus = () => {
    // we want to scroll to the very bottom of the block editor
    // when the main text input focuses
    if (this._scrollViewRef) {
      this._scrollViewRef.props.scrollToEnd();
    }
  };

  _handleCardChange = changes => {
    this.setState(state => {
      return {
        ...state,
        card: {
          ...state.card,
          ...changes,
        },
      };
    });
  };

  _toggleHeaderExpanded = () =>
    this.setState(state => {
      return { ...state, isHeaderExpanded: !state.isHeaderExpanded };
    });

  render() {
    const { deck, card, isEditingBlock, isHeaderExpanded } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <CardHeader
          card={card}
          expanded={isHeaderExpanded}
          onPressBack={() => this.props.navigation.goBack()}
          onPressTitle={this._toggleHeaderExpanded}
          onChange={this._handleCardChange}
        />
        <KeyboardAwareScrollView
          style={styles.scrollView}
          enableAutomaticScroll={false}
          contentContainerStyle={{ flex: 1 }}
          innerRef={ref => (this._scrollViewRef = ref)}>
          <View style={styles.scene}>
            <ActionButton>Edit Scene</ActionButton>
          </View>
          <View style={styles.description}>
            {isEditingBlock ? (
              <EditBlock
                deck={deck}
                onDismiss={this._handleDismissEditing}
                onTextInputFocus={this._handleBlockTextInputFocus}
              />
            ) : (
              <CardBlocks card={card} onSelectBlock={this._handleEditBlock} />
            )}
          </View>
          <View style={styles.actions}>
            <ActionButton onPress={this._handleEditBlock}>Add Block</ActionButton>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

export default withNavigation(CreateCardScreen);
