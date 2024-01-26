import { FieldEntry, PhigrosBinaryFile } from '../phi-binary'

export class PlayerSettings {
    private binary: PhigrosBinaryFile

    public chordSupport: FieldEntry
    public fcAPIndicator: FieldEntry
    public enableHitSound: FieldEntry
    public lowResolutionMode: FieldEntry
    public deviceName: FieldEntry
    public brightness: FieldEntry
    public musicVolume: FieldEntry
    public effectVolume: FieldEntry
    public hitsoundVolume: FieldEntry
    public soundOffset: FieldEntry
    public noteScale: FieldEntry

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
        
        this.chordSupport = this.binary.getEntry("chordSupport")!
        this.fcAPIndicator = this.binary.getEntry("fcAPIndicator")!
        this.enableHitSound = this.binary.getEntry("enableHitSound")!
        this.lowResolutionMode = this.binary.getEntry("lowResolutionMode")!
        this.deviceName = this.binary.getEntry("deviceName")!
        this.brightness = this.binary.getEntry("bright")!
        this.musicVolume = this.binary.getEntry("musicVolume")!
        this.effectVolume = this.binary.getEntry("effectVolume")!
        this.hitsoundVolume = this.binary.getEntry("hsVolume")!
        this.soundOffset = this.binary.getEntry('soundOffset')!
        this.noteScale = this.binary.getEntry("noteScale")!
    }

    save(): Buffer {
        this.binary.clearBuffer()

        this.binary.setEntry(this.chordSupport)
        this.binary.setEntry(this.fcAPIndicator)
        this.binary.setEntry(this.enableHitSound)
        this.binary.setEntry(this.lowResolutionMode)
        this.binary.setEntry(this.deviceName)
        this.binary.setEntry(this.brightness)
        this.binary.setEntry(this.musicVolume)
        this.binary.setEntry(this.effectVolume)
        this.binary.setEntry(this.hitsoundVolume)
        this.binary.setEntry(this.soundOffset)
        this.binary.setEntry(this.noteScale)

        return this.binary.saveBuffer() 
    }

    get chordSupportValue(): boolean {
        return this.chordSupport.value
    }
    
    set chordSupportValue(value: boolean) {
        this.chordSupport.value = value
    }

    get fcAPIndicatorValue(): boolean {
        return this.fcAPIndicator.value
    }

    set fcAPIndicatorValue(value: boolean) {
        this.fcAPIndicator.value = value
    }

    get enableHitSoundValue(): boolean {
        return this.enableHitSound.value
    }

    set enableHitSoundValue(value: boolean) {
        this.enableHitSound.value = value
    }

    get lowResolutionModeValue(): boolean {
        return this.lowResolutionMode.value
    }

    set lowResolutionModeValue(value: boolean) {
        this.lowResolutionMode.value = value
    }

    get deviceNameValue(): string {
        return this.deviceName.value
    }

    set deviceNameValue(value: string) {
        this.deviceName.value = value
    }

    get brightnessValue(): number {
        return this.brightness.value
    }

    set brightnessValue(value: number) {
        this.brightness.value = value
    }

    get musicVolumeValue(): number {
        return this.musicVolume.value
    }

    set musicVolumeValue(value: number) {
        this.musicVolume.value = value
    }

    get effectVolumeValue(): number {
        return this.effectVolume.value
    }

    set effectVolumeValue(value: number) {
        this.effectVolume.value = value
    }

    get hitsoundVolumeValue(): number {
        return this.hitsoundVolume.value
    }

    set hitsoundVolumeValue(value: number) {
        this.hitsoundVolume.value = value
    }

    get soundOffsetValue(): number {
        return this.soundOffset.value
    }

    set soundOffsetValue(value: number) {
        this.soundOffset.value = value
    }

    get noteScaleValue(): number {
        return this.noteScale.value
    }

    set noteScaleValue(value: number) {
        this.noteScale.value = value
    }

}