import { CommsModel } from "./Comms"

test("can be created", () => {
  const instance = CommsModel.create({})

  expect(instance).toBeTruthy()
})
