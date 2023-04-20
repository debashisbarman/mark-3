import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Draggable from 'react-native-draggable';

const Widget = ({ visible, onPress }) => {
  const theme = useTheme();

  if (visible) {
    return (
      <Draggable
        imageSource={require('../assets/ic_bug.png')}
        isCircle
        minX={0}
        minY={0}
        maxX={Dimensions.get('window').width}
        maxY={Dimensions.get('window').height}
        onShortPressRelease={onPress}
        renderColor={theme.colors.tertiary}
        renderSize={72}
        touchableOpacityProps={{ activeOpacity: 0 }}
        x={Dimensions.get('window').width - (72 + 16)}
        y={Dimensions.get('window').height - (72 + 16)}
        z={999999999}>
        <View
          elevation={8}
          style={[
            styles.buttonContainer,
            { backgroundColor: theme.colors.tertiary },
          ]}>
          <Image
            source={require('../assets/ic_bug.png')}
            style={{
              width: 32,
              height: 32,
            }}
          />
        </View>
      </Draggable>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    height: 72,
    width: 72,
    borderRadius: 72 / 2,
    zIndex: 1,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 72,
    width: 72,
    borderRadius: 72 / 2,
    zIndex: 1,
  },
  icon: {
    height: 42,
    width: 42,
  },
});

export default Widget;
