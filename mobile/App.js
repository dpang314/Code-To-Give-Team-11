import { StatusBar } from 'expo-status-bar';
import { FlatList, KeyboardAvoidingView, StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { io } from "socket.io-client";
import Constants from "expo-constants";
import { useEffect, useState } from 'react';

const { manifest } = Constants;

let url;

if (manifest.debuggerHost) {
  url = `http://${manifest?.debuggerHost?.split(":").shift()}:3000`;
} else {
  url = "http://localhost:3000";
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(io(url));

  useEffect(() => {
    socket.on('receive_message', ({ sender, message }) => {
      setMessages((messages) => {
        return [...messages, { sender, message }];
      })
    });
  }, []);

  return (
    <View style={styles.wrapper}>

    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Coordinator Name</Text>
        </View>
      <FlatList
        data={messages} 
        style={styles.list}
        renderItem={({ item }) => 
        (<>{
          item.sender === socket.id ? (
            <View style={[styles.common, styles.sender]}>
              <Text style={styles.text}>
                {item.message}
              </Text>
            </View>
          ) : (
            <View style={[styles.common, styles.receiver]}>
              <Text style={styles.text}>
                {item.message}
              </Text>
            </View>
          )
          
        }</>)}
      />
      <TextInput 
        style={styles.input}
        placeholder='Type Message'
        onSubmitEditing={(event) => {
          socket.emit("send_message", { sender: socket.id, message: event.nativeEvent.text});
        }}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={[styles.buttons, {backgroundColor: '#DDFFEB'}]}>
          Scan Document
        </Text>
        <Text style={[styles.buttons, {backgroundColor: '#F8E2FF'}]}>
          Call
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={[styles.buttons, {backgroundColor: '#F8E2FF'}]}>
          Video Chat
        </Text>
        <Text style={[styles.buttons, {backgroundColor: '#DDFFEB'}]}>
          View Calendar
        </Text>
      </View>
    </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#3981C5',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    backgroundColor: '#F8E2FF',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 48,
    marginBottom: 48,
    marginLeft: 20,
    marginRight: 20,
    width: '100%',
    maxWidth: 600,
  },
  list: {
    flex: 1
  },
  input: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    padding: 10,
  },
  common: {
    width: '100%',
  },
  sender: {
    flexDirection: 'row-reverse'
  },
  receiver: {
    flexDirection: 'row'
  },
  text: {
    fontSize: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    borderWidth: 1
  },
  buttons: {
    flex: 1, 
    textAlign: 'center', 
    paddingVertical: 40
  }
});
