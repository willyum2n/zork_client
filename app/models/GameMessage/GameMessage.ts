import { Instance, SnapshotOut, types } from "mobx-state-tree"

export enum MessageType {
  "game" = "game",
  "admin" = "admin",
  "config" = "config",
}

/**
 * Model description here for TypeScript hints.
 */
export const GameMessageModel = types
  .model("GameMessage")
  .props({
    messageType: types.enumeration('MessageType', Object.values(MessageType)),
    /** Indicates the direction of the message (From Server or from User) */
    fromServer: types.optional(types.boolean, true),
    value: types.string,
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

export type GameMessageType = Instance<typeof GameMessageModel>
export interface GameMessage extends GameMessageType {}
export type GameMessageSnapshotType = SnapshotOut<typeof GameMessageModel>
export interface GameMessageSnapshot extends GameMessageSnapshotType {}
export const createGameMessageDefaultModel = () => types.optional(GameMessageModel, {})
