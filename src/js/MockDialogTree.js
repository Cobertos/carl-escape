const DialogTree = {
  counter: -1,
  getPrompt(){
    this.counter++;
    return [{
      placement: "left",
      name: "MC",
      phrase: "Wow I wish I had a friend for my birthday",
      background: "bedroom"
    },{
      placement: "right",
      name: "CrepyCarl",
      phrase: "HEy man ill be your friend",
      background: "bedroom"
    },{
      placement: "left",
      name: "MC",
      phrase: "Not you carl :(",
      background: "bedroom"
    },{
      placement: "left",
      name: "MC",
      phrase: "Time to summon that demon",
      background: "bedroom"
    },{
      placement: "left",
      name: "MC",
      phrase: "Make a choice",
      options: ["amd", "hello"],
      background: "bedroom"
    }][this.counter];
  }
};
export { DialogTree };