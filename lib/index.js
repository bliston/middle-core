const version = '0.3.1'

import {
  updateSettings,
  getSettings,
} from './settings'

import {
  MIDIEvent
} from './midi_event'

import {
  MIDI_IO
} from './midi_io'

import {
  MIDIMap
} from './midi_map'

import {
  SongMap
} from './song_map'

import {
  OldScaleMap
} from './old_scale_map'

import {
  MIDIUtils
} from './midi_utils'

import {
  Scales
} from './scales'

const middle_core = {
  version,
  updateSettings,
  getSettings,
  MIDIEvent,
  MIDI_IO,
  MIDIMap,
  SongMap,
  OldScaleMap,
  MIDIUtils,
  Scales

  }

export default middle_core

export {
  updateSettings,
  getSettings,
  MIDIEvent,
  MIDI_IO,
  MIDIMap,
  SongMap,
  OldScaleMap,
  MIDIUtils,
  Scales
}
