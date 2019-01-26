const DialogTree = {
  counter: -1,
  getPrompt(){
    this.counter++;
    return [{
      placement: "left",
      name: "MC",
      phrase: "Wow I wish I had a friend for my birthday"
    },{
      placement: "right",
      name: "CrepyCarl",
      phrase: "HEy man ill be your friend"
    },{
      placement: "left",
      name: "MC",
      phrase: "Not you carl :("
    },{
      placement: "left",
      name: "MC",
      phrase: "Time to summon that demon"
    }][this.counter];
  }
};
export { DialogTree };