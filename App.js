import React, {Component} from 'react';
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  ScrollView,
  AsyncStorage
} from 'react-native';
import { AppLoading } from "expo";
import ToDo from "./ToDo";
import uuidv1 from "uuid/v1";

const { height, width } = Dimensions.get("window");

export default class App extends Component {
  state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {},
    fontLoaded: false
  };
  componentDidMount = () => {
    this._loadToDos();
  }
  render() {
    const { newToDo, loadedToDos, toDos } = this.state;
    if (!loadedToDos) {
      return <AppLoading />;
    }
    return (
      <LinearGradient
        colors={["#D9BAFF", "#5E5E83"]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <Feather style={styles.title} size={45} name="list"/>
        <LinearGradient
          colors={["white", "#E6E6E6"]}
          style={styles.card}
        >
          <TextInput
            style={styles.input}
            placeholder={"TO-DO"}
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos)
              .reverse()
              .map(toDo => (
                <ToDo
                  key={toDo.id}
                  deleteToDo={this._deleteToDo}
                  uncompleteToDo={this._uncompleteToDo}
                  completeToDo={this._completeToDo}
                  updateToDo={this._updateToDo}
                  {...toDo}
                />
              ))}
          </ScrollView>
        </LinearGradient>
      </LinearGradient>
    );
  }
  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    })
  }
  _loadToDos = async() => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos)
      this.setState({loadedToDos: true, toDos: parsedToDos||{}})
    } catch(err){
      console.log(err)
    }
  }
  _addToDo = () => {
    const { newToDo } = this.state;
    if(newToDo !== "" ){
      this.setState( prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        }
        const newState = {
          ...prevState,
          newTodo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        }
        this._saveToDos(newState.toDos)
        return{...newState}
      })
    }
  }
  _deleteToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      }
      this._saveToDos(newState.toDos)
      return {...newState};
    })
  }
  _uncompleteToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      this._saveToDos(newState.toDos)
      return {...newState}
    })
  }
  _completeToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
      this._saveToDos(newState.toDos)
      return {...newState}
    })
  }
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      }
      this._saveToDos(newState.toDos)
      return {...newState}
    })
  }
  _saveToDos = (newToDos) => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: "white",
    marginTop: 50,
    marginBottom: 30
  },
  card: {
    flex: 1,
    width: width - 45,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  input: {
    padding: 13,
    borderBottomColor: "#bbb",
    borderBottomWidth: 0.5,
    fontSize: 18,
  },
  toDos: {
    alignItems: "center",
  }
});
