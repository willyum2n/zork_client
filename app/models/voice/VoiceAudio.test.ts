import { VoiceAudioModel } from "./VoiceAudio"

test("can be created", () => {
  const instance = VoiceAudioModel.create({})

  expect(instance).toBeTruthy()
})
