import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [volume, setVolume] = useState(1.0); 

  useEffect(() => {
    const loadVolume = async () => {
      try {
        const storedVolume = await AsyncStorage.getItem('volume');
        if (storedVolume !== null) {
          setVolume(parseFloat(storedVolume));
        }
      } catch (error) {
        console.log('Error loading volume:', error);
      }
    };
    loadVolume();
  }, []);

  const handleSetVolume = async (value) => {
    try {
      await AsyncStorage.setItem('volume', value.toString());
      setVolume(value);
    } catch (error) {
      console.log('Error saving volume:', error);
    }
  };

  return (
    <AudioContext.Provider value={{ volume, setVolume: handleSetVolume }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
