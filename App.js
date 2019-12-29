import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform
} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content"/>
      <Text style={styles.title}>Must To Do</Text>
      <View style={styles.card}>
        <TextInput style={styles.newToDo} placeholder={"New To Do"}/>
      </View>
    </View>
  );
}

const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C1C2FF",
    alignItems: 'center',
  },
  title: {
    color: "white",
    fontSize: 20,
    marginTop: 50,
    fontStyle: "normal",
    fontWeight: "200",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios:{
        shadowColor: "rgb(50,50,50)",
        shadowOpacity: 0,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  }
});
