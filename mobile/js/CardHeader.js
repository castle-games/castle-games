import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  container: {},
  drawer: {},
  cardTop: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#f2f2f2',
    flexShrink: 0,
  },
  fixedHeader: {
    width: '100%',
    height: 54,
    position: 'absolute',
    top: 0,
    height: 54,
    flexDirection: 'row',
  },
  back: {
    flexShrink: 0,
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    width: '100%',
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -54, // required to center properly with back button
    zIndex: -1, // required to prevent negative margin from blocking back button
  },
  name: {
    color: '#888',
  },
});

const ConfigureCard = props => {
  // TODO: this is the menu for changing a card's name, etc.
  return <View style={{ height: 128 }} />;
};

const CardHeader = props => {
  const { card, expanded } = props;
  return (
    <View style={styles.container}>
      <View style={styles.drawer}>
        {expanded ? <ConfigureCard /> : null}
        <View style={[styles.cardTop, { height: expanded ? 12 : 54 }]} />
      </View>
      <View style={styles.fixedHeader}>
        <TouchableOpacity style={styles.back} onPress={props.onPressBack}>
          <FastImage
            style={{
              width: 22,
              aspectRatio: 1,
            }}
            source={require('../assets/images/arrow-left.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.titleContainer} onPress={props.onPressTitle}>
          <Text style={styles.name}>{card.title}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CardHeader;
