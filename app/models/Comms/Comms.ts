import { Instance, SnapshotOut, types } from "mobx-state-tree"
import Tts from "react-native-tts";
import { withRootStore } from "..";
import { GameMessageType, MessageType } from "../GameMessage/GameMessage";

let ws:WebSocket

/**
 * Model description here for TypeScript hints.
 */
export const CommsModel = types
  .model("Comms")
  .extend(withRootStore)
  .props({
    zorkServerAddress: types.optional(types.string, "192.168.11.51"),
    zorkServerPort: types.optional(types.number, 8080),
    wsState: types.optional(types.string, "CLOSED"),
  })
  .views((self) => ({
    get zorkServerUri(){
      return `ws://${self.zorkServerAddress}:${self.zorkServerPort}`
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setZorkServerAddress(addr: string) {
      self.zorkServerAddress = addr
    },
    setZorkServerPort(port: number) {
      self.zorkServerPort = port
    },
    sendMessage(messageType:MessageType, value: string) {
      const msg: GameMessageType = {"messageType":messageType, "fromServer":false, "value":value}
      console.log(`[Comms.SendMessage] msg: ${msg}`)

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(msg))
        self.rootStore.game.addGameMessage(msg)
      } else {
        console.error("[Comms.sendMessage] WebSocket is not open!")
      }
    },
  }))
  .actions((self) => ({
    onopen() {
      console.log('[Comms.onopen]')
    },
    async onmessage(e) {
      // a message was received.
      // const msg: GameMessageType = {messageType: e.data.messageType, value: e.data.value}
      const msg: GameMessageType = {...JSON.parse(e.data)}
      // const msg: GameMessageType = {...e.data}

      console.log(`[Comms.ws.onmessage] messageType:${msg.messageType}, value:${msg.value} `)
      // Stop Voice Recognition and TTS the message
      switch (msg.messageType) {
        case MessageType.game:
          console.log('[Comms.onmessage] handle "game" message')
          // Push message to the main display          
          self.rootStore.game.addGameMessage(msg)
          // Read message to user
          Tts.speak(msg.value)
          break
        case MessageType.admin:
          console.log('[Comms.onmessage] handle "admin" message')
          switch (msg.value) {
            case "how about a nice game of chess?":
              // connection opened. We should send our ID to the server so it can restore our game
              // self.sendMessage({messageType: MessageType.Config, value: self.applicationId})
              self.sendMessage(MessageType.admin, "No. I want to play zork!")
              break
          }

          break
        case MessageType.config:
          console.log('[Comms.onmessage] handle "config" message')
          // TODO:
          break
        default:
          console.error('[Comms.onmessage] Message not handled: ', e)
          break
      }
    },
    onerror(e) {
      // an error occurred
      console.log('[Comms.ws.onerror] ',e.message);
    },
    
    onclose(e) {
      // connection closed
      console.log('[Comms.ws.onerror] (code,reason)',e.code, e.reason);
    },
    
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    connect() {
      console.log('[Comms.connect] uri: ', self.zorkServerUri)
      ws = new WebSocket(self.zorkServerUri)
      ws.onopen = self.onopen
      ws.onclose = self.onclose
      ws.onerror = self.onerror
      ws.onmessage = self.onmessage
    },
    disconnect(){
      ws = null
    },
  }))
  .actions(() => ({
    async afterCreate() {
      console.log('[Comms.afterCreate]')
    },
    beforeDestroy() {
      console.log('Comms.beforeDestroy')
    },    
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type CommsType = Instance<typeof CommsModel>
export interface Comms extends CommsType {}
type CommsSnapshotType = SnapshotOut<typeof CommsModel>
export interface CommsSnapshot extends CommsSnapshotType {}
export const createCommsDefaultModel = () => types.optional(CommsModel, {})
