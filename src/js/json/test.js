export default {
    name : "testTree",
    speaker : "carl",
    background : "background.png",
    nodes : {
        0 : {
            prompt : "Favorite color?",
            options[
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
        1 : {
            prompt : "Good choice",
            options[
                {
                    destination : 3,
                    text : 'thanks',
                    actions : [],
                    checks : [],
                }

            ]
        },
        2 : {
            prompt : "Bad choice",
            options[
                {
                    destination : 3,
                    text : 'Drat',
                    actions : [],
                    checks : [],
                }

            ]
        },
        3 : {
            prompt : "Ok, gameover now.",
            options[
                {
                    destination : -1,
                    text : '<continue>',
                    actions : [],
                    checks : [],
                }
            ]
        },
    }
};
