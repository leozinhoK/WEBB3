import { Router } from "express";
import { randomUUID } from "node:crypto";
import { Database } from "../database";

const userRoute = Router();
const database = new Database();
const table = "user";

userRoute.get("/", (request, response) => {
  const user = database.select(table);
  response.json(user);
});

userRoute.get("/:id", (request, response) => {
  const { id } = request.params;
  const result = database.select(table, id);

  if (result === undefined)
    response.status(400).json({ msg: "Erro! Esse contato não foi encontrado." });

  response.json(result);
});

userRoute.post("/", (request, response) => {
  const { name, avatar, celular } = request.body;
  const user = {
    id: randomUUID(),
    name,
    avatar,
    celular
  };

  console.log(`INFORMAÇÕES DO CONTATO:\n${JSON.stringify(user, null, 2)} `);
  database.insert(table, user);
  response.status(201).json({ msg: "Parabéns! Contato cadastrado com sucesso." });
});

userRoute.delete("/:id", (request, response) => {
  const { id } = request.params;
  const userExist: any = database.select(table, id);

  if (userExist === undefined)
    return response.status(400).json({ msg: "Erro! Esse contato não foi encontrado." });

  database.delete(table, id);
  response
    .status(202)
    .json({ msg: `Alteração! ${userExist.name} foi apagado com sucesso.` });
});

userRoute.put("/:id", (request, response) => {
  const { id } = request.params;
  const { name, avatar, celular } = request.body;
  const userExist: any = database.select(table, id);

  if (userExist === undefined)
    return response.status(400).json({ msg: "Erro! Esse contato não foi encontrado." });

  database.update(table, id, { name, avatar, celular });
  response.status(201).json({ msg: `O ID: {${id}} foi alterado banco` });
});

export { userRoute };
