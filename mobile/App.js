import { StatusBar } from 'expo-status-bar';
import { FlatList, KeyboardAvoidingView, StyleSheet, Text, Image, TextInput, View, Platform } from 'react-native';
import { io } from "socket.io-client";
import Constants from "expo-constants";
import { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';


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
        <Image
        source={{ uri: 'https://wish.org/sites/default/files/styles/logo_large_default_1x/public/2020-09/MAW_Georgia_REV.png?itok=LUXDY-5M' }}
        style={{ width: 230, height: 65 }}
      />
          <Text style={styles.headerText}>
          <Icon name="clipboard" size={25} color="#ffffff" /> &nbsp;Coordinator Name</Text>
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
              <Text style={styles.text2}>
                {item.message}
              </Text>
            </View>
          )
          
        }</>)}
      />
      <View
      style={[{flex: 1}, {flexDirection: 'row'}, {justifyContent: 'space-between'}, {alignItems: 'stretch'}, {maxHeight: 40}]}>
      <TextInput 
        style={styles.input}
        placeholder='Enter a new message'
        onSubmitEditing={(event) => {
          socket.emit("send_message", { sender: socket.id, message: event.nativeEvent.text});
        }}
      />
      <Text style={[styles.sendButton, {height: 40}, {flex: 1}, {alignItems: "center"}]}>
      <Icon name="send" size={18} color="#ffffff" /> &nbsp;Send</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={[styles.buttons, {backgroundColor: '#3F979B'}]}>
        <Icon name="file" size={18} color="#ffffff" />&nbsp;Scan Document
        </Text>
        <Text style={[styles.buttons, {backgroundColor: '#C0EEF2'}]}>
        <Icon name="phone" size={18} color="#ffffff" /> &nbsp;Call
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text style={[styles.buttons, {backgroundColor: '#C0EEF2'}, {
    borderBottomLeftRadius: 25}]}>
          <Icon name="camera" size={18} color="#ffffff" /> &nbsp;Video Chat
        </Text>
        <Text style={[styles.buttons, {backgroundColor: '#3F979B'}, {
    borderBottomRightRadius: 25}]}>
          <Icon name="calendar" size={18} color="#ffffff" /> &nbsp;View Calendar
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
    backgroundImage: 'url(https://pbs.twimg.com/ext_tw_video_thumb/1580314918007570433/pu/img/QzU9Y69fVN6hxNXP?format=jpg&name=large)',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  sendButton: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#ffffff',
    paddingTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: "#6096B4",
  },
  header: {
    backgroundColor: '#2B3467',
    alignItems: 'center',
    paddingBottom: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 20,
    marginBottom: 10,
    
  },
  headerText: {
    fontSize: 26,
    marginTop: 7,
    fontWeight: 'bold',
    color: '#ffffff',
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
    borderRadius: 50,
  },
  list: {
    flex: 1,
    borderRadius: 15,
  },
  input: {
    height: 40,
    flex: 5,
    width: "100%",
    borderWidth: 3,
    borderColor: '#2B3467',
    color: '#2B3467',
    borderRadius: 3,
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
    marginRight: 30,
    marginTop: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderWidth: 0,
    backgroundColor: '#DFFFD8',
    borderRadius: 15,
  },
  text2: {
    fontSize: 16,
    paddingLeft: 20,
    marginLeft: 30,
    marginTop: 10,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    borderWidth: 0,
    backgroundColor: '#B4E4FF',
    borderRadius: 15,
  },
  buttons: {
    flex: 1, 
    textAlign: 'center', 
    paddingVertical: 40,
    fontSize: 17,
    color: '#060047',
    fontWeight: 'bold',
  }
});
