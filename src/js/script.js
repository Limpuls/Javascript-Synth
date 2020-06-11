var $ = require("jquery");
/*var dial = new Nexus.Dial('#dial',{
  'size': [75,75],
  'interaction': 'radial', // "radial", "vertical", or "horizontal"
  'mode': 'relative', // "absolute" or "relative"
  'min': 0,
  'max': 20000,
  'step': 1,
  'value': 220
})*/
var knob = document.getElementById("dial");
var audioCtx;
var volume;
var osc;
var filter;
var presetsArr = []; //= [600];
//var presetsArr;
var play = document.getElementById("play");
var stopp = document.getElementById("stop");
var sine = document.getElementById("sine");
var saw = document.getElementById("saw");
var square = document.getElementById("square");
var triangle = document.getElementById("triangle");
var dropdown = document.getElementById("dropdown").getElementsByTagName("option");
var drop = document.getElementById("dropdown");

var filterFreq = document.getElementById("filter-freq");
var filterQ = document.getElementById("Q");
var filterGain = document.getElementById("freq-gain");

var filterFreqSlider = document.getElementById("filter-freqSlider");
var filterQSlider = document.getElementById("QSlider");
var filterGainSlider = document.getElementById("freq-gainSlider");

var freqSlider = document.getElementById('freqSlider');
var freqDisplay = document.getElementById('freq');
var detuneSlider = document.getElementById('detuneSlider');
var detuneDisplay = document.getElementById('detune');
var gainSlider = document.getElementById('gainSlider');
var gainDisplay = document.getElementById('gain');
var octaveup = document.getElementById("octaveUp");
var octavedown = document.getElementById("octaveDown");
var resetPreset = document.getElementById("reset");
var booleanVal;
var notes = document.querySelectorAll('.note');
var octaveNumber;


if (!localStorage.getItem("presetsArr") || localStorage.getItem("presetsArr").length < 0) {
  init();
} else {
  initIfLocalStorage(presetsArr);
}
function init() {
  octaveNumber = document.getElementById("octaveNum");
  audioCtx = new (window.AudioContext || window.webkitAudioContext);
  osc = audioCtx.createOscillator();
  volume = audioCtx.createGain();
  filter = audioCtx.createBiquadFilter();
  osc.connect(filter);
  volume.connect(audioCtx.destination);
  booleanVal = false;
  osc.frequency.value = dial.value
  osc.start();
  gainDisplay.innerHTML = gainSlider.value;
  //localStorage.setItem("test", "Hello World");
  noteSetOscFreq()
  octaveUpClick()
  octaveDownClick()
  waveFormSelector()
}

