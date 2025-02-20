import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Share,
  Animated,
  Easing,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';




import SettingsScreen from './SettingsScreen';
import LoreScreen from './LoreScreen';
import TossLogScreen from './TossLogScreen';
import Sound from 'react-native-sound';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const coins = [
  {
    id: 1,
    frontImage: require('../assets/icons/goldCoinHead.png'),
    backImage: require('../assets/icons/goldCoinTail.png'),
  },
  {
    id: 2,
    frontImage: require('../assets/icons/silverCoinHead.png'),
    backImage: require('../assets/icons/silverCoinTail.png'),
  },
];

const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreen, setSelectedScreen] = useState('Home');
  const [previousSelectedScreen, setPreviousSelectedScreen] = useState('Home');
  const [screenTitle, setScreenTitle] = useState('COIN FLIP');
  const [currentCoin, setCurrentCoin] = useState(null);
  const [currentHomeCoin, setCurrentHomeCoin] = useState(null);
  const [flipSide, setFlipSide] = useState('...');
  const [selectedMode, setSelectedMode] = useState('One flip');
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const [gameHeadsCount, setGameHeadsCount] = useState(0);
  const [gameTailsCount, setGameTailsCount] = useState(0);

  const [gameHeadsCountSAVE, setGameHeadsCountSAVE] = useState(0);
  const [gameTailsCountSAVE, setGameTailsCountSAVE] = useState(0);

  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [currentMultipleFlipIndex, setCurrentMultipleFlipIndex] = useState(1);
  const [thisCoinId, setThisCoinId] = useState(1);
  const [multipleCoin1, setMultipleCoin1] = useState(null)
  const [multipleCoin2, setMultipleCoin2] = useState(null)
  const [multipleCoin3, setMultipleCoin3] = useState(null)
  const [isSaved, setIsSaved] = useState(false)

  const [isSoundEnabled, setSoundEnabled] = useState(true);
  const [isVibrationEnabled, setVibrationEnabled] = useState(true);


  const saveFlipData = async (flipData) => {
    setIsSaved(false);
    try {
      const existingData = await AsyncStorage.getItem('flipLogs');
      const logs = existingData ? JSON.parse(existingData) : [];
      logs.push(flipData);

      await AsyncStorage.setItem('flipLogs', JSON.stringify(logs));

      await new Promise((resolve) => {

        resolve();
      });

      setIsSaved(true);
    } catch (error) {
      console.error('Error saving flip data:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const soundValue = await AsyncStorage.getItem('isSoundEnabled');
      const vibrationValue = await AsyncStorage.getItem('isVibrationEnabled');

      if (soundValue !== null) setSoundEnabled(JSON.parse(soundValue));
      if (vibrationValue !== null) setVibrationEnabled(JSON.parse(vibrationValue));
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [selectedScreen]);


  const handleFlipResult = async (type, coinId, flipSide, headsCount, tailsCount) => {
    const date = new Date().toISOString();
    let flipData;

    console.log('Heads Count:', headsCount);
    console.log('Tails Count:', tailsCount);

    switch (type) {
      case 'One flip':
        flipData = {
          date,
          coinId,
          type,
          result: flipSide,
        };
        break;

      case 'Multiple':
        flipData = {
          date,
          coinId,
          type,
          headsCount,
          tailsCount,
        };
        break;

      case '3 in a row':
        flipData = {
          date,
          coinId,
          type,
          headsCount,
          tailsCount,
        };
        break;

      default:
        console.error('Unknown flip type:', type);
        return;
    }

    await saveFlipData(flipData);
  };

  const onFlipComplete = (selectedMode, coinId, flipSide, headsCount, tailsCount) => {
    handleFlipResult(selectedMode, coinId, flipSide, headsCount, tailsCount);
    console.log(`data for save:\nselectedMode is ${selectedMode}\ncoinId is ${coinId}\nflipSide is ${flipSide}\nheadsCount is${headsCount}\ntailsCount is ${tailsCount} `)
  };


  useEffect(() => {
    console.log(`isSound is ` + isSoundEnabled)
  }, [isSoundEnabled])

  const [flipSides, setFlipSides] = useState(['...', '...', '...']);
  const flipAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const startMultipleFlips = async () => {
    setGameHeadsCount((prevCount) => {
      const newCount = 0;
      console.log(`Updated Heads Count: ${newCount}`);
      return newCount;
    });
    setGameTailsCount((prevCount) => {
      const newCount = 0;
      console.log(`Updated Tails Count: ${newCount}`);
      return newCount;
    });
    setIsFlipping(true);
    const flipsCount = flipSides.length;

    let headsCoun = 0;
    let tailsCoun = 0;

    for (let i = 0; i < flipsCount; i++) {
      await new Promise((resolve) => {

        if (isSoundEnabled) playFlipSound();
        if (isVibrationEnabled) {
          ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
          });
        }
        Animated.sequence([
          Animated.timing(flipAnimations[i], {
            toValue: 180,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(flipAnimations[i], {
            toValue: 360,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]).start(() => {
          flipAnimations[i].setValue(0);
          const result = Math.random() > 0.5 ? 'Head' : 'Tail';
          setFlipSide(result);

          if (result === 'Head') {
            headsCoun += 1;
            console.log(`heads coun is ${headsCoun}`)
            setGameHeadsCount((prevCount) => {
              const newCount = prevCount + 1;
              console.log(`Updated Heads Count: ${newCount}`);
              return newCount;
            });
          } else {
            tailsCoun += 1;
            console.log(`tails coun is ${tailsCoun}`)
            setGameTailsCount((prevCount) => {
              const newCount = prevCount + 1;
              console.log(`Updated Tails Count: ${newCount}`);
              return newCount;
            });

          }


          if (result === 'Head') {
            setHeadsCount((prevCount) => prevCount + 1);
          } else {
            setTailsCount((prevCount) => prevCount + 1);
          }

          setFlipSides((prev) => {
            const updated = [...prev];
            updated[i] = result;
            return updated;
          });
          resolve();
        });
      });
    }

    setIsFlipping(false);
    onFlipComplete(selectedMode, thisCoinId, null, headsCoun, tailsCoun)
  };

  const flipInterpolations = flipAnimations.map((anim) =>
    anim.interpolate({
      inputRange: [0, 180, 360],
      outputRange: ['0deg', '180deg', '360deg'],
    })
  );


  const startThreeInARow = async () => {
    setGameHeadsCount(0);
    setGameTailsCount(0);
    setIsFlipping(true);
    var headsCoun = 0;
    var tailsCoun = 0;
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => {
        if (isSoundEnabled) playFlipSound();
        if (isVibrationEnabled) {
          ReactNativeHapticFeedback.trigger("impactLight", {
            enableVibrateFallback: true,
            ignoreAndroidSystemSettings: false,
          });
        }

        Animated.sequence([
          Animated.timing(flipAnimation, {
            toValue: 180,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(flipAnimation, {
            toValue: 360,
            duration: 100,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]).start(() => {
          const result = Math.random() > 0.5 ? 'Head' : 'Tail';
          setFlipSide(result);
          if (result === 'Head') {
            headsCoun += 1;
            setHeadsCount(prev => prev + 1);
            setGameHeadsCount((prevCount) => {
              const newCount = prevCount + 1;
              console.log(`Updated Heads Count: ${newCount}`);
              return newCount;
            });

          } else {
            setTailsCount(prev => prev + 1);
            tailsCoun += 1;

            setGameTailsCount((prevCount) => {
              const newCount = prevCount + 1;
              console.log(`Updated Tails Count: ${newCount}`);
              return newCount;
            });

          }

          console.log(`gamemode is ${selectedMode} and heads is ${gameHeadsCount} tails is ${gameTailsCount}`)

          flipAnimation.setValue(0);
        });
        setTimeout(resolve, 1400);
      });
    }
    setIsFlipping(false);
    onFlipComplete(selectedMode, thisCoinId, 0, headsCoun, tailsCoun)

  };


  useEffect(() => {
    console.log("cur coin flip ind is " + currentMultipleFlipIndex)
  }, [currentMultipleFlipIndex])


  const playFlipSound = () => {
    const flipSound = new Sound('coinFlip.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Помилка: ', error.message, 'Код: ', error.code);
        return;
      }
      console.log('Звук завантажено успішно!');
      flipSound.play();
    });
  };

  useEffect(() => {
    console.log(`gamemode is ${selectedMode} and heads is ${gameHeadsCount} tails is ${gameTailsCount}`);
  }, [gameHeadsCount, gameTailsCount, selectedMode]);

  const startFlipAnimation = () => {

    setIsFlipping(true);
    setFlipSide('...');

    if (selectedMode === '3 in a row') {
      var headsCoun = 0;
      var tailsCoun = 0;
    } else if (selectedMode === 'One flip') {
      var monetFlipSide = '';
    }

    if (isSoundEnabled) playFlipSound();
    if (isVibrationEnabled) {
      ReactNativeHapticFeedback.trigger("impactLight", {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }

    Animated.sequence([
      Animated.timing(flipAnimation, {
        toValue: 180,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnimation, {
        toValue: 360,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const result = Math.random() > 0.5 ? 'Head' : 'Tail';
      setFlipSide(result);
      if (result === 'Head') {
        headsCoun += 1;
        setHeadsCount(prev => prev + 1);
        setGameHeadsCount((prevCount) => {
          const newCount = prevCount + 1;
          console.log(`Updated Heads Count: ${newCount}`);
          return newCount;
        });

      } else {
        setTailsCount(prev => prev + 1);
        tailsCoun += 1;

        setGameTailsCount((prevCount) => {
          const newCount = prevCount + 1;
          console.log(`Updated Tails Count: ${newCount}`);
          return newCount;
        });

      }

      console.log(`gamemode is ${selectedMode} and heads is ${gameHeadsCount} tails is ${gameTailsCount}`)

      if (selectedMode === 'One flip') {
        onFlipComplete(selectedMode, thisCoinId, result, gameHeadsCount, gameTailsCount)
        setIsFlipping(false);
      }
      flipAnimation.setValue(0);
    });


  };

  const flipInterpolation = flipAnimation.interpolate({
    inputRange: [0, 180, 360],
    outputRange: ['0deg', '180deg', '360deg'],
  });

  const currentImage = () => {
    return flipSide === 'Head'
      ? currentHomeCoin?.frontImage
      : currentHomeCoin?.backImage;
  }

  useEffect(() => {
    setMultipleCoin1(currentHomeCoin?.frontImage);
    setMultipleCoin2(currentHomeCoin?.frontImage);
    setMultipleCoin3(currentHomeCoin?.frontImage);
  }, [selectedMode])

  useEffect(() => {
    if (flipSide === 'Head') {
      if (currentMultipleFlipIndex === 1) {
        setMultipleCoin1(currentHomeCoin?.frontImage);
      } else if (currentMultipleFlipIndex === 2) {
        setMultipleCoin2(currentHomeCoin?.frontImage);
      } else if (currentMultipleFlipIndex === 3) {
        setMultipleCoin3(currentHomeCoin?.frontImage);
      }
    } else {
      if (currentMultipleFlipIndex === 1) {
        setMultipleCoin1(currentHomeCoin?.backImage);
      } else if (currentMultipleFlipIndex === 2) {
        setMultipleCoin2(currentHomeCoin?.backImage);
      } else if (currentMultipleFlipIndex === 3) {
        setMultipleCoin3(currentHomeCoin?.backImage);
      }
    }
  }, [currentMultipleFlipIndex, flipSide, currentHomeCoin]);


  useEffect(() => {
    const loadSelectedCoin = async () => {
      try {
        const coinId = await AsyncStorage.getItem('selectedCoin');
        if (coinId !== null) {
          const selected = coins.find(coin => coin.id === JSON.parse(coinId));
          if (selected) setCurrentHomeCoin(selected);
          setThisCoinId(coinId)
        } else setCurrentHomeCoin(coins.find(coin => coin.id === 1))
      } catch (error) {
        console.error("Error loading coin:", error);
      }
    };
    loadSelectedCoin();
  }, [selectedScreen]);


  useEffect(() => {
    console.log("selectet coin is " + currentHomeCoin)
  }, [currentHomeCoin])

  return (
    <ImageBackground
      source={require('../assets/backGroundImage/BackgroundFlipApp.png')}
      style={{ flex: 1, alignItems: 'center', width: '100%' }}
      resizeMode="cover"
    >
      <View style={{flex:1, width:'100%', height:'100%', position:'absolute', backgroundColor: 'black', opacity: 0.4}}/>
      <View
        className="bg-[#4a56ba] top-0 w-full py-2 pt-10 items-center" style={{ borderBottomLeftRadius: 25, borderBottomRightRadius: 25, }}
      >
        <View className="flex-row justify-around py-2 items-center mb-5">
          <View className="flex flex-row items-center justify-between w-full px-5">

            <TouchableOpacity
              onPress={async () => {
                if (selectedScreen === 'Home') {
                  const newSoundEnabledState = !isSoundEnabled;
                  setSoundEnabled(newSoundEnabledState);
                  try {
                    await AsyncStorage.setItem('isSoundEnabled', JSON.stringify(newSoundEnabledState));
                  } catch (error) {
                    console.error('Error saving sound state:', error);
                  }
                } else if (selectedScreen === 'Settings' || selectedScreen === 'TossLog') {
                  setSelectedScreen('Home');
                } else {
                  setSelectedScreen(previousSelectedScreen);
                }
              }}
              className="items-center p-2 h-12 w-12"
            >

              <Image
                source={selectedScreen === 'Home' ? (isSoundEnabled ? require('../assets/icons/volumeIcon.png') : require('../assets/icons/noVolumeIcon.png')) : require('../assets/icons/backIcon.png')}
                className="text-center h-10 w-10"
                resizeMode="contain"
              />


            </TouchableOpacity>

            <Text
              className="text-white  "
              style={[
                styles.generalText(dimensions),
                { fontFamily: 'Montserrat-Black', fontSize: dimensions.width * 0.07, paddingTop: 16, marginHorizontal: 20, lineHeight: dimensions.width * 0.1 }
              ]}
            >
              {selectedScreen === 'Home' ? "COIN FLIP" :
                selectedScreen === 'Settings' ? "SETTINGS" :
                  selectedScreen === 'Lore' ? "LORE" :
                    selectedScreen === 'TossLog' ? "TOSS LOG" :
                      ''}
            </Text>

            <TouchableOpacity
              onPress={() => { setPreviousSelectedScreen(selectedScreen); setSelectedScreen('Settings'); setScreenTitle('Settings') }}
              className="items-center p-2 h-12 w-12"
            >
              {selectedScreen === 'Home' && (
                <Image
                  source={require('../assets/icons/settingsIconCF.png')}
                  className="text-center h-10 w-10"
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>

          </View>
        </View>
      </View>

      {selectedScreen === 'Home' ? (
        <View className="flex-1 px-5  " style={{ paddingTop: dimensions.width < 380 ? 10 : 40, width: '100%', }}>

          <View style={{ marginBottom: dimensions.width < 380 ? 5 : 20, }}>

            <View>
              <View className="flex-row items-center justify-center">

                <View className="bg-[#4A56BA]" style={{
                  width: '70%',
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: dimensions.width * 0.03,
                  borderRadius: dimensions.width * 0.03
                }}>
                  <Text className='text-center text-white' style={{
                    fontFamily: 'Montserrat-Black',
                    fontSize: dimensions.width * 0.07,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: dimensions.width * 0.03,

                  }}>{flipSide}</Text>
                </View>

                <TouchableOpacity style={{
                  position: 'absolute',
                  right: 10,
                  alignSelf: 'center',

                }} onPress={() => setSelectedScreen("TossLog")}>

                  <Image source={require('../assets/icons/historyIcon.png')} resizeMode='contain' className=" items-center justify-center"
                    style={{
                      width: dimensions.width * 0.1,
                      height: dimensions.width * 0.1,
                      position: 'relative',
                      marginTop: '5%'
                    }} />
                </TouchableOpacity>
              </View>


              <View style={{
                height: dimensions.width * 0.8,
              }}>
                <TouchableOpacity
                  disabled={isFlipping}
                  onPress={selectedMode === 'One flip' ? startFlipAnimation : selectedMode === '3 in a row' ? startThreeInARow : startMultipleFlips}
                  style={{ alignSelf: 'center', }}
                >
                  {selectedMode === 'Multiple' ? (
                    <View className="flex flex-row flex-wrap justify-center mt-5">
                      {flipSides.map((side, index) => (
                        <Animated.Image
                          key={index}
                          resizeMode="contain"
                          className="rounded-md items-center text-center justify-center"
                          source={
                            side === 'Head' ? currentHomeCoin?.frontImage : currentHomeCoin?.backImage
                          }
                          style={{
                            width: dimensions.width * 0.27,
                            height: dimensions.width * 0.27,
                            alignSelf: 'center',
                            marginTop: dimensions.width * 0.03,
                            transform: [{ rotateY: flipInterpolations[index] }],
                          }}
                        />
                      ))}
                    </View>


                  ) : (
                    <Animated.Image
                      resizeMode='contain' className="rounded-md items-center text-center justify-center"
                      source={currentImage()}
                      style={{
                        width: '66%', height: undefined, aspectRatio: 1,
                        alignSelf: 'center',
                        marginTop: dimensions.width * 0.03,
                        position: 'relative',
                        transform: [{ rotateY: flipInterpolation }],
                      }}
                    />
                  )}
                  <Image source={require('../assets/images/tapMessageImage.png')} resizeMode='contain' className="rounded-md items-center text-center justify-center"
                    style={{
                      width: dimensions.width * 0.6,
                      bottom: selectedMode === 'Multiple' ? dimensions.width * (-0.77) : dimensions.width * 0.32,
                      alignSelf: 'center',
                      position: 'absolute',
                      top: selectedMode === 'Multiple' ? dimensions.width * (-0.3) : dimensions.width * (-0.05),
                      opacity: isFlipping ? 0 : 1
                    }} />
                </TouchableOpacity>
              </View>

              <View className="bg-[#C9CEF6]" style={{ marginTop: dimensions.width * (-0.05), width: '100%', alignSelf: 'center', borderRadius: dimensions.width * 0.03 }}>
                <View className="flex-row justify-between items-center" >
                  {['3 in a row', 'One flip', 'Multiple'].map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      className={`  ${selectedMode === mode ? 'bg-[#4A56BA]' : 'bg-none'}`}
                      style={{
                        borderRadius: dimensions.width * 0.03,
                        paddingVertical: dimensions.width * 0.04,
                        paddingHorizontal: dimensions.width * 0.08,


                      }}
                      onPress={() => setSelectedMode(mode)}
                    >
                      <Text
                        className={`text-center ${selectedMode === mode ? 'text-white' : 'text-[#261B76]'}`}
                        style={{ fontFamily: 'Montserrat-SemiBold', fontSize: dimensions.width * 0.03 }}
                      >
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View
                className="bg-[#4A56BA] flex-row items-center"
                style={{
                  width: '60%',
                  alignSelf: 'center',
                  marginTop: dimensions.width * 0.03,
                  borderRadius: dimensions.width * 0.03
                }}
              >
                <Text
                  className="text-center text-white"
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: dimensions.width * 0.046,
                    flex: 1,
                    textAlign: 'center',
                    paddingVertical: dimensions.width * 0.03,
                    borderRightColor: "#261B76",
                    borderRightWidth: 1,
                  }}
                >
                  Heads: {headsCount}
                </Text>

                <Text
                  className="text-center text-white"
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: dimensions.width * 0.046,
                    flex: 1,
                    textAlign: 'center',
                    paddingVertical: dimensions.width * 0.03,
                  }}
                >
                  Tails: {tailsCount}
                </Text>
              </View>

              <TouchableOpacity onPress={() => { { setHeadsCount(0); setTailsCount(0) } }}>
                <View className='bg-white justify-center' style={{
                  width: dimensions.width * 0.14,
                  height: dimensions.width * 0.14, alignSelf: 'center', marginTop: '3%', borderRadius: dimensions.width * 0.03
                }}>
                  <Image source={require('../assets/icons/reloadIcon.png')} resizeMode='contain' className="rounded-md items-center text-center justify-center"
                    style={{
                      width: dimensions.width * 0.07,
                      height: dimensions.width * 0.07,
                      alignSelf: 'center',
                    }} />
                </View>

              </TouchableOpacity>

            </View>

          </View>


        </View>
      ) : selectedScreen === 'Settings' ? (
        <SettingsScreen setSelectedScreen={setSelectedScreen} isSoundEnabled={isSoundEnabled} setSoundEnabled={setSoundEnabled} isVibrationEnabled={isVibrationEnabled} setVibrationEnabled={setVibrationEnabled} setCurrentCoin={setCurrentCoin} setCurrentHomeCoin={setCurrentHomeCoin} setPreviousSelectedScreen={setPreviousSelectedScreen} selectedScreen={selectedScreen} />
      ) : selectedScreen === 'Lore' ? (
        <LoreScreen setSelectedScreen={setSelectedScreen} currentCoin={currentCoin} />
      ) : selectedScreen === 'TossLog' ? (
        <TossLogScreen setSelectedScreen={setSelectedScreen} />
      ) : null}
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  generalText: (dimensions) => ({
    fontFamily: 'InknutAntiqua-Regular',
    fontSize: dimensions.width * 0.08,
    color: '#FAEDE1',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  }),
});

export default HomeScreen;
