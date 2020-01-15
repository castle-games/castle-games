import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import AddBlockPlaceholder from './AddBlockPlaceholder';

const styles = StyleSheet.create({
  textBlock: {
    backgroundColor: '#fff',
    borderRadius: 6,
    width: '100%',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
  },
  textBlockDescription: {
    color: '#000',
  },
});

// TODO: get from server
const DUMMY_BLOCKS = [
  {
    type: 'text',
    description: 'Your wagon is stopped by a river with a width of 628 ft and a depth of 4.8 ft.',
  },
];

const CardBlock = props => {
  const { block } = props;
  return (
    <View style={styles.textBlock}>
      <Text style={styles.textBlockDescription}>{block.description}</Text>
    </View>
  );
};

const CardBlocks = props => {
  const card = props.card || {};
  // card.blocks = DUMMY_BLOCKS;
  if (card.blocks && card.blocks.length) {
    return (
      <React.Fragment>
        {card.blocks.map((block, ii) => (
          <CardBlock key={ii} block={block} />
        ))}
      </React.Fragment>
    );
  } else {
    return <AddBlockPlaceholder onPress={props.onSelectBlock} />;
  }
};

export default CardBlocks;
