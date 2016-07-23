$(document).ready(function(){
	// var scaleMap = new middle_core.OldScaleMap(middle_core.scaleSongs);
	// var songMap = new middle_core.SongMap(middle_core.artistSongs);
	middle_core.MIDI_IO.initGUI(middle_core.artistSongs, middle_core.scaleSongs);
});