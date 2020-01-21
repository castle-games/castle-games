import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  inputLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 8,
    color: '#888',
  },
  input: {
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#888',
    padding: 8,
    color: '#fff',
  },
});

const CardInput = props => {
  const { label } = props;
  return (
    <View>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#666" {...props} />
    </View>
  );
};

const ConfigureCard = props => {
  return (
    <View style={{ minHeight: 48, padding: 16, marginTop: 42, marginBottom: 16 }}>
      <CardInput
        label="Short Name"
        placeholder="Choose a name for this card"
        value={props.card.title}
        onChangeText={title => props.onChange({ title })}
      />
    </View>
  );
};

const CardHeader = props => {
  const { card, expanded } = props;
  const title = card.title ? card.title : 'Untitled Card';
  return (
    <View style={styles.container}>
      <View style={styles.drawer}>
        {expanded ? <ConfigureCard card={card} onChange={props.onChange} /> : null}
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
          <Text style={styles.name}>{title}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CardHeader;
