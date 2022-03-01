import React, { useState } from "react"
import { StyleSheet, Text, TextStyle, View, ViewProps, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { Header, Screen, Wallpaper } from "../../components"
import { color, spacing, typography } from "../../theme"
import { TextInput } from "react-native-gesture-handler"
import { useStores } from "../../models"


export const ConfigScreen = observer(function ConfigScreen() {
  const navigation = useNavigation()
  const {comms} = useStores()
  const goBack = () => {
      
    const newHostname = inputHostname || "vork.willpowerware.io"
    const newPort = inputPort ? Number(inputPort) : 6910

    // if hostname or port changed, we need to disconnect and try to reconnect
    if (comms.zorkServerHostname !== newHostname || comms.zorkServerPort !== newPort) {
      console.log("[config-screen.goBack] Server config changed. Reconnecting")
      comms.disconnect()
      
      comms.setZorkServerHostname(newHostname)
      comms.setZorkServerPort(Number(newPort))

      comms.connect()
    }


    console.log(`[config-screen] END: hostname=${comms.zorkServerHostname}, port=${comms.zorkServerPort}`)
    navigation.goBack()
  }

  const [inputHostname, setHostname] = useState(comms.zorkServerHostname)
  const [inputPort, setPort] = useState(comms.zorkServerPort)

  return (
    <View testID="configScreen" style={FULL}>
      <Wallpaper />
      <Screen style={CONTAINER} preset="scroll" backgroundColor={color.transparent}>
        <Header
          headerTx="configScreen.header"
          leftIcon="back"
          onLeftPress={goBack}
          style={HEADER}
          titleStyle={HEADER_TITLE}
        />
        <View>
          <Text style={configStyles.labelText}>Addr/Hostname:</Text>
          <TextInput
            placeholder="zork.willpowerware.io"
            placeholderTextColor={color.palette.grey}
            style={configStyles.textInput}
            value={inputHostname}
            onChangeText={setHostname}
            onFocus={() => { setHostname('') }}
          />
        </View>
        <View>
          <Text style={configStyles.labelText}>Port:</Text>
          <TextInput
            placeholder="6910"
            placeholderTextColor={color.palette.grey}
            style={configStyles.textInput}  
            value={inputPort.toString()}
            onChangeText={(text) => { setPort(text.replace(/[^0-9]/g, '')) }}
            onFocus={() => { setPort('') }}
          />
        </View>
      </Screen>
    </View>
  )
})

const FULL: ViewStyle = { flex: 1 }
const CONTAINER: ViewStyle = {
  backgroundColor: color.transparent,
  paddingHorizontal: spacing[4],
}
const BOLD: TextStyle = { fontWeight: "bold" }
const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[5] - 1,
  paddingHorizontal: 0,
  zIndex: 100,
}
const HEADER_TITLE: TextStyle = {
  ...BOLD,
  fontSize: 12,
  lineHeight: 15,
  textAlign: "center",
  letterSpacing: 1.5,
}
const TEXT: TextStyle = {
  color: color.palette.white,
  fontFamily: typography.primary,
  fontSize: 24,
}

const configStyles = StyleSheet.create({
  

  labelText: {
    ...TEXT,
    color: color.palette.white,
    marginTop: 25,
    textAlign: 'left',
  },
  textInput: {
    ...TEXT,
    borderColor: color.palette.white,
    borderWidth: 2,
    color: color.palette.white,
    marginTop: 5,
    paddingHorizontal: 15,
  },

  title: {
    marginBottom: 110,
  }
})
