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
      self.gameMessages.push(msg)
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
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
