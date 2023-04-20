import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { captureScreen } from 'react-native-view-shot';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import Editor from './components/Editor';
import Widget from './components/Widget';

const Ruttl = () => {
  const [src, setSrc] = useState('');

  const [visible, setVisible] = useState(false);

  const [widgetVisible, setWidgetVisible] = useState(true);

  const onReset = async () => {
    try {
      setSrc('');

      setVisible(false);

      setWidgetVisible(true);
    } catch (e) {
      Alert.alert(e.toString());
    }
  };

  const onScreenCapture = async () => {
    try {
      setWidgetVisible(false);

      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });

      const uri = await captureScreen({
        handleGLSurfaceViewOnAndroid: true,
        quality: 1,
      });

      setSrc(uri);

      setVisible(true);
    } catch (e) {
      Alert.alert('Something went wrong!');
    }
  };

  return (
    <View style={{ position: 'absolute', zIndex: 999999999 }}>
      <PaperProvider
        theme={{
          ...MD3LightTheme,
          colors: {
            ...MD3LightTheme.colors,
            primary: '#6552ff',
            background: '#ffffff',
            surface: '#ffffff',
            surfaceDisabled: 'rgb(229, 225, 236)',
            tertiary: '#160647',
          },
          roundness: 50,
        }}
      >
        <Editor reset={onReset} src={src} visible={visible} />
        <Widget onPress={onScreenCapture} visible={widgetVisible} />
      </PaperProvider>
    </View>
  );
};

export default Ruttl;
