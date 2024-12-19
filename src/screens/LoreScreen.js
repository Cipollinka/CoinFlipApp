import { View, Text, SafeAreaView, ScrollView, Dimensions, Image, TouchableOpacity, Share } from 'react-native'
import React, { useState } from 'react'

const LoreScreen = ({ currentCoin, setSelectedScreen }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const shareText = async () => {
        try {
            await Share.share({
                message:  `Join CoinFlip to know legend of the ${currentCoin.title}!\n`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <SafeAreaView style={{ width: '95%' }}>
            <ScrollView style={{ marginBottom: 150 }}>
                <View className='flex justify-center bg-white w-full my-5 pb-5 rounded-2xl' >


                    <Image source={currentCoin.imageReq} resizeMode='contain' className="rounded-md items-center text-center justify-center" style={{ width: dimensions.width * 0.8, height: dimensions.width * 0.8, alignSelf: 'center' }} />
                    <Text style={{
                        color: '#261B76',
                        fontSize: dimensions.width * 0.08,
                        fontFamily: 'Montserrat-Black',
                        alignSelf: 'center',
                        textAlign: 'left'
                    }}>{currentCoin.title}</Text>
                    <Text style={{
                        color: '#261B76',
                        fontSize: dimensions.width * 0.04,
                        fontFamily: 'Montserrat-Regular',
                        alignSelf: 'center',
                        textAlign: 'left',
                        paddingHorizontal: 30
                    }}>{currentCoin.description}</Text>

                    <View className="flex-row " style={{paddingHorizontal: 30, paddingTop: 10}}>
                        <TouchableOpacity className="bg-[#4A56BA] px-2 py-3 rounded-2xl" onPress={shareText}>
                            <Text style={{
                                color: 'white',
                                fontSize: dimensions.width * 0.05,
                                fontFamily: 'Montserrat-Regular',
                                alignSelf: 'center',
                                textAlign: 'left',
                                paddingHorizontal: 30
                            }}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className=" py-3 rounded-2xl" onPress={() => setSelectedScreen("Settings")}>
                            <Text style={{
                                color: '#261B76',
                                fontSize: dimensions.width * 0.046,
                                fontFamily: 'Montserrat-Regular',
                                alignSelf: 'center',
                                textAlign: 'left',
                                paddingHorizontal: 30
                            }}>Close</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>


        </SafeAreaView>
    )
}

export default LoreScreen