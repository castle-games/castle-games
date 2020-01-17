import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  container: {},
  cardTop: {
    width: '100%',
    height: 54,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: '#f2f2f2',
    position: 'absolute',
    top: 0,
  },
  header: {
    height: 54,
    flexShrink: 0,
    flexDirection: 'row',
  },
  back: {
    flexShrink: 0,
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
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

const CardHeader = props => {
  return (
    <View style={styles.container}>
      <View style={styles.cardTop} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={props.onPressBack}>
          <FastImage
            style={{
              width: 22,
              aspectRatio: 1,
            }}
            source={require('../assets/images/arrow-left.png')}
          />
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>@irondavy/green-river</Text>
        </View>
      </View>
    </View>
  );
};

export default CardHeader;
