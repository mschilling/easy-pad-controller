import { setup } from './midi-setup.js';

const DEFAULT_PAD_NAME = 'WORLDE easy pad';
const DEBUG_LEVEL = 0;

export class EasyPadController {
  constructor() {
    console.log('EasyPad controller');
  }

  async initialize() {
    const pad = await setup({ padName: DEFAULT_PAD_NAME });

    // Setup Events
    const boundOnMidiMessage = this.onMidiMessage.bind(this);
    pad.onmidimessage = boundOnMidiMessage;
  }

  onMidiMessage(event) {
    if (DEBUG_LEVEL > 0) {
      //   console.log(event);
      console.log(event.data);
    }
    const id = event.data[0];
    const keyCode = event.data[1];
    const value = event.data[2];
    const buttonKey = button(id, keyCode);
    const pressState = value > 0 ? 'DOWN' : 'UP';

    const detail = { key: buttonKey, value, event: pressState };

    const gevt = new CustomEvent('PRESS', { detail });
    document.dispatchEvent(gevt);

    if (buttonKey) {
      const evt = new CustomEvent(`${buttonKey}_${pressState}`, { detail });
      document.dispatchEvent(evt);
    }
  }
}

// Retrieve a keyConfig for a certain MIDI
function button(id, key) {
  const dict = {
    '185': {
      '49': 'REPEAT',
      '47': 'PREV',
      '48': 'NEXT',
      '44': 'RECORD',
      '46': 'STOP',
      '45': 'PLAY'
    },
    '153': {
      '1': 'START',
      '2': 'SELECT',
      '39': 'PAD_1',
      '48': 'PAD_2',
      '45': 'PAD_3',
      '43': 'PAD_4',
      '51': 'PAD_5',
      '49': 'PAD_6',
      '36': 'PAD_7',
      '38': 'PAD_8',
      '40': 'PAD_9',
      '42': 'PAD_10',
      '44': 'PAD_11',
      '46': 'PAD_12'
    }
  };
  return dict[id][key];
}
