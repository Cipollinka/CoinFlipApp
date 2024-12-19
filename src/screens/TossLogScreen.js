import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns'; 
import goldCoin from '../assets/icons/goldCoinTail.png';
import silverCoin from '../assets/icons/silverCoinTail.png';

const coins = [
  {
    id: 1,
    image: goldCoin, 
  },
  {
    id: 2,
    image: silverCoin, 
  },
];

const TossLogScreen = () => {
  const [logs, setLogs] = useState([]);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await AsyncStorage.getItem('flipLogs');
        const logs = data ? JSON.parse(data) : [];

        logs.sort((a, b) => new Date(b.date) - new Date(a.date));

        setLogs(logs);
      } catch (error) {
        console.error('Error loading flip logs:', error);
      }
    };

    loadLogs();
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 16, width: '95%', paddingVertical: dimensions.width * 0.1 }}>
      {logs.map((log, index) => {
        const coin = coins.find((coin) => coin.id === Number(log.coinId));

        if (!coin) {
          console.log(`No coin found for coinId: ${log.coinId}`);
        }

        return (
          <View
            key={index}
            style={{
              marginBottom: 16,
              padding: 10,
              backgroundColor: '#4a56ba',
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {coin ? (
              <Image
              source={coin.image} 
              style={{ width: '30%', height: undefined, aspectRatio: 1, marginRight: 10 }} 
              resizeMode='contain' 
            />
            
            ) : (
              <Text>No coin image</Text> 
            )}
            <View>

              <Text style={{fontFamily: 'Montserrat-Regular', textAlign: 'center', fontSize: dimensions.width * 0.035, backgroundColor: '#3E49AB', color: 'white', padding: dimensions.width * 0.025, borderRadius: dimensions.width * 0.03}}>{format(new Date(log.date), 'dd.MM.yyyy - HH:mm')}</Text>
              <Text style={{fontFamily: 'Montserrat-Regular', fontSize: dimensions.width * 0.04,color: 'white', paddingVertical: dimensions.width * 0.01 }}>{log.type}</Text>
              {log.type === 'One flip' && <Text style={{fontFamily: 'Montserrat-Black', fontSize: dimensions.width * 0.08,color: 'white', paddingVertical: dimensions.width * 0.01, textTransform: 'uppercase' }}>{log.result}</Text>}
              {(log.type === 'Multiple' || log.type === '3 in a row') && (
                <>
                  <Text style={{fontFamily: 'Montserrat-Black', fontSize: dimensions.width * 0.08,color: 'white',  }}>HEADS: {log.headsCount}</Text>
                  <Text style={{fontFamily: 'Montserrat-Black', fontSize: dimensions.width * 0.08,color: 'white',  }}>TAILS: {log.tailsCount}</Text>
                </>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default TossLogScreen;
