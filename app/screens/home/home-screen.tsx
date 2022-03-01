import React from "react"
import { View, ViewStyle, TextStyle, SafeAreaView, StyleSheet, TouchableOpacity, Image } from "react-native"
import { observer } from "mobx-react-lite"
import { Button, Header, Screen, Text, Wallpaper } from "../../components"
import { color, spacing, typography } from "../../theme"
import { useStores, WebSocketState } from "../../models"
import Tts from "react-native-tts"
import { FlatList } from "react-native-gesture-handler"
import { Switch } from 'react-native-paper'
import { useNavigation } from "@react-navigation/native"

export const HomeScreen = observer(function HomeScreen() {
  const {game, audio, comms} = useStores()
  const navigation = useNavigation()
  const gotoConfig = () => navigation.navigate("config")

  const messageFlatList = React.useRef(null)
  
  const connectToServer = () => {
    comms.connect()
  }
  const disconnectFromServer = () => {
    comms.disconnect()
  }
  const startVoiceRecognition = () => {
    audio.startVoiceRecognition()
  }
  const toggleConversational = () => {
    console.log(`[home-screen.toggleConversational]`)
    audio.setIsConversational(!audio.isConversational)
    if (!audio.isListening) {
      audio.startVoiceRecognition()
    }
  }
  const interruptPlayback = () => {
    Tts.stop()
  }

  React.useEffect(() => {
    console.log(`[HomeScreen.useEffect #game.gameMessages] count:${game.gameMessages.length}`)
  }, [game.gameMessages])

  return (
    <View testID="HomeScreen" style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header headerText="POWERED BY WillPowerWare" style={HEADER} titleStyle={HEADER_TITLE} />
        
        {/* AUDIO CONFIG/STATUS/SWITCHES */}
        <View style={homeStyles.conversationalSwitchGroup}>
          <View style={homeStyles.conversationalSwitch}>
            <Text style={homeStyles.conversationalText}>Conversational</Text>
            <Switch
              color={color.palette.orangeDarker}
              onValueChange={toggleConversational}
              value={audio.isConversational}
            />
          </View>
          <View>
            <Text style={homeStyles.listenLabel}>{`${audio.isListening ? "LISTENING" : ""}`}</Text>
          </View>
          {audio.isTalking ? 
          <View style={homeStyles.audioPlaybackButton}>
            <TouchableOpacity onPress={interruptPlayback}>
              <Text style={homeStyles.audioButtonText}>Interrupt Playback</Text>
            </TouchableOpacity>
          </View>
          : null}
          { !audio.isTalking && !audio.isConversational && !audio.isListening && comms.wsState === WebSocketState.OPEN ? 
          <View style={homeStyles.audioPlaybackButton}>
            <TouchableOpacity onPress={startVoiceRecognition}>
              <Text style={homeStyles.audioButtonText}>Start Listening</Text>
            </TouchableOpacity>
          </View>
          : null}
        </View>

        {/* CONFIG BUTTON */}
        <TouchableOpacity style={homeStyles.configButtonContainer} onPress={gotoConfig}>
          <Image source={require('./configCog.png')} resizeMode='contain' style={homeStyles.configButtonImage} />
          {/* <Text style={homeStyles.configButtonText}>CONFIG</Text> */}
        </TouchableOpacity>

        {/* TITLE */}
        <View style={homeStyles.title}>
          <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="VORK! Voice activated Zork" /></Text>
        </View>

        {/* GAME MESSAGES */}
        <Text>Game Messages:</Text>
        <View style={homeStyles.containerOuter}>
          <FlatList
            ref={messageFlatList}
            onContentSizeChange={() => {
              messageFlatList.current?.scrollToEnd()
            }}
            showsVerticalScrollIndicator={true}
            data={game.gameMessages}
            renderItem={({ item, index }) => {
              return (
                <>
                <View style={item.fromServer ? homeStyles.msgFromServer : homeStyles.msgFromUser}>
                  <Text style={homeStyles.msgText}>
                    {item.fromServer ? "Zork" : "You"}: {item.value}
                  </Text>
                </View>
                </>
              )
            }}
          />
        </View>

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
        </View>
      </SafeAreaView>
    </View>
  )
})


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
const BUTTON_BOX: ViewStyle = {
  flexDirection: 'column',
}
const BUTTON_COL: ViewStyle = {
  flexDirection: 'row',
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

const homeStyles = StyleSheet.create({
  audioButtonText: {
    color: color.palette.black,
    margin: 10,
    textAlign: 'center',
  },
  audioPlaybackButton: {
    backgroundColor: color.palette.orange,
    borderRadius: 5,
    borderWidth: 2,
    marginTop: 10,
  },
  configButtonContainer: {
    position: 'absolute',
    right: 25,
    top: 25,
    zIndex: 100,
  },
  configButtonImage: {
    height: 65,
    width: 65,
  },
  configButtonText: {
    color: color.palette.lightGrey,
    textAlign: 'center',
  },
  containerOuter: {
    borderRadius: 10,
    borderWidth: 2,
    height: 750,
  },
  conversationalSwitch: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20, 
  },
  conversationalSwitchGroup: {
    flexDirection: 'column',
    left: 25, 
    position: 'absolute', 
    top: 25,
    zIndex: 100,
  },
  conversationalText: {
    color: color.palette.lightGrey,
    justifyContent: 'center',
    marginRight: 10 
  },
  listenLabel: {
    ...TEXT,
    ...BOLD,
    fontSize: 28,
    textAlign: "center",  
  },
  msgFromServer: {
    backgroundColor: color.palette.orange,
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 5,
    padding: 10,
  },
  msgFromUser: {
    backgroundColor: color.palette.angry,
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 5,
    padding: 10,
  },
  msgText: {
    color: color.palette.black,
    fontFamily: typography.primary,

  },
  title: {
    marginBottom: 110,
  }
})

