import { FieldEntry, PhigrosBinaryFile } from '../phi-binary'

export class PlayerSettings {
    private binary: PhigrosBinaryFile

    public _chordSupport: FieldEntry
    public _fcAPIndicator: FieldEntry
    public _enableHitSound: FieldEntry
    public _lowResolutionMode: FieldEntry
    public _deviceName: FieldEntry
    public _brightness: FieldEntry
    public _musicVolume: FieldEntry
    public _effectVolume: FieldEntry
    public _hitsoundVolume: FieldEntry
    public _soundOffset: FieldEntry
    public _noteScale: FieldEntry

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
        
        this._chordSupport = this.binary.getEntry("chordSupport")!
        this._fcAPIndicator = this.binary.getEntry("fcAPIndicator")!
        this._enableHitSound = this.binary.getEntry("enableHitSound")!
        this._lowResolutionMode = this.binary.getEntry("lowResolutionMode")!
        this._deviceName = this.binary.getEntry("deviceName")!
        this._brightness = this.binary.getEntry("bright")!
        this._musicVolume = this.binary.getEntry("musicVolume")!
        this._effectVolume = this.binary.getEntry("effectVolume")!
        this._hitsoundVolume = this.binary.getEntry("hsVolume")!
        this._soundOffset = this.binary.getEntry('soundOffset')!
        this._noteScale = this.binary.getEntry("noteScale")!
    }

    save(): Buffer {
        this.binary.clearBuffer()

        this.binary.setEntry(this._chordSupport)
        this.binary.setEntry(this._fcAPIndicator)
        this.binary.setEntry(this._enableHitSound)
        this.binary.setEntry(this._lowResolutionMode)
        this.binary.setEntry(this._deviceName)
        this.binary.setEntry(this._brightness)
        this.binary.setEntry(this._musicVolume)
        this.binary.setEntry(this._effectVolume)
        this.binary.setEntry(this._hitsoundVolume)
        this.binary.setEntry(this._soundOffset)
        this.binary.setEntry(this._noteScale)

        return this.binary.saveBuffer() 
    }

    get chordSupport(): boolean {
        return this._chordSupport.value
    }

    set chordSupport(newVal: boolean) {
        this._chordSupport.value = newVal
    }

    get fcAPIndicator(): boolean {
        return this._fcAPIndicator.value
    }

    set fcAPIndicator(newVal: boolean) {
        this._fcAPIndicator.value = newVal
    }

    get enableHitSound(): boolean {
        return this._enableHitSound.value
    }

    set enableHitSound(newVal: boolean) {
        this._enableHitSound.value = newVal
    }

    get lowResolutionMode(): boolean {
        return this._lowResolutionMode.value
    }

    set lowResolutionMode(newVal: boolean) {
        this._lowResolutionMode.value = newVal
    }

    get deviceName(): string {
        return this._deviceName.value
    }

    set deviceName(newVal: string) {
        this._deviceName.value = newVal
    }

    get brightness(): number {
        return this._brightness.value
    }

    set brightness(newVal: number) {
        this._brightness.value = newVal
    }

    get musicVolume(): number {
        return this._musicVolume.value
    }

    set musicVolume(newVal: number) {
        this._musicVolume.value = newVal
    }

    get effectVolume(): number {
        return this._effectVolume.value
    }

    set effectVolume(newVal: number) {
        this._effectVolume.value = newVal
    }

    get hitsoundVolume(): number {
        return this._hitsoundVolume.value
    }

    set hitsoundVolume(newVal: number) {
        this._hitsoundVolume.value = newVal
    }

    get soundOffset(): number {
        return this._soundOffset.value
    }

    set soundOffset(newVal: number) {
        this._soundOffset.value = newVal
    }

    get noteScale(): number {
        return this._noteScale.value
    }

    set noteScale(newVal: number) {
        this._noteScale.value = newVal
    }

}