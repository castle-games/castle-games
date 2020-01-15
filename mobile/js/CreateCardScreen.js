import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import CardBlocks from './CardBlocks';
import EditBlock from './EditBlock';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

const ActionButton = props => {
  const buttonProps = { ...props, children: undefined };
  return (
    <TouchableOpacity style={styles.button} {...buttonProps}>
      <Text style={styles.buttonLabel}>{props.children}</Text>
    </TouchableOpacity>
  );
};

class CreateCardScreen extends React.Component {
  state = {
    isEditingBlock: false,
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

  render() {
    const { isEditingBlock } = this.state;
    return (
      <KeyboardAwareScrollView
        style={styles.container}
        enableAutomaticScroll={false}
        contentContainerStyle={{ flex: 1 }}
        innerRef={ref => (this._scrollViewRef = ref)}>
        <View style={styles.scene}>
          <ActionButton>Edit Scene</ActionButton>
        </View>
        <View style={styles.description}>
          {/* TODO: list all the existing blocks for the card. */}
          {isEditingBlock ? (
            <EditBlock
              onDismiss={this._handleDismissEditing}
              onTextInputFocus={this._handleBlockTextInputFocus}
            />
          ) : (
            <CardBlocks onSelectBlock={this._handleEditBlock} />
          )}
        </View>
        <View style={styles.actions}>
          <ActionButton onPress={this._handleEditBlock}>Add Block</ActionButton>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default CreateCardScreen;
