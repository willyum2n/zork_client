import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { GameMessageModel, GameMessageType } from "../GameMessage/GameMessage"

/**
 * Model description here for TypeScript hints.
 */
export const GameModel = types
  .model("Game")
  .props({
    gameMessages: types.optional(types.array(GameMessageModel), []),
  })
  .views(() => ({
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addMessage(msg: GameMessageType) {
      console.log('[GameStore.addMessage]')
      // We are adding items in reverse because we want to use a flatlist inverted to keep the 
      // items growing upward, but still have them in the flatlist "in the correct order". To 
      // achieve this, we will push all new items to the front of the array
      self.gameMessages.unshift(msg)
      // self.gameMessages.push(msg)
    }
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
