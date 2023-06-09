import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { captureScreen } from 'react-native-view-shot';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import Editor from './components/Editor';
import Widget from './components/Widget';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://5f5d9a739f4a4b2ca5605363a6ab3de4@o542627.ingest.sentry.io/4505050929627136',
  tracesSampleRate: 1.0,
  enableNative: false,
});

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
      Sentry.captureException(e);

      setWidgetVisible(true);
    }
  };

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999999999,
  },
});

export default Ruttl;
