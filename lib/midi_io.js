import $ from 'jquery';
import _ from 'lodash';
export class MIDI_IO{

    static initGUI(){
        WebMidi.enable(this.webMidiEnable);
        //songJSON = $.getJSON( "../assets/json/songs.json" );
    }
	webMidiEnable(err) {
        if (err) console.log("An error occurred", err);
        console.log("WebMidi enabled.");
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);
        this.initDropdowns();
    }

    updateMidiIODropdown(selector, data){
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

    initDropdowns(){
        this.updateMidiIODropdown('#midiInSelect', WebMidi.inputs);
        this.updateMidiIODropdown('#midiOutSelect', WebMidi.outputs);
        
        var savedMidiIn = localStorage.getItem('midiInput');
        var savedMidiOut = localStorage.getItem('midiOutput');
        console.log(savedMidiIn);
        console.log(savedMidiOut);

        if(!$.isEmptyObject(savedMidiIn)){
            console.log(savedMidiIn);
            midiInput = WebMidi.getInputByName(savedMidiIn);
            if(!$.isEmptyObject(midiInput)){
                this.updateMidiInput(savedMidiIn);
                $('#midiInSelect').val(savedMidiIn).trigger('chosen:updated');
            }
        }
        else{
            $('#midiInSelect').val('None').trigger('chosen:updated');
        }

        if(!$.isEmptyObject(savedMidiOut)){
            midiOutput = WebMidi.getOutputByName(savedMidiOut);
            this.updateMidiOutput(savedMidiOut);
            $('#midiOutSelect').val(savedMidiOut).trigger('chosen:updated');
        }
        else{
            $('#midiOutSelect').val('None').trigger('chosen:updated');
        }
        
        $('#midiInSelect').change(function() {
            this.updateMidiInput($(this).val());
        });

        $('#midiOutSelect').change(function() {
            this.updateMidiOutput($(this).val());
        });
    }

    updateMidiInput(selected){
        localStorage.setItem('midiInput', selected);
        midiInput = WebMidi.getInputByName(selected);
        midiInput.removeListener('noteon');
        midiInput.removeListener('noteoff');
        midiInput.addListener('noteon', 1,
            function (e) {
                var t = e.timestamp;
                var status = e.data[0];
                var note = e.data[1];
                var vel = e.data[2];
                this.handleMidiIn(t, status, note, vel);
                console.log(e);
        });
        midiInput.addListener('noteoff', 1,
            function (e) {
                var t = e.timestamp;
                var status = e.data[0];
                var note = e.data[1];
                var vel = e.data[2];
                this.handleMidiIn(t, status, note, vel);
                console.log(e);
        });
    }

    updateMidiOutput(selected){
        localStorage.setItem('midiOutput', selected);
        midiOutput = WebMidi.getOutputByName(selected);
    }
}