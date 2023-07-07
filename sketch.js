let logo;
let chatBubbles = []; // Array to store chat bubbles
let inp;
let sendBtn;
let navigateBtn;
let navigateTextBtn;
let speachBtn;
let talkBtn;
let mode = 0;
let myVoice;
let speechRec;
let question;
let BotText;
let modeListen=0;

function setup() 
{
    //creating a canva that fits the wiindow and increase it's height based on the chat length
    createCanvas(windowWidth, (windowHeight+chatBubbles.length*120)-100);
    
    background(50, 50, 50);//set background to gray
    
    // RiveScript implementation
    bot = new RiveScript(); // load library
    loadBot(); // call function to load the RiveScript bot
    
    logo = loadImage('ExploreBotLogo.png'); // add the logo
    
    //creating input feild
    inp = createInput('');
    inp.attribute('placeholder', "Please enter your question here!")
    inp.position(50,( windowHeight +chatBubbles.length*120)- 400);
    inp.size(windowWidth - 250);
    inp.input(HumanInputEvent);

    // Draw button to submit questions
    sendBtn = createButton('Send text');
    sendBtn.position(width - 150, ( windowHeight +chatBubbles.length*120) - 400);
    sendBtn.size(100);
    sendBtn.mousePressed(submitQuestion);
    sendBtn.addClass('btn btn-dark');

    // draw Navigation button to switch from text to sound
    navigateBtn = createButton('Use sound');
    navigateBtn.position(width - 150, ( windowHeight +chatBubbles.length*120) - 350);
    navigateBtn.size(100);
    navigateBtn.mousePressed(navigate);
    navigateBtn.addClass('btn btn-dark');

    // draw Navigation button to switch from sound to text
    navigateTextBtn = createButton('Use text');
    navigateTextBtn.position(width - 150, ( windowHeight +chatBubbles.length*120) - 350);
    navigateTextBtn.size(100);
    navigateTextBtn.mousePressed(navigate);
    navigateTextBtn.addClass('btn btn-dark');

    // Speak button to get response (stops listening when clicked)
    speachBtn = createButton('Send');
    speachBtn.position(width - 150, ( windowHeight +chatBubbles.length*120) - 400);
    speachBtn.size(100);
    speachBtn.mousePressed(gotSpeech);
    speachBtn.mousePressed(navigateListen)
    speachBtn.addClass('btn btn-dark');
    
    //Listen button to start listening again
    listenBtn = createButton('Listen');
    listenBtn.position(width - 150, ( windowHeight +chatBubbles.length*120) - 400);
    listenBtn.size(100);
    listenBtn.mousePressed(navigateListen)
    listenBtn.addClass('btn btn-dark');

    // Talk button to let the bot talk
    talkBtn = createButton('Talk');
    talkBtn.position(width - 150, ( windowHeight +chatBubbles.length*120) - 300);
    talkBtn.size(100);
    talkBtn.mousePressed(talk);
    talkBtn.addClass('btn btn-dark');
    
    speechRec = new p5.SpeechRec('en-us', gotSpeech); //record speech

    // Configure speech rec mode
    let continuous = true;
    let interimResults = false;
    speechRec.start(continuous, interimResults);

    // My Voice
    myVoice = new p5.Speech(); // New P5.Speech object
    myVoice.speak("say something");
}

async function loadBot() 
{
  await bot.loadFile('botbrain.rive.txt'); // Wait for promise to resolve then load file
}

function HumanInputEvent() 
{
    console.log('You are typing: ', this.value());
}

function navigate() 
{
    console.log("navigate");
    console.log("mode: " + mode);
    if (mode == 0) 
    {
        mode = 1;
    } 
    else 
    {
        mode = 0;
    }
}
 function navigateListen() 
{
    console.log("navigate Listen");
    console.log("modeListen: " + modeListen);
    if (modeListen == 0) 
    {
        modeListen = 1;
    } 
    else 
    {
        modeListen = 0;
    }
}

function keyPressed() 
{
    if (keyCode == 13) 
    {
        submitQuestion();
    }
}

function submitQuestion() 
{
        console.log("inp.value: " + inp.value());
        console.log("Mouse is pressed!");
        question = inp.value();
        // Clear input field
        inp.value(''); 
        getResponse(question);
}

function gotSpeech() 
{
    console.log("gotSpeech");
    if (speechRec.resultValue && mode == 1 && modeListen == 0) 
    {
        let said = speechRec.resultString;
        getResponse(said);
        question = said;
    }
      
    // Display user input
    console.log(said);
}

