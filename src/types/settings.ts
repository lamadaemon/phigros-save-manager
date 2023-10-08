import { PhigrosBinaryFile } from '../phi-binary'

export class PlayerSettings {
    private binary: PhigrosBinaryFile

    public chordSupport: boolean
    public fcAPIndicator: boolean
    public enableHitSound: boolean
    public lowResolutionMode: boolean
    public deviceName: string
    public brightness: number
    public musicVolume: number
    public effectVolume: number
    public hitsoundVolume: number
    public soundOffset: number
    public noteScale: number

    /**
     * 
     * @param buff Decrypted buffer
     */
    constructor(buff: Buffer) {
        this.binary = new PhigrosBinaryFile([
            {
                type: 'boolean',
                field: 'chordSupport'
            },
            {
                type: 'boolean',
                field: 'fcAPIndicator'
            },
            {
                type: 'boolean',
                field: 'enableHitSound'
            },
            {
                type: 'boolean',
                field: 'lowResolutionMode'
            },
            {
                type: 'string',
                field: 'deviceName'
            },
            {
                type: 'float',
                field: 'bright'
            },
            {
                type: 'float',
                field: 'musicVolume'
            },
            {
                type: 'float',
                field: 'effectVolume'
            },
            {
                type: 'float',
                field: 'hsVolume'
            },
            {
                type: 'float',
                field: 'soundOffset'
            },
            {
                type: 'float',
                field: 'noteScale'
            }
        ])

        this.binary.loadBuffer(buff)
        
        /*
            Since I changed the structure of PhigrosBinaryFile so these need to ported to new version
            Old version still working but move to new version can improve performance a little bit

            TODO: Migrate to new version (Checkout GameKey)
        */
        this.chordSupport = <boolean>this.binary.get("chordSupport")
        this.fcAPIndicator = <boolean>this.binary.get("fcAPIndicator")
        this.enableHitSound = <boolean>this.binary.get("enableHitSound")
        this.lowResolutionMode = <boolean>this.binary.get("lowResolutionMode")
        this.deviceName = <string>this.binary.get("deviceName")
        this.brightness = <number>this.binary.get("bright")
        this.musicVolume = <number>this.binary.get("musicVolume")
        this.effectVolume = <number>this.binary.get("effectVolume")
        this.hitsoundVolume = <number>this.binary.get("hsVolume")
        this.soundOffset = <number>this.binary.get('soundOffset')
        this.noteScale = <number>this.binary.get("noteScale")
    }

    save(): Buffer {
        this.binary.clearBuffer()

        this.binary.set("chordSupport", this.chordSupport)
        this.binary.set("fcAPIndicator", this.fcAPIndicator)
        this.binary.set("enableHitSound", this.enableHitSound)
        this.binary.set("lowResolutionMode", this.lowResolutionMode)
        this.binary.set("deviceName", this.deviceName)
        this.binary.set("bright", this.brightness)
        this.binary.set("musicVolume", this.musicVolume)
        this.binary.set("effectVolume", this.effectVolume)
        this.binary.set("hsVolume", this.hitsoundVolume)
        this.binary.set('soundOffset', this.soundOffset)
        this.binary.set("noteScale", this.noteScale)

        return this.binary.saveBuffer() 
    }

}