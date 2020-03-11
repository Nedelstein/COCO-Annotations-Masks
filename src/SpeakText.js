function speakText(inputTxt) {
  let synth = window.speechSynthesis;
  let utterThis = new SpeechSynthesisUtterance(inputTxt);
  let voices = synth.getVoices();
  //   for (let i = 0; i < voices.length; i++) {
  utterThis.voice = voices[7];
  //   }
  utterThis.rate = 0.6;
  synth.speak(utterThis);
}

export default speakText;
