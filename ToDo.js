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

const { width, height } = Dimensions.get("window");

export default class ToDo extends Component {
    constructor(props){
        super(props);
        this.state = {
            isEditing: false,
            todoValue: props.text
        };
    }
    static PropTypes = {
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
                            ]}>{text}
                        </Text>)}
                </View>
                {isEditing ? (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={this._finishEditing}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>OK</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                        <View style={styles.actions}>
                            <TouchableOpacity onPressOut={this._startEditing}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>EDIT</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPressOut={ (event) => {
                                event.stopPropagation;
                                deleteToDo(id);
                            }}>
                                <View style={styles.actionContainer}>
                                    <Text style={styles.actionText}>DEL</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
            </View>
        )
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
        justifyContent: "space-between",
        marginVertical: 15,
        paddingBottom: 15,
    },
    check: {
        width: 20,
        height: 20,
        borderRadius: 5,
        backgroundColor: "#C1C2FF",
        marginRight: 10
    },
    checked: {
        backgroundColor: "#C1C2FF"
    },
    unchecked: {
        backgroundColor: "#bbb"
    },
    text: {
        fontSize: 16,
        width: width / 2,
        color: "#bbb"
    },
    completedText: {
        fontSize: 16,
        color: "#bbb",
        textDecorationLine: "line-through"
    },
    uncompletedText: {
        fontSize: 16,
        color:"#353839"
    },
    column: {
        flexDirection: "row",
        alignItems: "center",
    },
    actions: {
        flexDirection: "row"
    },
    actionContainer: {
        marginVertical: 10,
        marginHorizontal: 10
    },
    input: {
        fontSize: 15,
        width: width / 2,
    },
    actionText: {
        color: "#C1C2FF",
        fontWeight: 'bold',
    }
})