function initIfLocalStorage(presetsArr) {
  octaveNumber = document.getElementById("octaveNum");
  audioCtx = new (window.AudioContext || window.webkitAudioContext);
  osc = audioCtx.createOscillator();
  volume = audioCtx.createGain();
  filter = audioCtx.createBiquadFilter();
  osc.connect(filter);
  volume.connect(audioCtx.destination);
  booleanVal = false;
  osc.start();

  presetsArr = JSON.parse(localStorage.getItem('presetsArr'));

  for (var i = 0; i < presetsArr.length; i++) {
    if (presetsArr[i].freq) {
      osc.frequency.value = presetsArr[i].freq;
      knob.value = presetsArr[i].freq;
      dial.value = presetsArr[i].freq;
      freqDisplay.innerHTML = knob.value;
    }
    if (presetsArr[i].detune) {
    osc.detune.value = presetsArr[i].detune;
    detuneSlider.value = presetsArr[i].detune;
    detuneDisplay.innerHTML = detuneSlider.value;
    }
    if (presetsArr[i].gain) {
    volume.gain.value = presetsArr[i].gain;
    gainSlider.value = presetsArr[i].gain;
    gainDisplay.innerHTML = gainSlider.value;
    }
    if (presetsArr[i].osc) {
      osc.type = presetsArr[i].osc;
      console.log(osc.type);
    }
    if (presetsArr[i].filterType) {
      drop.value = presetsArr[i].filterType;
      filter.type = presetsArr[i].filterType;
    //  dropdown.selected
      console.log(drop);
    }
    if (presetsArr[i].filterFreq) {
      filter.frequency.value = presetsArr[i].filterFreq;
      filterFreqSlider.value = presetsArr[i].filterFreq;
      filterFreq.innerHTML = filterFreqSlider.value;
      console.log(filter.frequency.value);
    }
    if (presetsArr[i].filterQ) {
      filter.Q.value = presetsArr[i].filterQ;
      filterQSlider.value = presetsArr[i].filterQ;
      filterQ.innerHTML = filterFreqSlider.value;
      //console.log(filter.frequency.value);
    }
    if (presetsArr[i].filterGain) {
      filter.gain.value = presetsArr[i].filterGain;
      filterGainSlider.value = presetsArr[i].filterGain;
      filterGain.innerHTML = filterFreqSlider.value;
      //console.log(filter.frequency.value);
    }
    if (presetsArr[i].octaveUp) {
      octaveNumber.dataset.value = presetsArr[i].octaveUp;
      octaveNumber.innerHTML = 'Octave' + " " + octaveNumber.dataset.value;
      Array.prototype.forEach.call(notes, function (notes) {
        console.log(notes.value*=2);
      });
    }
    if (presetsArr[i].octaveDown) {
      octaveNumber.dataset.value = presetsArr[i].octaveDown;
      octaveNumber.innerHTML = 'Octave' + " " + octaveNumber.dataset.value;
      Array.prototype.forEach.call(notes, function (notes) {
        console.log(notes.value/=2);
      });
    }
  }



  console.log(osc.frequency.value);
  console.log(osc.detune.value);
  noteSetOscFreq()
  octaveUpClick()
  octaveDownClick()
  waveFormSelector()
}

function initPreset() {
  //stop();
  osc.type = "sine";
  knob.value = "220";
  dial.value = "220";
  osc.frequency.value = knob.value;
  freqDisplay.innerHTML = knob.value;
  volume.gain.value = 0.2;
  gainSlider.value = volume.gain.value;
  gainDisplay.innerHTML = gainSlider.value;
  osc.detune.value = 0;
  detuneSlider.value = osc.detune.value;
  detuneDisplay.innerHTML = detuneSlider.value;
  Array.prototype.forEach.call(notes, function (notes) {
    console.log(notes.value = notes.dataset.default);
    booleanVal = false;
})
  octaveNumber.dataset.value = 0;
  octaveNumber.innerHTML = 'Octave' + " " + octaveNumber.dataset.value;
  for (var i = 0, l = dropdown.length; i < l; i++) {
    dropdown[i].selected = dropdown[i].defaultSelected;
}
  filterFreq.value = "140";
  filter.frequency.value = filterFreq.value;
  filterFreqSlider.value = filter.frequency.value;
  filterFreq.innerHTML = filterFreqSlider.value;

  filterQ.value = "0";
  filter.Q.value = filterQ.value;
  filterQSlider.value = filter.Q.value;
  filterQ.innerHTML = filterQSlider.value;

  filterGain.value = "0";
  filter.gain.value = filterGain.value;
  filterGainSlider.value = filter.gain.value;
  filterGain.innerHTML = filterGainSlider.value;

  /*for (var i = 0; i < presetsArr.length; i++) {
    osc.frequency.value = presetsArr[i];
  }*/
  localStorage.clear();
  presetsArr = [];
}

resetPreset.addEventListener('click', initPreset);

function noteSetOscFreq() {
  addEventListenerBySelector('.set li', 'click', function (event) {
    if (booleanVal == false) {
      osc.frequency.value = this.value;
      console.log(osc.frequency.value);
    } else {
      //osc.frequency.value = notes.value*= 2;
      console.log(osc.frequency.value);
    }
  });
}