function talk() 
{
    myVoice.speak(BotText);
}

// Bot response
async function getResponse(question) 
{
    // Sort replies before running the bot
    bot.sortReplies();
    // Wait for the question to be returned before loading the reply
    let response = await bot.reply('local-user', question);
    BotText=response;
    // Display response
    console.log(response);
    // Create new chat bubble
    let chatBubble = 
        {
            question: question,
            answer: response
        };
    chatBubbles.push(chatBubble);
}

//fix resizing the window
function windowResized() {
  resizeCanvas(windowWidth,
               (windowHeight+
                chatBubbles.length*120));
  background(50, 50, 50);
  inp.position(50,
               (windowHeight +
                chatBubbles.length*120)
               - 400);
  inp.size(windowWidth - 250);
    sendBtn.position(windowWidth - 150,
               (windowHeight + 
                chatBubbles.length*120)
                - 405);
  navigateBtn.position(windowWidth - 150,
               (windowHeight +
                chatBubbles.length*120)
                - 350);
  navigateTextBtn.position(windowWidth - 150,
               (windowHeight +
                chatBubbles.length*120)
                - 350);
  speachBtn.position(windowWidth - 150,
               (windowHeight +
                chatBubbles.length*120)
                - 400);
  listenBtn.position(windowWidth - 150,
               (windowHeight +
                chatBubbles.length*120)
                - 400);
  talkBtn.position(windowWidth - 150,
               (windowHeight +
                chatBubbles.length*120)
                - 300);
}

//wraping text when exceeds the chat bubble
function wrapText(text, maxWidth, fontSize) 
{
    let words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) 
    {
        let word = words[i];
        let testLine = currentLine + ' ' + word;
        let testWidth = textWidth(testLine);
        
        if (testWidth <= maxWidth) 
        {
            currentLine = testLine;
        } 
        else 
        {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    
    lines.push(currentLine);
    return lines;
}

function draw() 
{
    windowResized();
    image(logo, (windowWidth / 2) - 200, -100, 400, 400);
    
    if (mode == 0) 
    {
        inp.show();
        sendBtn.show();
        navigateBtn.show();

        speachBtn.hide();
        listenBtn.hide();
        talkBtn.hide();
        navigateTextBtn.hide();
    } 
    else if (mode == 1) 
    {
        inp.hide();
        sendBtn.hide();
        navigateBtn.hide();

        speachBtn.show();
        talkBtn.show();
        navigateTextBtn.show();
        listenBtn.show();
    }
    if (mode==1 && modeListen == 0) 
    {
        speachBtn.show();
        listenBtn.hide();
    } 
    else if (mode==1 && modeListen == 1) 
    {
        speachBtn.hide();
        listenBtn.show();
    }

  // Draw chat bubbles
    let bubbleX = width / 2;
    let bubbleY = 250;
    for (let i = 0; i < chatBubbles.length; i++) {
    let chatBubble = chatBubbles[i];
      
  // Draw question bubble
        if (textWidth(chatBubble.question)>=windowWidth-90)
        {
            fill(255, 125, 0);
            rectMode(CENTER);
            rect(bubbleX, bubbleY - 35 + 120 * i, windowWidth - 50, 70, 20);
        }
        else 
        {
            fill(255, 125, 0);
            rectMode(CENTER);
            rect(bubbleX, bubbleY - 35 + 120 * i, windowWidth - 50, 50, 20); 
        }
        

  // Draw answer bubble
        if (textWidth(chatBubble.answer)>=windowWidth- 90)
        {
            fill("white");
            rect(bubbleX, bubbleY + 25 + 120 * i, windowWidth - 50, 70, 20);  
        }
        else
        {
            fill("white");
            rect(bubbleX, bubbleY + 25 + 120 * i, windowWidth - 50, 50, 20); 
        }
        

  // Draw question text
        textSize(15);
        textAlign(LEFT);
        fill("black");
        let questionLines = wrapText("You: " + chatBubble.question, windowWidth - 90, 15);
        for (let j = 0; j < questionLines.length; j++) 
        {
            text(questionLines[j], (width / 15), bubbleY - 32 + 120 * i + j * 18);
        }

  // Draw answer text
        strokeWeight(1);
        stroke(20);
        let answerLines = wrapText("ExploreBot: " + chatBubble.answer, windowWidth - 90, 15);
        for (let j = 0; j < answerLines.length; j++) 
        {
            text(answerLines[j], (width / 15), bubbleY + 30 + 120 * i + j * 18);
        }
    }
}