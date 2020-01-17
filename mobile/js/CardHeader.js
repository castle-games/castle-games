import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

const styles = StyleSheet.create({
  header: {
    height: 32,
    flexShrink: 0,
    flexDirection: 'row',
  },
  back: {
    flexShrink: 0,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    width: '100%',
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -32, // required to center properly with back button
    zIndex: -1, // required to prevent negative margin from blocking back button
  },
});

const CardHeader = props => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.back} onPress={props.onPressBack}>
        <FastImage
          style={{
            width: 16,
            aspectRatio: 1,
          }}
          source={require('../assets/images/arrow-left.png')}
        />
      </TouchableOpacity>
      <View style={styles.name}>
        <Text>@irondavy/green-river</Text>
      </View>
    </View>
  );
};

export default CardHeader;