function octaveUpClick() {
  octaveup.addEventListener("click", function(e) {
    if (booleanVal == false) {
      booleanVal = true;
      octaveNumber.dataset.value = parseInt(octaveNumber.dataset.value) + 1;
      octaveNumber.innerHTML = 'Octave' + " " + octaveNumber.dataset.value;
      console.log(octaveNumber.dataset.value);
      bookmark["octaveUp"] = octaveNumber.dataset.value;
      presetsArr = JSON.parse(localStorage.getItem('presetsArr')) || [];
      presetsArr.push(bookmark);
      localStorage.setItem("presetsArr", JSON.stringify(presetsArr));
      Array.prototype.forEach.call(notes, function (notes) {
        console.log(notes.value*=2);
        booleanVal = false;
      });
    } else {
      //booleanVal = false;
    }
  })
}

function octaveDownClick() {
  octavedown.addEventListener("click", function() {
    octaveNumber.dataset.value = parseInt(octaveNumber.dataset.value) - 1;
    octaveNumber.innerHTML = 'Octave' + " " + octaveNumber.dataset.value;
    console.log(octaveNumber.dataset.value);
    bookmark["octaveDown"] = octaveNumber.dataset.value;
    presetsArr = JSON.parse(localStorage.getItem('presetsArr')) || [];
    presetsArr.push(bookmark);
    localStorage.setItem("presetsArr", JSON.stringify(presetsArr));
    Array.prototype.forEach.call(notes, function (notes) {
      console.log(notes.value/=2);
    });
  });
}

function waveFormSelector() {
  addEventListenerBySelector('.waveshapes button', 'click', function (event) {
    osc.type = event.target.value;
    bookmark["osc"] = osc.type;
    presetsArr = JSON.parse(localStorage.getItem('presetsArr')) || [];
    presetsArr.push(bookmark);
    localStorage.setItem("presetsArr", JSON.stringify(presetsArr));
  });
}

function addEventListenerBySelector(selector, e, fn) {
  var list = document.querySelectorAll(selector);
  for (var i = 0; i < list.length; i++) {
    list[i].addEventListener(e, fn, false);
  }
}

  knob.addEventListener("click", function(e) {
    osc.frequency.value = dial.value;
    freqDisplay.innerHTML = dial.value;
    bookmark["freq"] = osc.frequency.value;
    presetsArr = JSON.parse(localStorage.getItem('presetsArr')) || [];
    presetsArr.push(bookmark);
    localStorage.setItem("presetsArr", JSON.stringify(presetsArr));
  })

  detuneSlider.addEventListener("click", function(e) {
    osc.detune.value = this.value;
    detune.innerHTML = this.value;
    bookmark["detune"] = osc.detune.value;
    presetsArr = JSON.parse(localStorage.getItem('presetsArr')) || [];
    presetsArr.push(bookmark);
    localStorage.setItem("presetsArr", JSON.stringify(presetsArr));
  })

  gainSlider.addEventListener("click", function(e) {
    audioCtx.resume();
    volume.gain.value = this.value;
    gainDisplay.innerHTML = this.value;
    console.log(this.value);
    bookmark["gain"] = volume.gain.value;
    presetsArr = JSON.parse(localStorage.getItem('presetsArr')) || [];
    presetsArr.push(bookmark);
    localStorage.setItem("presetsArr", JSON.stringify(presetsArr));
  })

  filterFreqSlider.addEventListener("click", function(event) {
    filter.frequency.value = event.target.value;
    filterFreq.innerHTML = filter.frequency.value;
    bookmark["filterFreq"] = filter.frequency.value;
    presetsArr = JSON.parse(localStorage.getItem('presetsArr')) || [];
    presetsArr.push(bookmark);
    localStorage.setItem("presetsArr", JSON.stringify(presetsArr));
  })

  filterQSlider.addEventListener("click", function(event) {
    filter.Q.value = event.target.value;
    filterQ.innerHTML = filter.Q.value;
    bookmark["filterQ"] = filter.Q.value;
    presetsArr = JSON.parse(localStorage.getItem('presetsArr')) || [];
    presetsArr.push(bookmark);
    localStorage.setItem("presetsArr", JSON.stringify(presetsArr));
  })

  filterGainSlider.addEventListener("click", function(event) {
    filter.gain.value = event.target.value;
    filterGain.innerHTML = filter.gain.value;
    bookmark["filterGain"] = filter.gain.value;
    presetsArr = JSON.parse(localStorage.getItem('presetsArr')) || [];
    presetsArr.push(bookmark);
    localStorage.setItem("presetsArr", JSON.stringify(presetsArr));
  })



