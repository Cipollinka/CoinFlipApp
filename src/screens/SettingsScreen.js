import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    StyleSheet,
    Image,
    Switch,
    Alert,
    Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from 'nativewind';

const StyledView = styled(View);

const coins = [
    { id: 1, imageReq: require('../assets/icons/goldCoinIcon.png'), title: "Lightning coin", description: "The Legend of the Lightning Coin tells of a mystical artifact forged by Stratos, the god of storms, in the kingdom of Zephyron. Created during the Great Sky War, the coin holds a fragment of a thunderbolt—a powerful, raw energy that can bend fate itself. Stratos imbued the coin with his lightning to protect his people from the Shadow Wraiths, a force of darkness that fed on fear and despair.\n\nNot a weapon, but a tool for balance, the coin has two sides: one with a bolt of lightning, representing strength and favor, and the other with a storm’s crest, reminding the bearer of the trials they must endure. Whoever holds the coin can call upon the favor of the gods, but only those with a pure heart and steadfast will can wield its power without being consumed by its energy.\n\nThe coin was entrusted to King Kaelus, the first ruler of Zephyron, and helped him guide his people through great challenges. However, the coin eventually vanished during the fall of Zephyron's citadel, its fate unknown. Some believe it was stolen by a thief, while others think it lies hidden, waiting for a worthy bearer.\n\nToday, the Lightning Coin is seen as a symbol of fate and divine intervention. Some treasure hunters speak of finding coins with similar designs, but whether these are mere replicas or fragments of the original remains a mystery. The Lightning Coin serves as a reminder of life’s dual nature: the power to change fate lies in the flip of a coin, but the courage to face its outcome comes from within." },
    { id: 2, imageReq: require('../assets/icons/silverCoinIcon.png'), title: "Storm Peak coin", description: "The Legend of the Stormpeak Coin takes place in the ancient realm of Thundrion, where towering mountains kissed the heavens and lightning storms raged eternally. At the heart of this land stood Stormpeak, the sacred birthplace of the storms, where the gods of thunder and earth clashed to create balance in the world.\n\nThe Stormpeak Coin was forged by the mountain itself during the cataclysmic Skyforge Tempest. Legend tells that a mortal named Kaeloran, a humble mountain guide, climbed Stormpeak during the worst storm in history to plead with the gods to save his village. Moved by his courage, the gods struck the peak with their combined power, splitting the rock and embedding a shard of divine lightning within it. From this shard, the Stormpeak Coin was born.\n\nThe coin holds the primal force of creation: Its lightning face channels pure storm energy, capable of summoning protection, clarity, or even destruction. The mountain side represents unyielding strength and endurance, granting wisdom and patience during trials.\n\nUnlike other artifacts, the Stormpeak Coin cannot be easily tamed. Those who possess it must journey to Stormpeak, enduring treacherous storms and perilous paths, to unlock its full potential. Only those who respect both the power of the storm and the resilience of the mountain can master its dual nature.\n\nOver centuries, the coin became a closely guarded secret, entrusted to the Keepers of the Peak, an order of monks who swore to protect it. These guardians believed the coin could restore balance to a fractured world but feared its misuse, hiding it deep within the heart of the mountain.\n\nAncient prophecies foretell that the coin will resurface during the Veil’s Sundering, a time when storms will bring fire instead of rain, and the earth will quake in despair. The coin will seek out a Stormbearer, a chosen individual destined to restore harmony by unifying the forces of storm and mountain.\n\nSome believe fragments of the Stormpeak Coin have already found their way into the hands of explorers, each carrying faint electrical charges or markings of the storm. Others claim the coin still lies hidden, waiting for the next brave soul to climb Stormpeak and earn its favor.\n\nThe Stormpeak Coin symbolizes the eternal dance of chaos and stability, reminding all who encounter it that true strength lies in the balance between resilience and power." },
]

