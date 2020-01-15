import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import AddBlockPlaceholder from './AddBlockPlaceholder';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  choiceBlock: {
    backgroundColor: '#000',
    borderRadius: 6,
    width: '100%',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  choiceBlockDescription: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
  },
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
    marginBottom: 4,
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
  {
    type: 'choice',
    description: 'Take a ferry across',
  },
  {
    type: 'choice',
    description: 'Attempt to ford the river',
  },
  {
    type: 'choice',
    description: 'Caulk wagon and float it across',
  },
];

const CardBlock = props => {
  const { block } = props;
  let blockStyles, textStyles;
  switch (block.type) {
    case 'choice': {
      return (
        <View style={[styles.choiceBlock, props.style]}>
          <FastImage
            style={{
              width: 12,
              aspectRatio: 1,
            }}
            source={require('../assets/images/add.png')}
          />
          <Text style={styles.choiceBlockDescription}>{block.description}</Text>
        </View>
      );
    }
    case 'text':
    default: {
      return (
        <View style={[styles.textBlock, props.style]}>
          <Text style={styles.textBlockDescription}>{block.description}</Text>
        </View>
      );
      break;
    }
  }
};

const CardBlocks = props => {
  const card = props.card || {};
  // card.blocks = DUMMY_BLOCKS;
  if (card.blocks && card.blocks.length) {
    const orderedBlocks = card.blocks.sort((a, b) => a.type - b.type);
    return (
      <React.Fragment>
        {orderedBlocks.map((block, ii) => {
          const prevBlockType = ii > 0 ? orderedBlocks[ii - 1].type : block.type;
          const styles = block.type !== prevBlockType ? { marginTop: 8 } : null;
          return <CardBlock key={ii} block={block} style={styles} />;
        })}
      </React.Fragment>
    );
  } else {
    return <AddBlockPlaceholder onPress={props.onSelectBlock} />;
  }
};

export default CardBlocks;