drop.addEventListener("change", function(event) {
  var filterTypes = ["allpass", "lowpass", "highpass", "bandpass", "peaking"];
  for (i = 0; i < filterTypes.length; i++) {
    if (event.target.value == filterTypes[i]) {
      filter.type = event.target.value;
      bookmark["filterType"] = this.value;
      presetsArr = JSON.parse(localStorage.getItem('presetsArr')) || [];
      presetsArr.push(bookmark);
      localStorage.setItem("presetsArr", JSON.stringify(presetsArr));
      //filter.connect(volume)
      //osc.connect(filter)
      if (filter.type == 'lowpass') {
        filter.frequency.value = filterProperties[0].filterfrequencyvalue;
        filter.Q.value = filterProperties[0].filterQvalue;
        filter.gain.value = filterProperties[0].filtergainvalue;
      }
      if (filter.type == 'highpass') {
        filter.frequency.value = filterProperties[1].filterfrequencyvalue;
        filter.Q.value = filterProperties[1].filterQvalue;
        filter.gain.value = filterProperties[1].filtergainvalue;
      }
      if (filter.type == 'bandpass') {
        filter.frequency.value = filterProperties[2].filterfrequencyvalue;
        filter.Q.value = filterProperties[2].filterQvalue;
        filter.gain.value = filterProperties[2].filtergainvalue;
      }
      if (filter.type == 'peaking') {
        filter.frequency.value = filterProperties[3].filterfrequencyvalue;
        filter.Q.value = filterProperties[3].filterQvalue;
        filter.gain.value = filterProperties[3].filtergainvalue;
      }
      if (filter.type == "none") {
          //filter.disconnect(volume);
          //osc.connect(volume);
          //filter.type = "allpass";
        }
      console.log(filter.type);
    }
  }
})

var filterProperties = [{
  filterfrequencyvalue:140,
  filterQvalue:0,
  filtergainvalue:0
},
{
  filterfrequencyvalue:540,
  filterQvalue:0,
  filtergainvalue:0
},
{
  filterfrequencyvalue:1040,
  filterQvalue:0,
  filtergainvalue:0
},
{
  filterfrequencyvalue:740,
  filterQvalue:0,
  filtergainvalue:0
}]

play.onclick = start;
stopp.onclick = stop;

function start() {
    UI('start');
    volume.gain.value = gainSlider.value;
    filter.connect(volume);
}

function stop() {
    UI('stop');
    filter.disconnect(volume);
}

function UI(state) {
    switch (state) {
        case 'start':
            play.disabled = true;
            stop.disabled = false;
            break;
        case 'stop':
            play.disabled = false;
            stop.disabled = true;
            break;
        case 'reset':

    }
}




//localStorage.setItem("presetsArr", JSON.stringify(presetsArr));
//var presetsArr = JSON.parse(localStorage.getItem('presetsArr'));
var bookmark = {};
/*bookmark["freq"] = osc.frequency.value;
bookmark["detune"] = osc.detune.value;
presetsArr.push(bookmark);
console.log(presetsArr[0].freq);
console.log(presetsArr[0].detune);*/
