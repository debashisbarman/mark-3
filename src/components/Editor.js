import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Appbar,
  Button,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { Path, Svg } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import axios from 'axios';

const height = Dimensions.get('window').height * 0.72; // reduce height by 30%

const aspectRatio =
  Dimensions.get('window').width / Dimensions.get('window').height;

const width = height * aspectRatio;

const Colors = ['#160647', '#FF4F6D', '#FCFF52'];

const InitialColor = '#FF4F6D';

const Editor = ({ reset, src = '', visible }) => {
  const [comment, setComment] = useState('');

  const [currentPath, setCurrentPath] = useState([]);

  const [expanded, setExpanded] = useState(false);

  const [loading, setLoading] = useState(false);

  const [paths, setPaths] = useState([]);

  const [selectedColor, setSelectedColor] = useState(InitialColor);

  const theme = useTheme();

  const viewRef = useRef();

  const withAnim = useRef(new Animated.Value(40)).current;

  const onChangeSelectedColor = color => () => {
    setExpanded(false);

    setSelectedColor(color);
  };

  const onClear = () => {
    setComment('');

    setCurrentPath([]);

    setLoading(false);

    setPaths([]);

    setSelectedColor(InitialColor);
  };

  const onReset = () => {
    onClear();

    reset();
  };

  const onUndo = () => {
    setPaths(state => state.slice(0, -1));
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      const uri = await captureRef(viewRef, {
        result: 'data-uri',
      });

      const apiClient = axios.create({
        baseURL:
          'https://us-central1-rally-brucira.cloudfunctions.net/mobile/projects/KSvxh2yzW2pGrY6E8if1',
      });

      const {
        data: { id: ticketID },
      } = await apiClient.post('/tickets', {
        comment,
        appVersion: '1.0.0',
        device: 'iPhone',
        height: Dimensions.get('window').height,
        osName: 'iOS',
        width: Dimensions.get('window').width,
      });

      await apiClient.post(`/tickets/${ticketID}/screenshot`, {
        image: uri,
      });

      Alert.alert('Successful');

      onReset();
    } catch (e) {
      Alert.alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onTouchMove = event => {
    const newPath = [...currentPath];

    const { locationX, locationY } = event.nativeEvent;

    const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(
      0,
    )},${locationY.toFixed(0)} `;

    newPath.push(newPoint);

    setCurrentPath(newPath);
  };

  const onTouchEnd = () => {
    const currentPaths = [...paths];

    const newPath = [...currentPath];

    currentPaths.push({ color: selectedColor, data: newPath });

    setPaths(currentPaths);

    setCurrentPath([]);
  };

  const toggleOpen = () => {
    setExpanded(state => !state);
  };

  useEffect(() => {
    Animated.timing(withAnim, {
      toValue: 40 * (expanded ? 3 : 1),
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.container}>
        <Appbar style={{ backgroundColor: 'transparent' }}>
          <Appbar.Action
            color={theme.colors.background}
            icon="close"
            onPress={onReset}
            style={{ marginRight: 'auto' }}
          />
          <Appbar.Action
            color={theme.colors.background}
            icon="undo-variant"
            onPress={onUndo}
          />
          <Animated.View
            style={[
              styles.buttonsContainer,
              {
                width: withAnim,
              },
            ]}>
            <TouchableRipple
              borderless={false}
              centered
              onPress={toggleOpen}
              style={[
                styles.button,
                {
                  backgroundColor: selectedColor,
                  borderColor: theme.colors.background,
                },
              ]}>
              <View />
            </TouchableRipple>
            {Colors.filter(c => c !== selectedColor).map((c, i) => (
              <TouchableRipple
                borderless={false}
                centered
                key={i}
                onPress={onChangeSelectedColor(c)}
                style={[
                  styles.button,
                  {
                    backgroundColor: c,
                    borderColor: theme.colors.background,
                  },
                ]}>
                <View />
              </TouchableRipple>
            ))}
          </Animated.View>
        </Appbar>
        <ScrollView
          contentContainerStyle={{ alignItems: 'center' }}
          style={styles.container}>
          <View
            style={styles.svgContainer}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}>
            <ImageBackground
              ref={viewRef}
              resizeMode="contain"
              source={{ uri: src }}>
              <Svg height={height} width={width}>
                <Path
                  d={currentPath.join('')}
                  stroke={selectedColor}
                  fill={'transparent'}
                  strokeWidth={4}
                  strokeLinejoin={'round'}
                  strokeLinecap={'round'}
                />
                {paths.length > 0 &&
                  paths.map(({ color, data }, index) => (
                    <Path
                      key={`path-${index}`}
                      d={data.join('')}
                      stroke={color}
                      fill={'transparent'}
                      strokeWidth={4}
                      strokeLinejoin={'round'}
                      strokeLinecap={'round'}
                    />
                  ))}
              </Svg>
            </ImageBackground>
          </View>
        </ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.footerContainer}>
          <TextInput
            mode="outlined"
            placeholder="Write a comment"
            onChangeText={setComment}
            style={{ flex: 1 }}
            value={comment}
          />
          <Button
            // disabled={comment === '' || loading}
            loading={loading}
            mode="contained"
            onPress={onSubmit}
            style={{ marginTop: 8, marginLeft: 8 }}>
            Add
          </Button>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  button: {
    height: 24,
    width: 24,
    marginHorizontal: 8,
    borderRadius: 24 / 2,
    borderWidth: 1,
  },
  svgContainer: {
    flex: 1,
    height,
    width,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
    paddingHorizontal: 16,
  },
});

export default Editor;
