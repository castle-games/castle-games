import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import AddBlockPlaceholder from './AddBlockPlaceholder';
import EditBlock from './EditBlock';

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

  render() {
    const { isEditingBlock } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.scene}>
          <ActionButton>Edit Scene</ActionButton>
        </View>
        <View style={styles.description}>
          {/* TODO: list all the existing blocks for the card. */}
          {isEditingBlock ? <EditBlock /> : <AddBlockPlaceholder onPress={this._handleEditBlock} />}
        </View>
        <View style={styles.actions}>
          <ActionButton onPress={this._handleEditBlock}>Add Block</ActionButton>
        </View>
      </View>
    );
  }
}

export default CreateCardScreen;
