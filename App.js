import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Animated, {
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import {useEffect, useState} from "react";

function clampWorklet(num, min, max) {
  'worklet';

  return Math.min(Math.max(num, min), max);
}

const OFFSET_X = 100;
const OFFSET_Y = 100;

export default function App() {
  const sensorType = SensorType.GYROSCOPE
  const animatedSensor = useAnimatedSensor(sensorType);
  const indexOfSensor = Object.values(SensorType).indexOf(sensorType);
  const sensor = Object.keys(SensorType)[indexOfSensor]

  const xOffset = useSharedValue(-OFFSET_X);
  const yOffset = useSharedValue(0);
  const zOffset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    const {x, y, z} = animatedSensor.sensor.value;
    // The x vs y here seems wrong but is the way to make it feel right to the user
    xOffset.value = clampWorklet(xOffset.value + y, -OFFSET_X * 2, OFFSET_X/4);
    yOffset.value = clampWorklet(yOffset.value - x, -OFFSET_Y, OFFSET_Y);
    zOffset.value = clampWorklet(zOffset.value + z, -180, 180);
    return {
      transform: [
        {translateX: withSpring(-OFFSET_X - xOffset.value)},
        {translateY: withSpring(yOffset.value)},
        {rotateZ: `${zOffset.value}deg`},
      ],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: "row", alignContent: "space-between", width: '100%'}}>
        <Pressable
          style={[styles.button, {backgroundColor: 'red'}]}
          onPress={() => {
            xOffset.value = -OFFSET_X;
            yOffset.value = 0;
            zOffset.value = 0;
          }}>
          <Text>Reset</Text>
        </Pressable>
        <View style={styles.button}>
          <Text>{sensor}</Text>
        </View>
      </View>
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Animated.View
          style={[{
            backgroundColor: 'black',
            height: 100,
            width: 100,

          }, animatedStyles]}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    flex: 1,
    height: 40,
    backgroundColor: "green",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10
  }
});
