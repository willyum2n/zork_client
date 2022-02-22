import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { CommsModel } from "../Comms/Comms"
import { GameModel } from "../Game/Game"
import { VoiceAudioModel } from "../Voice/VoiceAudio"

/**
 * A RootStore model.
 */
// prettier-ignore
export const RootStoreModel = types
.model("RootStore")
.props({
  game: types.optional(GameModel, {}),
  audio: types.optional(VoiceAudioModel, {}),
  comms: types.optional(CommsModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
