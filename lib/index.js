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
  PremadeSongMap
} from './premade_song_map'

const middle_core = {
  version,
  MIDI_IO,
  // from ./midi_event
  MIDIEvent,
  updateSettings,
  getSettings,
  PremadeSongMap

  }

export default middle_core

export {
  version,
  MIDI_IO,
  // from ./midi_event
  MIDIEvent,
  updateSettings,
  getSettings,
  PremadeSongMap
}
