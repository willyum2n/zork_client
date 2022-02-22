import { GameMessageModel } from "./GameMessage"

test("can be created", () => {
  const instance = GameMessageModel.create({})

  expect(instance).toBeTruthy()
})
