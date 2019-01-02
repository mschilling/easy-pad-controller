export async function setup(opts) {
  const { padName } = opts || {};
  if (!padName) throw new Error('Provide padName');
  return configureMidiPad(padName);
}

async function configureMidiPad(padName) {
  console.log(`Initializing ${padName}`);
  try {
    // Check if WebMIDI is supported
    if (!navigator.requestMIDIAccess)
      throw new Error('Browser does not support WebMIDI API');
    // Initialize Pad
    const midi = await getMidi();
    const inputs = await getMidiInputs(midi);
    const pad = await getMidiPad(inputs, padName);

    console.log(`${padName} initialized`);
    return pad;

  } catch (error) {
    console.warn(error);
  }
}

// Retrieve connected MIDI
async function getMidi(onSuccess, onFailure) {
  const res = await navigator.requestMIDIAccess().then(onSuccess, onFailure);
  if (res.code) throw new Error(`MIDI Init Error. Could not find a midi.`);
  return res;
}

// Retrieves all input MIDI
async function getMidiInputs(midi) {
  const inputs = midi.inputs;
  if (inputs < 1) throw new Error(`MIDI Init Error. No midi inputs found.`);
  return inputs;
}

// Retrieves the correct MIDI
async function getMidiPad(inputs, name) {
  const iterator = inputs.values();
  let pad = iterator.next().value;
  if (!pad) throw new Error('No input pad was found.');
  if (!name) return pad;
  while (pad) {
    if (pad.name === name) return pad;
    pad = iterator.next().value;
  }
  throw new Error(`No pad with name "${name}" was found.`);
}
