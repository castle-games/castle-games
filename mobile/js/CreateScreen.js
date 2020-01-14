import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';

const CreateScreen = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.push('CreateCard');
        }}>
        <Text>Create New Card</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateScreen;
