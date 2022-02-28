import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { GameMessageModel, GameMessageType, MessageType } from "../GameMessage/GameMessage"

/**
 * Model description here for TypeScript hints.
 */
export const GameModel = types
  .model("Game")
  .props({
    gameMessages: types.optional(types.array(GameMessageModel), []),
  })
  .volatile((self ) => ({
    isConverational: true,
  }))
  .views(() => ({
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addGameMessage(msg: GameMessageType) {
      console.log('[GameStore.addGameMessage]')
      if (msg.messageType === MessageType.game) {
        self.gameMessages.push(msg)
      }
    },
    setIsConversational(enabled: boolean) {
      self.isConverational = enabled
    },
  }))
  .actions((self) => ({
    afterCreate() {
      console.log(`[GameStore.afterCreate]`)
      self.gameMessages.clear()
    },
    beforeDestroy() {
      console.log(`[GameStore.beforeDestroy]`)
    },
  }))
/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type GameType = Instance<typeof GameModel>
export interface Game extends GameType {}
type GameSnapshotType = SnapshotOut<typeof GameModel>
export interface GameSnapshot extends GameSnapshotType {}
export const createGameDefaultModel = () => types.optional(GameModel, {})
