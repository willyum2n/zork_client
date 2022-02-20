import { VoiceModel } from "./voice"

test("can be created", () => {
  const instance = VoiceModel.create({})

  expect(instance).toBeTruthy()
})
