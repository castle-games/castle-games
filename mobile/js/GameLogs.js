import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import debounce from 'lodash.debounce';
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

  const [refreshCount, setRefreshCount] = useState(0);
  const refresh = useMemo(() => {
    const f = () => setRefreshCount(refreshCount => refreshCount + 1);
    const t = throttle(f, 250);
    const d = debounce(f, 100);
    return () => {
      t();
      d();
    };
  }, []);

  const pushLog = log => {
    logs.unshift(log);
    logs.length = Math.min(logs.length, 100);
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
        paddingTop: 8,
        borderBottomWidth: 1,
        borderColor: '#444',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderColor: '#222',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={onPressClear}>
          <Text style={{ color: '#bbb' }}>Clear</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={logs}
        inverted
        renderItem={({ item }) => <LogItem type={item.type} body={item.body} />}
        style={{ height: '50%' }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      />
    </View>
  ) : null;
};
