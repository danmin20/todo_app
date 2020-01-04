import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput
} from "react-native";
import PropTypes from "prop-types";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default class ToDo extends Component {
    constructor(props){
        super(props);
        this.state = {
            isEditing: false,
            todoValue: props.text
        };
    }
    static propTypes = {
        text: PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        deleteToDo: PropTypes.func.isRequired,
        id: PropTypes.string.isRequired,
        uncompleteToDo: PropTypes.func.isRequired,
        completeToDo: PropTypes.func.isRequired,
        updateToDo: PropTypes.func.isRequired
    }

    render() {
        const {isEditing, todoValue} = this.state;
        const {text, id, deleteToDo, isCompleted} = this.props;
        return (
          <View style={styles.container}>
            <View style={styles.column}>
              <TouchableOpacity onPress={this._toggleComplete}>
                <View
                  style={[
                    styles.check,
                    isCompleted ? styles.checked : styles.unchecked
                  ]}
                />
              </TouchableOpacity>
              {isEditing ? (
                <TextInput
                  style={[
                    styles.text,
                    styles.input,
                    isCompleted ? styles.completedText : styles.uncompletedText
                  ]}
                  value={todoValue}
                  multiline={true}
                  onChangeText={this._controlInput}
                  returnKeyType={"done"}
                  onBlur={this._finishEditing}
                />
              ) : (
                <Text
                  style={[
                    styles.text,
                    isCompleted ? styles.completedText : styles.uncompletedText
                  ]}
                >
                  {text}
                </Text>
              )}
            </View>
            {isEditing ? (
              <View style={styles.actions}>
                <TouchableOpacity onPressOut={this._finishEditing}>
                    <Text style={styles.ok}>OK</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.actions}>
                <TouchableOpacity onPressOut={this._startEditing}>
                  <MaterialIcons
                    style={styles.icon}
                    size={25}
                    name="edit"
                    color="#C3A8E6"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPressOut={event => {
                    event.stopPropagation;
                    deleteToDo(id);
                  }}
                >
                  <MaterialIcons
                    style={styles.icon}
                    size={25}
                    name="delete"
                    color="#C3A8E6"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
    }
    _toggleComplete = (event) => {
        event.stopPropagation();
        const {isCompleted, uncompleteToDo, completeToDo, id} = this.props;
        if(isCompleted){
            uncompleteToDo(id)
        } else{
            completeToDo(id)
        }
    }
    _startEditing = (event) => {
        event.stopPropagation
        this.setState({isEditing: true})
    }
    _finishEditing = (event) => {
        event.stopPropagation
        const {todoValue} = this.state;
        const {id, updateToDo} = this.props;
        updateToDo(id, todoValue);
        this.setState({isEditing: false})
    }
    _controlInput = (text) => {
        this.setState({todoValue: text})
    }
}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    check: {
        width: 20,
        height: 20,
        borderRadius: 5,
        marginRight: 10
    },
    checked: {
        backgroundColor: "#C3A8E6"
    },
    unchecked: {
        backgroundColor: "#bbb"
    },
    text: {
        fontSize: 18,
        marginVertical: 20,
        color: "#bbb",
    },
    ok: {
        fontSize: 15,
        fontWeight: 'bold',
        color: "#9C96FF",
        marginRight: 15
    },
    completedText: {
        fontSize: 18,
        color: "#bbb",
        textDecorationLine: "line-through"
    },
    uncompletedText: {
        fontSize: 18,
        color:"#353839"
    },
    column: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 15,
        width: width / 2
    },
    actions: {
        flexDirection: "row",
        marginRight: 5
    },
    icon: {
        marginRight: 5
    },
    input: {
        fontSize: 18,
        width: width / 2
    }
})