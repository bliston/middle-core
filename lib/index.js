const version = '0.3.1'

import artistSongs from '../assets/json/artist-songs.json';

import scaleSongs from '../assets/json/scale-songs.json';

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

import {
  MIDIUtils,
  isNoteOff
} from './midi_utils'

import {
  Scales
} from './scales'

const middle_core = {
  version,
  artistSongs,
  scaleSongs,
  updateSettings,
  getSettings,
  MIDIEvent,
  MIDI_IO,
  MIDIMap,
  SongMap,
  ScaleMap,
  MIDIUtils,
  isNoteOff,
  Scales

  }

export default middle_core

export {
  version,
  artistSongs,
  scaleSongs,
  updateSettings,
  getSettings,
  MIDIEvent,
  MIDI_IO,
  MIDIMap,
  SongMap,
  ScaleMap,
  MIDIUtils,
  isNoteOff,
  Scales
}
