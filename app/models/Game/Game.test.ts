import { GameModel } from "./Game"

test("can be created", () => {
  const instance = GameModel.create({})

  expect(instance).toBeTruthy()
})
