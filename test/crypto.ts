import test from 'ava'
import { PhigrosSaveManager } from '../'

const decrypted = 'BwMzLjAEAABjY2NjYwICAgAAAxs='
const expectedEncrypted = 'A2zRnOnCJwHYB6XAjTZ/8QXXswuag51MvNypgWe2i1Z/'

test("Phigros Profile Encrypt", async (t) => {
    t.deepEqual(await PhigrosSaveManager.encrypt(Buffer.from(decrypted, 'base64'), 'gameProgress'), Buffer.from(expectedEncrypted, 'base64'))
})

test("Phigros Profile Decrypt", async (t) => {
    t.deepEqual(await PhigrosSaveManager.decrypt(Buffer.from(expectedEncrypted, 'base64'), 'gameProgress'), Buffer.from(decrypted, 'base64'))
})