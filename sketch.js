
let logo;
let HumanText;
let BotText;
let inp;
let sendBtn;
let navigateBtn;
let navigateTextBtn;
let speachBtn;
let talkBtn;
let mode=0;
var myVoice;

let speechRec;
function setup() {
    createCanvas(windowWidth, windowHeight);
    
    background(50,50,50);
    
    //RiveScript
    bot = new RiveScript(); //load library
    
    loadBot(); //call function to load the rivescript bot
    logo = loadImage('ExploreBotLogo.png');
    

    inp = createInput('');
    inp.attribute('placeholder',"Please enter your question here!")
    inp.position(50, height-100);
    inp.size(windowWidth-250);
    inp.input(HumanInputEvent);

    //draw button
    sendBtn = createButton('Send text');
    sendBtn.position(width-150, height-100);
    sendBtn.size(100);
    sendBtn.mousePressed(submitQuestion);
    sendBtn.addClass('btn btn-dark'); 
    
    //navigation button
    navigateBtn = createButton('Use Sound');
    navigateBtn.position(width-150, height-200);
    navigateBtn.size(100);
    navigateBtn.mousePressed(navigate);
    navigateBtn.addClass('btn btn-dark');
    
    navigateTextBtn = createButton('Use text');
    navigateTextBtn.position(width-150, height-200);
    navigateTextBtn.size(100);
    navigateTextBtn.mousePressed(navigate);
    navigateTextBtn.addClass('btn btn-dark');
    
    
    //speak button
    speachBtn = createButton('Send');
    speachBtn.position(width-150, height-100);
    speachBtn.size(100);
    speachBtn.mousePressed(gotSpeech);
    speachBtn.addClass('btn btn-dark');
    
    //talk button
    talkBtn = createButton('Talk');
    talkBtn.position(width-150, height-150);
    talkBtn.size(100);
    talkBtn.mousePressed(talk);
    talkBtn.addClass('btn btn-dark');
    
    
    //call variable and set up library here(or in a function)
    //don't forget to look for a call back function
    speechRec = new p5.SpeechRec('en-us', gotSpeech);
    
     //configure speech rec mode
        let continuous = true;
        let interimResults = false;
        speechRec.start(continuous, interimResults);
    
//    gotSpeech();
    
    //my Voice
    myVoice = new p5.Speech(); // new P5.Speech object
     myVoice.speak("say something");
    

    
}


async function loadBot() {
 
  await bot.loadFile('botbrain.rive.txt'); // wait for promise to resolve then loadfile
 
}

function HumanInputEvent() {
  console.log('you are typing: ', this.value());
//    HumanText = this.value();
}

function navigate(){
    console.log("navigate");
    console.log("mode: "+mode);
    if(mode == 0){
        mode =1;
    }
    else{
        mode = 0;
    }
    
}
function keyPressed(){
    if (keyCode == 13) 
    {
    submitQuestion();
    }
}
function submitQuestion(){
    
    setTimeout( () =>{
    console.log("inp.value: "+inp.value());
    console.log("Mouse is pressed!");
    HumanText = inp.value();
    getResponse();
    }, 2000);
  
}

function gotSpeech(){
    console.log("gotSpeech")
    if (speechRec.resultValue) {
        let said = speechRec.resultString;
        getResponse();
        HumanText = said;
        // display user input
        console.log(said);
    
        }
}

function talk(){
         setTimeout( () =>{
//             getResponse();
             myVoice.speak(BotText);
        }, 2000);
   
}

async function getResponse(){
    
    //--------------------bot response----------------------     
    //sort replies before running the bot
    bot.sortReplies();
    //wait for the promise to be returned(?)before loading the reply
    let response = await bot.reply('local-user', HumanText);
    //display response
    console.log(response);
    
    BotText = response;
    
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
    background(50, 50, 50);
  inp.position(50, windowHeight - 100);
  inp.size(windowWidth - 250);
  sendBtn.position(windowWidth - 150, windowHeight - 100);
  navigateBtn.position(windowWidth - 150, windowHeight - 200);
  navigateTextBtn.position(windowWidth - 150, windowHeight - 200);
  speachBtn.position(windowWidth - 150, windowHeight - 100);
  talkBtn.position(windowWidth - 150, windowHeight - 150);
}

function draw() {
    windowResized();
    image (logo, (windowWidth / 2)-200, -100, 400, 400);
    if(mode == 0 ){ 
        inp.show();
        sendBtn.show();
        navigateBtn.show();
        
        speachBtn.hide();
        talkBtn.hide();
        navigateTextBtn.hide();
        
        
//        speechRec.pause();
        
    }
    else if(mode == 1){
        inp.hide();
        sendBtn.hide(); 
        navigateBtn.hide();
        
        speachBtn.show();
        talkBtn.show();
        navigateTextBtn.show();
        
        if (speechRec.resultValue) {
            let said = speechRec.resultString;
            HumanText = said;
            // display user input
            console.log(said);
    
        }

        
    }
    
    
    //draw an empty textbox
    let rectX = width / 2;
    let rectY = 350;
    fill(255,125,0);
    rectMode(CENTER);
    rect(rectX, rectY-100, windowWidth - 50, 50, 20);
    fill("white");
    rect(rectX, rectY-25, windowWidth - 50, 50, 20);
    
    //Human Text
    textSize(15);
    textAlign(LEFT);
    fill("black");
    if(HumanText == undefined)
        HumanText = "";
    
    text(" You: "+HumanText,(width/15),rectY-100); //draw Human Text within a box
    
    
    if(BotText == undefined)
        BotText = "";
//    else if(HumanText.includes("hello"))
//        BotText = "Hello There!";
//    else if(HumanText.includes("good morning"))
//        BotText = "Good Morning Sir!";
    
    //draw Bot text inside the box
    let padding = 20;
    textSize(15);
    textAlign(RIGHT);
    strokeWeight(1);
    stroke(20);
    text(BotText+" : ExploreBot ", rectX - padding, rectY + (3*padding), windowWidth - 75, 190); //draw Bot Text within a box
    
    

  //gotSpeech();
}
