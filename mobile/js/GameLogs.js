import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import throttle from 'lodash.throttle';

import * as Constants from './Constants';
import * as GhostEvents from './ghost/GhostEvents';

const styles = StyleSheet.create({
  logItem: {
    fontFamily: Constants.iOS ? 'Courier' : 'monospace',
    lineHeight: 16,
    fontSize: 12,
    color: '#fff',
  },
  logItemError: {
    color: '#f00',
  },
  logItemSystem: {
    color: '#f0f',
  },
});

const LogItem = props => {
  let logStyles = [styles.logItem];
  if (props.type == 'ERROR') logStyles.push(styles.logItemError);
  if (props.type == 'SYSTEM') logStyles.push(styles.logItemSystem);

  return (
    <View style={{ flexDirection: 'row', paddingVertical: 4 }}>
      <Text style={logStyles}>{props.body}</Text>
    </View>
  );
};

let nextId = 0;

const logs = [];

export default GameLogs = ({ eventsReady, visible }) => {
  const flatListRef = useRef(null);

  const [atEnd, setAtEnd] = useState(true);
  const onScroll = ({ nativeEvent: { layoutMeasurement, contentOffset, contentSize } }) => {
    setAtEnd(layoutMeasurement.height + contentOffset.y >= contentSize.height - 16);
  };

  const [refreshCount, setRefreshCount] = useState(0);
  const refresh = useMemo(
    () =>
      throttle(() => {
        setRefreshCount(refreshCount => refreshCount + 1);
        if (atEnd) {
          setTimeout(
            () =>
              flatListRef.current &&
              logs.length > 0 &&
              flatListRef.current.scrollToIndex({
                animated: true,
                index: 0,
                viewOffset: 0,
                viewPosition: 1,
              }),
            100
          );
        }
      }, 100),
    [setRefreshCount, flatListRef]
  );

  const pushLog = log => {
    logs.unshift(log);
    logs.length = Math.min(logs.length, 400);
    refresh();
  };

  GhostEvents.useListen({
    eventsReady,
    eventName: 'GHOST_PRINT',
    handler: params => pushLog({ id: nextId++, type: 'PRINT', body: params.join(' ') }),
  });

  GhostEvents.useListen({
    eventsReady,
    eventName: 'GHOST_ERROR',
    handler: ({ error, stacktrace }) => pushLog({ id: nextId++, type: 'ERROR', body: error }),
  });

  const onPressClear = () => {
    logs.length = 0;
    refresh();
  };

  return visible ? (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 300,
        maxHeight: '80%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingTop: 12,
        borderBottomWidth: 2,
        borderColor: '#444',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderColor: '#444',
        }}>
        <TouchableOpacity onPress={onPressClear}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Clear</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        onScroll={onScroll}
        data={logs}
        inverted
        renderItem={({ item }) => <LogItem type={item.type} body={item.body} />}
        style={{ height: '50%' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      />
    </View>
  ) : null;
};
