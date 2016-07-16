import assert from 'assert';

import middle_core from '../lib/index.js';

describe('midi event', () => {
  it('should print', done => {
      assert.equal('I am a MIDI event!', middle_core.MIDIEvent.speak());
      done();
  });
});