const SettingsScreen = ({ setSelectedScreen, isSoundEnabled, setSoundEnabled, isVibrationEnabled, setVibrationEnabled, setCurrentCoin, setPreviousSelectedScreen, selectedScreen, setCurrentHomeCoin }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const saveSettings = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving settings:", error);
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
    }, []);

    const toggleSoundSwitch = () => {
        const newValue = !isSoundEnabled;
        setSoundEnabled(newValue);
        saveSettings('isSoundEnabled', newValue);
    };

    const toggleVibrationSwitch = () => {
        const newValue = !isVibrationEnabled;
        setVibrationEnabled(newValue);
        saveSettings('isVibrationEnabled', newValue);
    };


    const saveSelectedCoin = async (coinId) => {
        try {
            await AsyncStorage.setItem('selectedCoin', JSON.stringify(coinId));
        } catch (error) {
            console.error("Error saving coin:", error);
        }
    };

    const shareText = async () => {
        try {
            await Share.share({
                message: `Join CoinFlip!\n`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };


    return (
        <StyledView
            className="flex "
            style={{
                width: '100%', alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <View className='flex justify-center bg-white' style={{
                width: '90%',
                height: dimensions.height * 0.25,
                marginTop: dimensions.width * 0.04,
                borderRadius: 25,
            }}>

                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 20,
                    width: '100%',
                    backgroundColor: 'white',
                    borderRadius: 25,

                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10,
                        borderBottomColor: '#c5c5c6',
                        borderBottomWidth: 1,
                        borderRadius: 8,
                    }}>
                        <Text style={{
                            color: 'black',
                            fontSize: dimensions.width * 0.05,
                            fontFamily: 'Montserrat-Regular',
                        }}>Sound</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#34C759' }}
                            thumbColor={isSoundEnabled ? '#FFFFFF' : '#FFFFFF'}
                            ios_backgroundColor="#3E3E3E"
                            onValueChange={toggleSoundSwitch}
                            value={isSoundEnabled}
                        />
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10,
                        borderBottomColor: '#c5c5c6',
                        borderBottomWidth: 1,
                        borderRadius: 8,
                    }}>
                        <Text style={{
                            color: 'black',
                            fontSize: dimensions.width * 0.05,
                            fontFamily: 'Montserrat-Regular',
                        }}>Vibration</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#34C759' }}
                            thumbColor={isVibrationEnabled ? '#FFFFFF' : '#FFFFFF'}
                            ios_backgroundColor="#3E3E3E"
                            onValueChange={toggleVibrationSwitch}
                            value={isVibrationEnabled}
                        />
                    </View>
                    <TouchableOpacity onPress={shareText} style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10,

                        borderRadius: 8,
                    }}>
                        <Text style={{
                            color: 'black',
                            fontSize: dimensions.width * 0.05,
                            fontFamily: 'Montserrat-Regular',
                        }}>Share app</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View className="flex flex-row flex-wrap justify-center mt-5">
                {coins.map((coin) => (
                    <View key={coin.id} className="flex items-center w-1/2 p-2">
                        <TouchableOpacity onPress={() => { setCurrentCoin(coin); setPreviousSelectedScreen(selectedScreen); setSelectedScreen('Lore') }}>
                            <Image source={coin.imageReq} className="w-44 h-44 rounded-md" />
                        </TouchableOpacity>
                        <Text style={{
                            color: 'white',
                            fontSize: dimensions.width * 0.05,
                        }}>{coin.title}</Text>
                        <TouchableOpacity className="bg-[#4A56BA] px-2 py-3 rounded-2xl" onPress={() => {
                            setCurrentHomeCoin(coin);
                            saveSelectedCoin(coin.id);
                        }}>
                            <Text style={{
                                color: 'white',
                                fontSize: dimensions.width * 0.05,
                                fontFamily: 'Montserrat-Regular',
                                alignSelf: 'center',
                                textAlign: 'left',
                                paddingHorizontal: dimensions.width * 0.04
                            }}>Select coin</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setCurrentCoin(coin); setPreviousSelectedScreen(selectedScreen); setSelectedScreen('Lore') }}>
                            <Text style={{
                                paddingTop: 7,
                                color: 'white',
                                fontSize: dimensions.width * 0.03,
                                textDecorationLine: 'underline',
                                textDecorationColor: 'white'
                            }}>read coin lore</Text>
                        </TouchableOpacity>

                    </View>

                ))}
            </View>
        </StyledView>
    );
};

const styles = StyleSheet.create({

});

export default SettingsScreen;
