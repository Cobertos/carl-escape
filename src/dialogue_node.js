class DialogueTree {
    constructor(name, nodes) {
        this.name = name;
        this.nodes = nodes;

        this.currentNode = this.getNode(0);
    }

    prompt(){
        return this.currentNode.prompt;
    }

    // Return available options
    options(actions){
        let ret = [];
        for(let i in this.currentNode.options){
            let option = this.currentNode.options[i];
            if(option.performChecks(actions)){
                ret.push(option);
            }
        }

        return ret;
    }


    selectNode(nodeId){
        this.currentNode = this.getNode(nodeId);
    }
  
    toString() {
        let ret = this.name + ":\n";
        
        for(let i in this.nodes) {
            let node = this.nodes[i];
            ret += node.toString();
        }
        return ret;
    }

    getNode(id) {
        console.log("getNode: " + id);
        for (let i in this.nodes) {
            let node = this.nodes[i];
            
            if (node.id == id) {
                return node;
            }
        }
        console.error("Node " + id + " does not exist");
        return undefined;
    }

    validate(){
        console.log("Validation start");
        if(!this.hasRootNode()){
            console.error("No root node.");
        }

        if(this.badDestinations()){
            console.error("Bad destinations found");
        }
    }

    hasRootNode() {
        return this.getNode(0) != null;
    }

    badDestinations(){
        let destinations = this.getDestinations();
        let ret = false;
        for(let i in destinations){
            if(this.getNode(destinations[i]) == null){
                console.log("Destination " + destinations[i] + " is null.");
                ret = true;
            }
        }
        return ret;
    }

    getDestinations(){
        let ret = [];

        for(let i in this.nodes){
            console.log('Pushing ' + this.nodes[i].getDestinations());
            ret.concat(this.nodes[i].getDestinations());
        }
        return ret;
    }
}

class DialogueNode {
    constructor(id, prompt, options) {
        this.id = id;
        this.prompt = prompt;
        this.options = options;
    }
  
  toString() {
        let ret = "Node[" + this.id + "]:\n";
        ret += "\"" + this.prompt + "\"\n";

        for(let i in this.options) {
          ret += "\t" + this.options[i].toString() + "\n";
        }
        
        return ret;
  }

  getDestinations() {
    let ret = [];
    for(let i in this.options){
        ret.push(this.options[i].destination);
    }
    return ret;
  }
  
}

class OptionNode {
    constructor(destination, text, actions, checks, speaker) {
        this.destination = destination;
        this.text = text;
        this.actions = actions;
        this.checks = checks;
        this.speaker = speaker; // Used to select visuals
    }
  
    toString() {
        let ret = "\"" + this.text + "\"";
        ret += ": " + this.actions.length + " actions, ";
        ret += this.checks.length + " checks";
        return ret;
    }

    // Make sure that each action has been fulfilled for each check.
    performChecks(actions){
        if(this.checks.length == 0){
            return true;
        }

        for(let i in this.checks){
            let check = this.checks[i];
            if(actions.indexOf(check) == -1){
                return false;
            }
        }

        console.error("OptionNode.performChecks: How did you get here?");
        return false;
    }
}


function sampleTree() {
    let nodes = [
        new DialogueNode(
            1,
            "Name a creative color.",
            [
                new OptionNode(
                    2,
                    "Blue",
                    ["Creative"],
                    []
                ),
                new OptionNode(
                    3,
                    "Green",
                    ["NotCreative"],
                    []
                )
            ]


        ),
        new DialogueNode(
            2,
            "Creative!",
            [
                new OptionNode(
                    4,
                    "Oh thanks!",
                    [],
                    []
                ),
            ]
        ),

        new DialogueNode(
            3,
            "Green is not a creative color",
            [
                
                new OptionNode(
                    4,
                    "Oh drat!",
                    [],
                    []
                )
            ]
        ),

        new DialogueNode(
            4,
            "What side effects do you have?",
            [
                new OptionNode(
                    -2,
                    "You're creative!",
                    [],
                    ["Creative"]
                ),
                new OptionNode(
                    -2,
                    "You're not creative!",
                    [],
                    ["NotCreative"]

                )
            ]
        )
    ];

    return new DialogueTree("CoolStory", nodes);
}



function test(){
    console.log("Running tests!");
    let tree = sampleTree();

    console.log(tree.toString());

    tree.validate();
}


//test();

export {
    DialogueTree,
    DialogueNode,
    OptionNode
};11111