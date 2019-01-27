import testTree from "./json/test.js";
import mainTree from "./json/main.js";

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
            if(this.getNode(destinations[i]) == null && destinations[i] != -1){
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

    static fromJson(json){
        let ret = new DialogueTree();

        ret.name = json.name;
        ret.nodes = [];

        for(let i in json.nodes){
            let nodeJson = json.nodes[i];
            ret.nodes.push(DialogueNode.fromJson(nodeJson));
        }
        ret.selectNode(0);
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
  
  static fromJson(json){
    let ret = new DialogueNode();
    ret.id = json.id;
    ret.prompt = json.prompt;
    ret.speaker = json.speaker;
    ret.background = json.background;
    ret.options = [];

    for(let i in json.options){
        let optionJson = json.options[i];
        ret.options.push(OptionNode.fromJson(optionJson));
    }

    return ret;
  }
}

class OptionNode {
    constructor(destination, text, actions, checks) {
        this.destination = destination;
        this.text = text;
        this.actions = actions;
        this.checks = checks;
    }

    static fromJson(json){
        let ret = new OptionNode();
        ret.destination = json.destination;
        ret.text = json.text;
        ret.actions = json.actions;
        ret.checks = json.checks;
        return ret;
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

        return true;
    }
}

function test(){
    let json = getTestJson();
    let tree = DialogueTree.fromJson(json);

    console.log(tree.toString());

    tree.validate();
}

// returns DialogueTree for jsonFile
function loadJsonFile(fileName){
    let json = getJsonByFile(fileName);
    
    let ret = DialogueTree.fromJson(json);

    if(ret == null){
        console.error("Couldn't parse file " + fileName);
    }

    return ret;
}

function getJsonByFile(fileName){
    let objects = {
        "testTree" : testTree,
        "mainTree" : mainTree
    };
    let ret = objects[fileName];
    if(ret == null){
        console.error(fileName + " was Null.");
    }

    return ret;
}

function getTestJson(){
    return {
    name : "testTree",
    nodes : [
        {
            id : 0,
            prompt : "Favorite color?",
            speaker: "carl",
            background : "background.png",
            options : [
                {
                    destination : 1,
                    text : 'Green',
                    actions : [],
                    checks : [],
                },
                {
                    destination : 2,
                    text : 'Blue',
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 1,
            prompt : "Good choice",
            speaker: "carl",
            background : "background.png",
            options : [
                {
                    destination : 3,
                    text : 'thanks',
                    actions : [],
                    checks : [],
                }

            ]
        },
        {   id : 2,
            prompt : "Bad choice",
            speaker: "carl",
            background : "background.png",
            options : [
                {
                    destination : 3,
                    text : 'Drat',
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 3,
            prompt : "Ok, gameover now.",
            speaker: "carl",
            background : "background.png",
            options : [
                {
                    destination : -1,
                    text : '<continue>',
                    actions : [],
                    checks : [],
                }
            ]
        }
    ]  
};


}



//test();

export {
    DialogueTree,
    DialogueNode,
    OptionNode,
    loadJsonFile,
    getJsonByFile
};