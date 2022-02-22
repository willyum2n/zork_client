import { Instance, SnapshotOut, types } from "mobx-state-tree"
import Voice from '@react-native-voice/voice'
import { withRootStore } from "../extensions/with-root-store";
import { MessageType } from "..";
import Tts from "react-native-tts";

let silenceTimeout;

/** Model description here for TypeScript hints. */
export const VoiceAudioModel = types
  .model("VoiceAudio")
  .extend(withRootStore)
  .props({
    /** Determines whether the user wants us to submit speech results after a certain amount of silence */
    autoCompleteEnabled: types.optional(types.boolean, true),
    /** The amount of time in silence that will cause an AutoComplete */
    silenceLength_ms: types.optional(types.number, 1500),
    /** Automatically turns the mic on after each Game Message from the server */
    autoListenEnabled: types.optional(types.boolean, true),
    voiceId: types.maybe(types.string),
  })
  .volatile(() => ({
    voiceIsAvailable: false,
    isRunning: false,
    lastVoiceCaptureResult: "",
  }))
  .views(() => ({
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setIsAvailable(value: boolean) {
      self.voiceIsAvailable = value
    },
    setResult(value: string) {
      console.log('[VoiceAudio.setResult] result=', value)
      self.lastVoiceCaptureResult = value
    }
  }))
  .actions((self) => ({
    async startVoiceRecognition() {      
      console.log('[VoiceAudio.startVoiceRecognition] ')
      self.isRunning = true
      await Voice.start('en-US')
    },
    /** stops voice recognition and throws away any results */
    async interruptVoiceRecognition() {
      console.log('[VoiceAudio.interruptVoiceRecognition]')
      self.isRunning = false
      self.setResult("")  // Clear out the voice result 
      if (silenceTimeout) {
        clearTimeout(silenceTimeout)
      }
      await Voice.stop()
    },
    /** Stop voice recognition and process voice commands */
    async stopVoiceRecognition(){      
      console.log('[VoiceAudio.stopVoiceRecognition] ---------------------------------------------------------------')
      self.isRunning = false
      if (silenceTimeout) {
        clearTimeout(silenceTimeout)
      }      
      const voiceCommand = self.lastVoiceCaptureResult
      self.setResult("")  // Clear out the result 
      await Voice.stop()
    // If we have results, then we need to send them to the server and post them to the screen
      if (voiceCommand) {

        // Check for any special commands
        switch (voiceCommand.toLowerCase()) {
          case "repeat":
            // Repeat the last message from the server
            Tts.speak(self.rootStore.game.gameMessages.slice(-1)[0].value)
            break
          
          default:
            // Not a special command. Send to Zork Server
            self.rootStore.comms.sendMessage(MessageType.game, voiceCommand)
            break
        }
      }
    },
  }))
  .actions((self) => ({
    onSpeechError(e: any) {
      console.log('[VoiceAudio.onSpeechError] ', e)
    },
    onSpeechPartialResults(e: any) {
      console.log('[VoiceAudio.onSpeechPartialResults] ', e)
      // The Voice system can drop results even after we have stopped listening. If we are not running...exit
      if (!self.isRunning) {
        return
      }
      // We have heard the user's voice. Reset the silence timer so we can auto-commit after a certain amount of silence
      if (silenceTimeout) {
        clearTimeout(silenceTimeout)
      }
      silenceTimeout = setTimeout(self.stopVoiceRecognition, self.silenceLength_ms);
    },
    onSpeechResults(e: any) {
      console.log('[VoiceAudio.onSpeechResults] ', e)
      // The Voice system can drop results even after we have stopped listening. If we are not running...exit
      if (!self.isRunning) {
        return
      }

      // We have results from speech capture. Store the results
      if (e.value.length > 0) {
        self.lastVoiceCaptureResult = e.value[0]
      }
    },
    ttsStarted() {
      console.log('[VoiceAudio.ttsStarted]')
      // Stop all Voice Recognition while TTS is speaking
      self.interruptVoiceRecognition()
    },
    ttsFinished() {
      console.log('[VoiceAudio.ttsFinished]')
      // If we are set to Auto-Listen...the start recognition back up once the TTS is done speaking
      if (self.autoListenEnabled && self.voiceIsAvailable) {
        self.startVoiceRecognition()
      }
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    async afterCreate() {
      console.log('VoiceAudio.afterCreate')
      // Voice Recognition (Voice)
      self.setIsAvailable(await Voice.isAvailable() === 1)
      Voice.onSpeechError = self.onSpeechError
      Voice.onSpeechPartialResults = self.onSpeechPartialResults
      Voice.onSpeechResults = self.onSpeechResults
      
      // Text-to-speech (Tts)
      await Tts.voices().then((voices) => {
        voices.filter( voice => voice.language === 'en-US').forEach( english => console.log(`[Comms.afterCreate] `,english))
      }); // List all the Voices on this device
      Tts.setDefaultLanguage('en-US')
      Tts.addEventListener('tts-start', self.ttsStarted)
      Tts.addEventListener('tts-finish', self.ttsFinished)
      
      if (self.voiceId) {
        Tts.setDefaultVoice(self.voiceId)
      }
    },
    beforeDestroy() {
      console.log('VoiceAudio.beforeDestroy')
    },    
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type VoiceAudioStoreType = Instance<typeof VoiceAudioModel>
export interface VoiceAudioStore extends VoiceAudioStoreType {}
type VoiceAudioStoreSnapshotType = SnapshotOut<typeof VoiceAudioModel>
export interface VoiceAudioStoreSnapshot extends VoiceAudioStoreSnapshotType {}
export const createVoiceAudioDefaultModel = () => types.optional(VoiceAudioModel, {})
