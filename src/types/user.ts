import { PhigrosBinaryFile } from "../phi-binary"

export class PlayerInformation {
    private binary: PhigrosBinaryFile
    
    public showPlayerID: boolean
    public description: string
    public avatar: string
    public background: string
    
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
        ])

        this.binary.loadBuffer(buff)
        
        /*
            Since I changed the structure of PhigrosBinaryFile so these need to ported to new version
            Old version still working but move to new version can improve performance a little bit

            TODO: Migrate to new version (Checkout GameKey)
        */
        this.showPlayerID = <boolean>this.binary.get('showPlayerID')
        this.description = <string>this.binary.get('description')
        this.avatar = <string>this.binary.get('avatar')
        this.background = <string>this.binary.get('bg')
    }

    save(): Buffer {
        this.binary.clearBuffer()

        this.binary.set('showPlayerID', this.showPlayerID)
        this.binary.set('description', this.description)
        this.binary.set('avatar', this.avatar)
        this.binary.set('bg', this.background)
        
        return this.binary.saveBuffer()
    }
}