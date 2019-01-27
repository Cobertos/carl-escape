export default {
    name : "testTree",
    nodes : [
        {
            id : 0,
            prompt : "You awake warm and safe in your bed. You are home. All is well.",
            speaker: "",
            background : "bedroom",
            options : [
                {
                    destination : 1,
                    text : 'Get up and start your day',
                    actions : [],
                    checks : [],
                },
                {
                    destination : 2,
                    text : 'Hit the snooze button',
                    actions : ["Casual"],
                    checks : [],
                }

            ]
        },
        {
            id : 1,
            prompt : "You've got work today. Time to get dressed and head out.",
            speaker: "",
            background : "bedroom",
            options : [
                {
                    destination : 3,
                    text : 'Put on professional clothing.',
                    actions : ["Professional"],
                    checks : [],
                },
                {
                    destination : 3,
                    text : 'Put on casual clothing',
                    actions : ["Casual"],
                    checks : [],
                }

            ]
        },
        {
            id : 2,
            prompt : "Great. Now you're late. You're going to look like a scrub all day. Which do you have time for?",
            speaker: "",
            background : "bedroom",
            options : [
                {
                    destination : 4,
                    text : "Brush your teeth",
                    actions : [],
                    checks : [],
                },
                {
                    destination : 5,
                    text : "Wash your face.",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 3,
            prompt : "You are looking s h a r p. Let's get you out the door and to the office. It's a workday, after all.",
            speaker: "",
            background : "bedroom",
            options : [
                {
                    destination : 6,
                    text : "Grab your lunch and head outside",
                    actions : [],
                    checks : [],
                },
                {
                    destination : 6,
                    text : "You'll grab fast food on break.",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 4,
            prompt : "Well, at least your breath doesn't stink. No time to pack lunch. Let's giddy-up and head out.",
            speaker: "",
            background : "bedroom",
            options : [
                {
                    destination : 6,
                    text : "Go to the car",
                    actions : ["Scrub"],
                    checks : [],
                }

            ]
        },
        {
            id : 5,
            prompt : "At least you semi-look like you have your life together. Let's giddypup and head out.",
            speaker: "",
            background : "bedroom",
            options : [
                {
                    destination : 6,
                    text : "Go to the car.",
                    actions : ["Clean"],
                    checks : [],
                }

            ]
        },
        {
            id : 6,
            prompt : "You hear a rustling from around the back of your house. Do you check it out?",
            speaker: "",
            background : "frontyard",
            options : [
                {
                    destination : 7,
                    text : "Yeah, go see what it is.",
                    actions : [],
                    checks : [],
                },
                {
                    destination : 8,
                    text : "Nah, probably just a chipmunk",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 7,
            prompt : "You creep around the side of your house. You see Carl from the office crouched under your bedroom window.",
            speaker: "",
            background : "frontyard",
            options : [
                {
                    destination : 9,
                    text : "Talk to him",
                    actions : ["CreepyMusic"],
                    checks : [],
                },
                {
                    destination : 8,
                    text : "Run back to your car.",
                    actions : ["CreepyMusic"],
                    checks : [],
                }

            ]
        },
        {
            id : 8,
            prompt : "You get into your car. Just as you put your key in the ignition, a voice says 'I've been waiting for you'.",
            speaker: "",
            background : "frontyard",
            options : [
                {
                    destination : 10,
                    text : "You've been in my bushes for two days.",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 9,
            prompt : "You ask him what he's doing at your house. He responds with 'I've been waiting for you'.",
            speaker: "",
            background : "frontyard",
            options : [
                {
                    destination : 10,
                    text : "You've been in my bushes for two days.",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 10,
            prompt : "I couldn't bear to be apart from you~",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 11,
                    text : "I didn't want you here in the first place",
                    actions : [],
                    checks : [],
                },
                {
                    destination : 12,
                    text : "You gotta stop following me home.",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 11,
            prompt : "Hush, silly. Doesn't matter, since I'm here anyway. Can I have a ride to work?",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 13,
                    text : "No way, dude. Go home.",
                    actions : [],
                    checks : [],
                },
                {
                    destination : 13,
                    text : "Uggghhhh.... sure.",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 12,
            prompt : "Well, maybe you should stop going to work without me~ Can I ride with you to work?",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 13,
                    text : "No way, dude. Go home.",
                    actions : [],
                    checks : [],
                },
                {
                    destination : 13,
                    text : "Uggghhhh.... sure.",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 13,
            prompt : "You try to start your car, but all it does is sputter. Carl grins maniacally.",
            speaker: "",
            background : "frontyard",
            options : [
                {
                    destination : 14,
                    text : "Did you do something to my car?",
                    actions : [],
                    checks : [],
                },
                {
                    destination : 15,
                    text : "Looks like I have to work at home today.",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 14,
            prompt : "I'm not telling~",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 16,
                    text : "[Get out of your car.]",
                    actions : ["PlayGameEasy"],
                    checks : [],
                }

            ]
        },
        {
            id : 15,
            prompt : "Oh goodie! I'll come with you.",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 16,
                    text : "That's not necessary. [Get out of your car.]",
                    actions : ["PlayGameEasy"],
                    checks : [],
                }

            ]
        },
        {
            id : 16,
            prompt : " ",
            speaker: "",
            background : "frontyard",
            options : [
                {
                    destination : 17,
                    text : "You exit your car.",
                    actions : [],
                    checks : ["WinGameEasy"],
                },
                {
                    destination : 17,
                    text : "Carl follows closely.",
                    actions : [],
                    checks : ["LoseGameEasy"],
                }

            ]
        },
        {
            id : 17,
            prompt : "You feel Carl's eyes on you.",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 18,
                    text : "What are you looking at?",
                    actions : [],
                    checks : ["Professional"],
                },
                {
                    destination : 19,
                    text : "What are you looking at?",
                    actions : [],
                    checks : ["Casual"],
                }

            ]
        },
        {
            id : 18,
            prompt : "Oh, nothing. I just like the color of your tie.",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 20,
                    text : "....Uhh, thanks?",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 19,
            prompt : "You're looking pretty casual today. I never get to see you this way~<3",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 20,
                    text : "...I don't know how to feel about that.",
                    actions : [],
                    checks : ["Clean"],
                },
                {
                    destination : 21,
                    text : "...I don't know how to feel about that.",
                    actions : [],
                    checks : ["Scrub"],
                },
                {
                    destination : 21,
                    text : "Wait, what?!",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 20,
            prompt : "You try to inch your way closer to your front door while Carl is distracted.",
            speaker: "",
            background : "frontyard",
            options : [
                {
                    destination : 22,
                    text : "[Calmly back away.]",
                    actions : ["PlayGameNormal"],
                    checks : [],
                }

            ]
        },
        {
            id : 21,
            prompt : "And that scene is...*Big sniff* Your natural musk is intoxicating.",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 23,
                    text : "[Back away in a hurry.]",
                    actions : ["PlayGameHard"],
                    checks : [],
                }
            ]
        },
        {
            id : 22,
            prompt : " ",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 24,
                    text : "[You retreat to your front door.]",
                    actions : [],
                    checks : ["WinGameNormal"],
                },
                {
                    destination : 25,
                    text : "[Carl noticed. He's uncomfortably close.]",
                    actions : [],
                    checks : ["LoseGameNormal"],
                }

            ]
        },
        {
            id : 23,
            prompt : " ",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 24,
                    text : "[You retreat to your front door.]",
                    actions : ["WinGameNormal"],
                    checks : [],
                },
                {
                    destination : 25,
                    text : "[Carl noticed. He's uncomfortably close.]",
                    actions : ["LoseGameNormal"],
                    checks : [],
                }

            ]
        },
        {
            id : 24,
            prompt : "What do you do next?",
            speaker: "",
            background : "frontyard",
            options : [
                {
                    destination : 26,
                    text : "[Fish your key out of your pocket.]",
                    actions : [],
                    checks : [],
                },
                {
                    destination : 27,
                    text : "[Ask Carl to go home.]",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 25,
            prompt : "Oh, are you trying to invite me inside? owo",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 28,
                    text : "Wha-nononono, that's not what I meant.",
                    actions : [],
                    checks : [],
                },
                {
                    destination : 28,
                    text : "I have some work I need to get done...",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 26,
            prompt : "Trying to get me to come in for a drink~?",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 28,
                    text : "I have some work I need to do...",
                    actions : [],
                    checks : [],
                },
                {
                    destination : 28,
                    text : "Uhh, I'm not thirsty.",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 27,
            prompt : "I went to your home. That's better~",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 29,
                    text : "No, go to your actual house.",
                    actions : [],
                    checks : [],
                },
                {
                    destination : 29,
                    text : "Please just leave, Carl.",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 28,
            prompt : "[Carl looks upset that you denied him. He's reaching for your arm...]",
            speaker: "",
            background : "frontyardSide",
            options : [
                {
                    destination : 30,
                    text : "Unlock your front door!",
                    actions : ["PlayGameKey"],
                    checks : [],
                }

            ]
        },
        {
            id : 29,
            prompt : "[Carl looks upset about your tone of voice, and is reaching for your arm...]",
            speaker: "",
            background : "frontyardSide",
            options : [
                {
                    destination : 30,
                    text : "Unlock your front door!",
                    actions : ["PlayGameKey"],
                    checks : [],
                }

            ]
        },
        {
            id : 30,
            prompt : " ",
            speaker: "",
            background : "bedroom",
            options : [
                {
                    destination : 31,
                    text : "You did it! You're back inside.",
                    actions : [],
                    checks : ["WinGameKey"],
                },
                {
                    destination : 32,
                    text : "Carl's arms slip around you in a hug.",
                    actions : [],
                    checks : ["LoseGameKey"],
                }

            ]
        },
        {
            id : 31,
            prompt : "[You hear Carl knocking at the door.]",
            speaker: "",
            background : "bedroom",
            options : [
                {
                    destination : 33,
                    text : "Ignore him.",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 32,
            prompt : "Mmmmm, this is nice~",
            speaker: "Carl",
            background : "frontyard",
            options : [
                {
                    destination : 34,
                    text : "Struggle",
                    actions : ["PlayGameHard"],
                    checks : [],
                }

            ]
        },
        {
            id : 33,
            prompt : "[You've escaped Carl. :)]",
            speaker: "Carl",
            background : "bedroom",
            options : [
                {
                    destination : -1,
                    text : "You're safe in your home... For now.",
                    actions : [],
                    checks : [],
                }

            ]
        },
        {
            id : 34,
            prompt : " ",
            speaker: "",
            background : "bedroom",
            options : [
                {
                    destination : 31,
                    text : "[You're free long enough to unlock your door.]",
                    actions : [],
                    checks : ["WinGameHard"],
                },
                {
                    destination : 35,
                    text : "[Carl tells you how soft your skin is.]",
                    actions : [],
                    checks : ["LoseGameHard"],
                }

            ]
        },
        {
            id : 35,
            prompt : "[There is no escape.]",
            speaker: "",
            background : "bedroom",
            options : [
                {
                    destination : -1,
                    text : "[You've lost the safety of your home. :()]",
                    actions : [],
                    checks : [],
                }
            ]
        }

    ]  
};
