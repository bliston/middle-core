const version = '0.0.1'

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
  ScaleMap
} from './scale_map'

const middle_core = {
  version,
  MIDI_IO,
  // from ./midi_event
  MIDIEvent,
  updateSettings,
  getSettings,
  MIDIMap,
  SongMap,
  ScaleMap

  }

export default middle_core

export {
  version,
  MIDI_IO,
  // from ./midi_event
  MIDIEvent,
  updateSettings,
  getSettings
}
