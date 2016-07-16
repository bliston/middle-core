const version = '0.0.0'

import {
  updateSettings,
  getSettings,
} from './settings'

import {
  MIDIEvent
} from './midi_event'



const middle_core = {
  version,

  // from ./midi_event
  MIDIEvent,
  updateSettings,
  getSettings

  }

export default middle_core

export {
  version,

  // from ./midi_event
  MIDIEvent,
  updateSettings,
  getSettings
}
