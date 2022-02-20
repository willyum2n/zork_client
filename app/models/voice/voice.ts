import { Instance, SnapshotOut, types } from "mobx-state-tree"
import Voice from '@react-native-voice/voice'

/**
 * Model description here for TypeScript hints.
 */
export const VoiceModel = types
  .model("Voice")
  .props({
    isAvailable: types.optional(types.boolean, false)
  })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    async queryIsAvailable() {
      self.isAvailable = await Voice.isAvailable() === 1
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    afterCreate() {
      self.queryIsAvailable()
    },
    beforeDestroy() {
      console.log("Created a new todo!")
    },    
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type VoiceStoreType = Instance<typeof VoiceModel>
export interface VoiceStore extends VoiceStoreType {}
type VoiceStoreSnapshotType = SnapshotOut<typeof VoiceModel>
export interface VoiceStoreSnapshot extends VoiceStoreSnapshotType {}
export const createVoiceDefaultModel = () => types.optional(VoiceModel, {})
