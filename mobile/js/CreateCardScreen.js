import React from 'react';
import gql from 'graphql-tag';
import { View, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SafeAreaView from 'react-native-safe-area-view';
import uuid from 'uuid/v4';
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
    width: '100%',
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const CARD_FRAGMENT = `
  cardId
  title
  blocks {
    cardBlockId
    cardBlockUpdateId
    type
    title
    destinationCardId
  }
`;

const saveDeck = async (card, deck) => {
  const deckUpdateFragment = {
    title: deck.title,
  };
  const cardUpdateFragment = {
    title: card.title,
    blocks: card.blocks.map((block) => {
      return {
        type: block.type,
        destinationCardId: block.destinationCardId,
        title: block.title,
        createDestinationCard: block.createDestinationCard,
        cardBlockUpdateId: block.cardBlockUpdateId,
      };
    }),
  };
  if (deck.deckId && card.cardId) {
    // update existing card in deck
    const result = await Session.apolloClient.mutate({
      mutation: gql`
        mutation UpdateCard($cardId: ID!, $card: CardInput!) {
          updateCard(
            cardId: $cardId,
            card: $card
          ) {
            ${CARD_FRAGMENT}
          }
        }
      `,
      variables: { cardId: card.cardId, card: cardUpdateFragment },
    });
    let updatedCard,
      newCards = [...deck.cards];
    result.data.updateCard.forEach((updated) => {
      let existingIndex = deck.cards.findIndex((old) => old.cardId === updated.cardId);
      if (existingIndex > 0) {
        newCards[existingIndex] = updated;
      } else {
        newCards.push(updated);
      }
      if (updated.cardId === card.cardId) {
        updatedCard = updated;
      }
    });
    return {
      card: updatedCard,
      deck: {
        ...deck,
        cards: newCards,
      },
    };
  } else if (deck.deckId) {
    // TODO: add a card to an existing deck
  } else {
    // no existing deckId or cardId, so create a new deck
    // and add the card to it.
    const result = await Session.apolloClient.mutate({
      mutation: gql`
        mutation CreateDeck($deck: DeckInput!, $card: CardInput!) {
          createDeck(
            deck: $deck,
            card: $card
          ) {
            deckId
            title
            cards {
              ${CARD_FRAGMENT}
            }
          }
        }
      `,
      variables: { deck: deckUpdateFragment, card: cardUpdateFragment },
    });
    let newCard;
    if (result.data.createDeck.cards.length > 1) {
      // if the initial card contained references to other cards,
      // we can get many cards back here. we care about the non-empty one
      newCard = result.data.createDeck.cards.find((card) => card.blocks && card.blocks.length > 0);
    } else {
      newCard = result.data.createDeck.cards[0];
    }
    return {
      card: newCard,
      deck: result.data.createDeck,
    };
  }
};

const getDeckById = async (deckId) => {
  const result = await Session.apolloClient.query({
    query: gql`
      query GetDeckById($deckId: ID!) {
        deck(deckId: $deckId) {
          deckId
          title
          cards {
            ${CARD_FRAGMENT}
          }
        }
      }
    `,
    variables: { deckId },
    fetchPolicy: 'no-cache',
  });
  return result.data.deck;
};

const ActionButton = (props) => {
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

const EMPTY_BLOCK = {
  title: null,
  type: 'text',
  destination: null,
};

class CreateCardScreen extends React.Component {
  state = {
    deck: EMPTY_DECK,
    card: EMPTY_CARD,
    isEditingBlock: false,
    blockIdToEdit: null,
    isHeaderExpanded: false,
  };

  componentDidMount() {
    this._mounted = true;
    this._update(null, this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    this._update(prevProps, this.props);
  }

  componentWillUnmount() {
    this._mounted = false;
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
          card = deck.cards.find((card) => card.cardId == params.cardIdToEdit);
        } catch (_) {}
      }
      this._mounted && this.setState({ deck, card });
    }
  };

  _handlePublish = async () => {
    await this._handleDismissEditing();
    const { card, deck } = await saveDeck(this.state.card, this.state.deck);
    if (!this._mounted) return;
    return this.setState({ card, deck });
  };

  _handlePublishAndGoToDestination = async (blockToFollow) => {
    // flag this block so we can follow it after saving
    const cardBlockUpdateId = uuid();
    await this._handleBlockChange({
      ...blockToFollow,
      cardBlockUpdateId,
    });
    await this._handlePublish();
    if (!this._mounted) return;
    const updatedBlock = this.state.card.blocks.find(
      (block) => block.cardBlockUpdateId === cardBlockUpdateId
    );
    if (updatedBlock && updatedBlock.destinationCardId) {
      setTimeout(() => {
        this.props.navigation.push('CreateCard', {
          deckIdToEdit: this.state.deck.deckId,
          cardIdToEdit: updatedBlock.destinationCardId,
        });
      }, 100);
    }
  };

  _handleEditBlock = (blockIdToEdit) => this.setState({ isEditingBlock: true, blockIdToEdit });

  _handleDismissEditing = () => {
    return this.setState((state) => {
      // making a block empty is the same as deleting it
      const blocks = state.card.blocks.filter((block) => block.title && block.title.length > 0);
      return {
        ...state,
        isEditingBlock: false,
        blockToEdit: null,
        card: {
          ...state.card,
          blocks,
        },
      };
    });
  };

  _handleBlockTextInputFocus = () => {
    // we want to scroll to the very bottom of the block editor
    // when the main text input focuses
    if (this._scrollViewRef) {
      this._scrollViewRef.props.scrollToEnd();
    }
  };

  _handleCardChange = (changes) => {
    this.setState((state) => {
      return {
        ...state,
        card: {
          ...state.card,
          ...changes,
        },
      };
    });
  };

  _handleBlockChange = (block) => {
    return this.setState((state) => {
      const blocks = [...state.card.blocks];
      let existingIndex = -1;
      let blockIdToEdit = state.blockIdToEdit;
      if (block.cardBlockId) {
        existingIndex = blocks.findIndex((existing) => existing.cardBlockId === block.cardBlockId);
      }
      if (existingIndex >= 0) {
        blocks[existingIndex] = block;
      } else {
        blockIdToEdit = String(uuid());
        blocks.push({ ...block, cardBlockId: blockIdToEdit });
      }
      return {
        ...state,
        blockIdToEdit,
        card: {
          ...state.card,
          blocks,
        },
      };
    });
  };

  _handlePressBackground = () => {
    if (this.state.isEditingBlock) {
      this._handleDismissEditing();
    } else if (this.state.isHeaderExpanded) {
      this.setState({ isHeaderExpanded: false });
    }
  };

  _toggleHeaderExpanded = () =>
    this.setState((state) => {
      return { ...state, isHeaderExpanded: !state.isHeaderExpanded };
    });

  render() {
    const { deck, card, isEditingBlock, blockIdToEdit, isHeaderExpanded } = this.state;
    const blockToEdit =
      isEditingBlock && blockIdToEdit
        ? card.blocks.find((block) => block.cardBlockId === blockIdToEdit)
        : EMPTY_BLOCK;
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
          innerRef={(ref) => (this._scrollViewRef = ref)}>
          <TouchableWithoutFeedback onPress={this._handlePressBackground}>
            <View style={styles.scene}>
              <ActionButton>Edit Scene</ActionButton>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.description}>
            {isEditingBlock ? (
              <EditBlock
                deck={deck}
                block={blockToEdit}
                onDismiss={this._handleDismissEditing}
                onTextInputFocus={this._handleBlockTextInputFocus}
                onChangeBlock={this._handleBlockChange}
                onGoToDestination={() => this._handlePublishAndGoToDestination(blockToEdit)}
              />
            ) : (
              <CardBlocks card={card} onSelectBlock={this._handleEditBlock} />
            )}
          </View>
          <View style={styles.actions}>
            <ActionButton onPress={() => this._handleEditBlock(null)}>Add Block</ActionButton>
            <ActionButton onPress={this._handlePublish}>Publish</ActionButton>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

export default withNavigation(CreateCardScreen);
