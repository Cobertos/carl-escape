const DialogTree = {
  counter: -1,
  getPrompt(){
    this.counter++;
    return [
      "MC: Wow I really wish I had friends",
      "CrepyCarl: HEy man ill be your friend",
      "MC: Not you carl :(",
      "MC: Time to summon that demon"
    ][this.counter];
  }
};
export { DialogTree };