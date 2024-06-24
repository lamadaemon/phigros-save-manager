# phigros-save-manager

A simple libaray for modify *Phigros* cloud save data.

[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/phigros-save-manager)](https://www.npmjs.com/package/phigros-save-manager)

---

## Features

- Load binary format save files from local or cloud. Supported version: 
    + user: `1` (Latest)
    + settings: `1` (Latest)
    + gameRecord: `1` (Latest)
    + gameKey: `2` (Latest)
    + gameProgress: `3` (Latest)
- Easly modify save from code.
- (Re)Create binary save files from code.
- Download save file from cloud.
- Upload modified save file to cloud.
- Convient shortcuts
    + re8
        - re8: Reset the chapter 8
        - parcialRe8: Reset half of the chapter 8
        - rere8: Unlock all songs in the chapter 8

## CLI Usage

phigros-save-manager provides a useful CLI to easily reset chapter 8, backup your cloud save, and other debug utilities.

You can use the following command to get detialed subcommand explaination.

```
phigrous-save-manager
```

## Examples

```typescript
// Example: re8 (aka clear unlocks in chapter 8)

import { PhigrosCloudServiceAPI } from 'phigros-save-manager'

const service = await new PhigrosCloudServiceAPI(token).selectProfile(() => true)
const newSave = (await service.getPlayerSave()).re8().createSave()
        
await service.uploadSave(newSave)
```

```typescript
// Example: Edit in-game currency (money):

import { PhigrosCloudServiceAPI } from 'phigros-save-manager'

const service = await new PhigrosCloudServiceAPI(token).selectProfile(() => true)
const save = (await service.getPlayerSave())

save.gameProgress.money[0] = 99
save.gameProgress.money[1] = 99
save.gameProgress.money[2] = 99
save.gameProgress.money[3] = 99
save.gameProgress.money[4] = 99

await service.uploadSave(save.createSave())
```

```typescript
// Exmaple: Edit 'gameProgress' from binary

import { PhigrosSaveManager, PlayerGameProgress } from "."
import fs from 'fs'

const binary = new PlayerGameProgress(PhigrosSaveManager.decrypt(fs.readFileSync("/path/to/gameProgress")));
binary.money[0] = 99

// You'll need a type because the version number is inserted at here
fs.writeFileSync("/path/to/gameProgress", PhigrosSaveManager.encrypt(binary.save(), 'gameProgress'))

```

More examples available in examples folder.