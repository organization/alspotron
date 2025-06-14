import fs from "fs";
import path from "path";
import { getFile } from "../../../../utils/resource.js"
import "./wasm_exec.js"

async function load() {
  const hangulizeGo = new globalThis.Go();
  const furiganaGo = new globalThis.Go();
  const result = await WebAssembly.instantiate(new Uint8Array(fs.readFileSync(getFile("./assets/hangulize.wasm"))).buffer, hangulizeGo.importObject)
  const furigana = await WebAssembly.instantiate(new Uint8Array(fs.readFileSync(getFile("./assets/furigana.translit.wasm"))).buffer, furiganaGo.importObject)
  hangulizeGo.run(result.instance)
  furiganaGo.run(furigana.instance)
  await globalThis.hangulize.useTranslit("furigana", async (word) => {
    return await globalThis.translit("furigana", word)
  })
}
load()

export async function hangulize(text) {
  return await globalThis.hangulize("jpn", text)
}