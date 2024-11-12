import { FieldEntry, PhigrosBinaryFile } from "../phi-binary"

export class PlayerInformation {
    static readonly VERSION = 1
    private binary: PhigrosBinaryFile
    
    public _showPlayerID: FieldEntry
    public _description: FieldEntry
    public _avatar: FieldEntry
    public _background: FieldEntry
    
    /**
     * 
     * @param buff Decrypted buffer
     */
    constructor(buff: Buffer) {
        this.binary = new PhigrosBinaryFile([
            {
                type: 'boolean',
                field: 'showPlayerID'
            },
            {
                type: 'string',
                field: 'description'
            },
            {
                type: 'string',
                field: 'avatar'
            },
            {
                type: 'string',
                field: 'bg'
            },
        ], buff)

        if (this.binary.fileVersion !== PlayerInformation.VERSION) {
            throw new Error(`Unsupported version of user ! Expected: ${PlayerInformation.VERSION}, got: ${this.binary.fileVersion}`)
        }

        this._showPlayerID = this.binary.getEntry('showPlayerID')!
        this._description = this.binary.getEntry('description')!
        this._avatar = this.binary.getEntry('avatar')!
        this._background = this.binary.getEntry('bg')!
    }

    save(): Buffer {
        this.binary.clearBuffer()

        this.binary.setEntry(this._showPlayerID)
        this.binary.setEntry(this._description)
        this.binary.setEntry(this._avatar)
        this.binary.setEntry(this._background)
        
        return this.binary.saveBuffer()
    }

    get showPlayerID(): boolean {
        return this._showPlayerID.value
    }

    set showPlayerID(show: boolean) {
        this._showPlayerID.value = show
    }

    get description(): string {
        return this._description.value
    }

    set description(desc: string) {
        this._description.value = desc
    }

    get avatar(): string {
        return this._avatar.value
    }

    set avatar(avatar: string) {
        this._avatar.value = avatar
    }

    get background(): string {
        return this._background.value
    }

    set background(bg: string) {
        this._background.value = bg
    }

}