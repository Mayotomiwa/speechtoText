import { sendToGoogleAPI } from '@/data/Data';
import Voice from '@react-native-voice/voice';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

const SpeechToTextApp = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    console.log('Speech started');
    setIsListening(true);
  };

  const onSpeechEnd = () => {
    console.log('Speech ended');
    setIsListening(false);
  };

  const onSpeechError = (e: any) => {
    console.error(e);
    Alert.alert('Error', 'There was an error with speech recognition.');
  };

  const onSpeechResults = async (e: any) => {
    const results = e.value;
    if (results && results.length > 0) {
      const recognizedText = results[0];
      console.log('Recognized: ', recognizedText);

      try {
        const transcription = await sendToGoogleAPI(recognizedText);
        setTranscription(transcription);
      } catch (error) {
        console.error('Error transcribing:', error);
      }
    }
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Speech to Text</Text>
      <Button
        title={isListening ? 'Stop Listening' : 'Start Listening'}
        onPress={isListening ? stopListening : startListening}
      />
      <Text style={styles.transcription}>{transcription}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  transcription: {
    marginTop: 20,
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
});

export default SpeechToTextApp;
