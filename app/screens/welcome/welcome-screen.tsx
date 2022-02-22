import React from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, TextInput } from "react-native"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Text, Wallpaper } from "../../components"
import { color, spacing, typography } from "../../theme"
import { MessageType, useStores } from "../../models"
import Tts from "react-native-tts"
import { FlatList } from "react-native-gesture-handler"

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
}
const HEADER_TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
}
const TITLE: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
}
const MESSAGES: ViewStyle = {
  flex: 1,
  backgroundColor: 'blue',
  borderColor: 'orange',
}
const TEXTINPUT: ViewStyle = {
  backgroundColor: "white",
}
const BUTTON_BOX: ViewStyle = {
  flexDirection: 'row',
}
const BUTTON_COL: ViewStyle = {
  flexDirection: 'column',
}
const BUTTON_STYLE: ViewStyle = {
  marginTop: 10,
  marginHorizontal: 10,
  backgroundColor: "#5D2555",
}
const BUTTON_TEXT: TextStyle = {
  ...TEXT,
  ...BOLD,
  fontSize: 18,
  letterSpacing: 2,
}
const FOOTER: ViewStyle = { backgroundColor: "#20162D", marginBottom: 64 }

export const WelcomeScreen = observer(function WelcomeScreen() {
  const {game, audio, comms} = useStores()
  // const navigation = useNavigation()
  // const nextScreen = () => navigation.navigate("demo")

  const connectToServer = () => {
    comms.connect()
  }
  const disconnectFromServer = () => {
    comms.disconnect()
  }
  const ttsSpeak = () => {
    // Tts.speak("Hello. This is react native text-to-speech. You'll notice that I can be heard by the speech-to-text engine")
    Tts.speak("Hello. This is the voice you will hear")
  }
  const toggleVoice = () => {

    if (audio.isRunning) {
      console.log("[welcome-screen.toggleVoice] stopping voice capture")
      audio.interruptVoiceRecognition()
    } else {
      console.log("[welcome-screen.toggleVoice] starting voice capture")
      audio.startVoiceRecognition()
    }
  }

  return (
    <View testID="WelcomeScreen" style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header headerTx="welcomeScreen.poweredBy" style={HEADER} titleStyle={HEADER_TITLE} />
        <View>
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="VORK! Voice activated Zork" /></Text>
        </View>
        <Text>Server Address:</Text>
        <TextInput
          style={TEXTINPUT}
          onChangeText={addr => comms.setZorkServerAddress(addr)}
          value={comms.zorkServerAddress}
        />
        <Text>Server Port:</Text>
        <TextInput
          style={TEXTINPUT}
          onChangeText={port => comms.setZorkServerPort(port)}
          value={comms.zorkServerPort}
        />
        <View>
          <Text>.</Text>
          <Text>.</Text>
        </View>
        <View>
          <Text style={TITLE}>{`audio.isAvailable: ${audio.isAvailable}`}</Text>
        </View>
        <View>
          <Text style={TITLE}>{`audio.isRunning: ${audio.isRunning}`}</Text>
        </View>
        <View>
        <Text>.</Text>
          <Text>.</Text>
        </View>
        <Text>Game Messages:</Text>
        <FlatList
          style={MESSAGES}
          data={game.gameMessages}
          renderItem={({ item }) => (
            <Text style={{backgroundColor: item.messageType === MessageType.game ? color.background : color.dim}}>item.message</Text>
          )}
          inverted={true}
        />
      </Screen>
      <SafeAreaView style={FOOTER}>
        <View style={BUTTON_BOX}>
          <View style={BUTTON_COL}>
          <Button
                style={BUTTON_STYLE}
                textStyle={BUTTON_TEXT}
                text="Connect To Zork Server"
                onPress={connectToServer}
            />
            <Button
              style={BUTTON_STYLE}
              textStyle={BUTTON_TEXT}
              text="Disconnect from Zork Server"
              onPress={disconnectFromServer}
            />
          </View>
          <View style={BUTTON_COL}>
            <Button
                style={BUTTON_STYLE}
                textStyle={BUTTON_TEXT}
                text="TTS - Well hello there"
                onPress={ttsSpeak}
            />
            <Button
              style={BUTTON_STYLE}
              textStyle={BUTTON_TEXT}
              text={audio.isRunning ? "LISTENING FOR SPEECH" : "SPEECH RECOGNITION OFF"}
              onPress={toggleVoice}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
})
