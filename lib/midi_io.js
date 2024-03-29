import $ from 'jquery';
import _ from 'lodash';
import {isNoteOff} from './midi_utils';
import {SongMap} from './song_map';
import {ScaleMap} from './scale_map';
import {Scales} from './scales';
export class MIDI_IO{
	constructor(){

  	}

    static setMap(type){
        switch(type){
            case 'song':{
                MIDI_IO.map = MIDI_IO.songMap;
            }
            break;
            case 'scale':{
                MIDI_IO.map = MIDI_IO.scaleMap;
            }
            break;
            default :{
                MIDI_IO.map = MIDI_IO.songMap;
            }
        }
        MIDI_IO.map.reset();
    }

  	static handleMidiIn(t, status, note, vel){
  		vel/=128;
    	let noteOff = isNoteOff(status, vel);
    	let midi = MIDI_IO.map.get(t, status, note, vel);
    	console.log(midi);
        MIDI_IO.stopMIDI(midi.off);
    	MIDI_IO.playMIDI(midi.on, vel);
  	}

  	static playMIDI(midi, vel){
        midi = midi ? midi : [];
  		midi.forEach((note)=>{
  			MIDI_IO.midiOutput.playNote(note, 1, {velocity: vel});
  		});
  	}

  	static stopMIDI(midi){
        midi = midi ? midi : [];
  		midi.forEach((note)=>{
  			MIDI_IO.midiOutput.stopNote(note);
  		});
  	}

    static init(artistSongs, scaleSongs){
        WebMidi.enable(MIDI_IO.webMidiEnable);
        MIDI_IO.songMap = new SongMap(artistSongs);
        MIDI_IO.scaleMap = new ScaleMap(scaleSongs);
    }

	static webMidiEnable(err) {
        if (err) console.log("An error occurred", err);
        console.log("WebMidi enabled.");
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);
        MIDI_IO.initDropdowns();
    }

    static updateTitlesDropdown(selector, data){
        $(selector).empty();
        $('<option/>', {
                value: "None",
                html: "None selected"
                }).appendTo(selector);
        for(var i=0; i< data.length;i++)
        {
        //creates option tag
          $('<option/>', {
                value: data[i],
                html: data[i]
                }).appendTo(selector); //appends to select if parent div has id dropdown
        }
    }

    static updateMidiIODropdown(selector, data){
        $(selector).empty();
        $('<option/>', {
                value: "None",
                html: "None selected"
                }).appendTo(selector);
        for(var i=0; i< data.length;i++)
        {
        //creates option tag
          $('<option/>', {
                value: data[i].name,
                html: data[i].name
                }).appendTo(selector); //appends to select if parent div has id dropdown
        }
    }

    static initDropdowns(){
        MIDI_IO.updateMidiIODropdown('#midiInSelect', WebMidi.inputs);
        MIDI_IO.updateMidiIODropdown('#midiOutSelect', WebMidi.outputs);
        MIDI_IO.updateTitlesDropdown('#songTitlesSelect', MIDI_IO.songMap.titles());
        MIDI_IO.updateTitlesDropdown('#scaleTitlesSelect', MIDI_IO.scaleMap.titles());
        
        var savedMidiIn = localStorage.getItem('midiInput');
        var savedMidiOut = localStorage.getItem('midiOutput');
        console.log(savedMidiIn);
        console.log(savedMidiOut);

        if(!$.isEmptyObject(savedMidiIn)){
            console.log(savedMidiIn);
            MIDI_IO.midiInput = WebMidi.getInputByName(savedMidiIn);
            if(!$.isEmptyObject(MIDI_IO.midiInput)){
                MIDI_IO.updateMidiInput(savedMidiIn);
                $('#midiInSelect').val(savedMidiIn).trigger('chosen:updated');
            }
        }
        else{
            $('#midiInSelect').val('None').trigger('chosen:updated');
        }

        if(!$.isEmptyObject(savedMidiOut)){
            MIDI_IO.midiOutput = WebMidi.getOutputByName(savedMidiOut);
            MIDI_IO.updateMidiOutput(savedMidiOut);
            $('#midiOutSelect').val(savedMidiOut).trigger('chosen:updated');
        }
        else{
            $('#midiOutSelect').val('None').trigger('chosen:updated');
        }
        
        $('#midiInSelect').on('change click', function() {
            MIDI_IO.updateMidiInput($(this).val());
        });

        $('#midiOutSelect').on('change click', function() {
            MIDI_IO.updateMidiOutput($(this).val());
        });

        $('#songTitlesSelect').on('change click', function() {
            MIDI_IO.setMap('song');
            MIDI_IO.map.select($(this).val());
        });

        $('#scaleTitlesSelect').on('change click', function() {
            MIDI_IO.setMap('scale');
            MIDI_IO.map.select($(this).val());
        });
    }

    static updateMidiInput(selected){
        localStorage.setItem('midiInput', selected);
        MIDI_IO.midiInput = WebMidi.getInputByName(selected);
        MIDI_IO.midiInput.removeListener('noteon');
        MIDI_IO.midiInput.removeListener('noteoff');
        MIDI_IO.midiInput.addListener('noteon', 1,
            function (e) {
                var t = e.timestamp;
                var status = e.data[0];
                var note = e.data[1];
                var vel = e.data[2];
                MIDI_IO.handleMidiIn(t, status, note, vel);
                console.log(e);
        });
        MIDI_IO.midiInput.addListener('noteoff', 1,
            function (e) {
                var t = e.timestamp;
                var status = e.data[0];
                var note = e.data[1];
                var vel = e.data[2];
                MIDI_IO.handleMidiIn(t, status, note, vel);
                console.log(e);
        });
    }

    static updateMidiOutput(selected){
        localStorage.setItem('midiOutput', selected);
        MIDI_IO.midiOutput = WebMidi.getOutputByName(selected);
    }

    static speak(){
    	console.log("I am MIDI_IO!!!!!!!!!!!!!!!");
    }
}