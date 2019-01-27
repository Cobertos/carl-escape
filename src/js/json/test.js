export default {
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
                    actions : ["PlayGame1"],
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
