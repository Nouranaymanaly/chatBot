let logo;
let myVoice;

let inp;
let sendBtn;
let navigateBtn;
let HumanText= "";
let botText="";
let speechRec;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#000080');


  imageMode(CENTER); //adjust image mode
  //Using a call back function to load first image
  loadImage('EUE-Logo.png', logo => {
    image(logo, width / 2, height / 2 - 100, 500, 150);
  });
  
    //inout field
    inp= createInput('');
    inp.position(50, height-300);
    inp.attribute('placeholder', "please enter your question");
    inp.size(windowWidth-250);
    inp.input(HumanInputEvent);
    inp.addClass("form-control")
    
    //send button
    sendBtn=createButton('send');
    sendBtn.position(width-150, height-300);
    sendBtn.size(100);
    sendBtn.mousePressed(submitQuestion);
    sendBtn.addClass("btn")
    sendBtn.addClass("btn-info")
    
    //navigate button
    navigateBtn=createButton('Use Speech');
    navigateBtn.position(width-150, 300);
    navigateBtn.size(100);
    navigateBtn.mousePressed(navigate);
    navigateBtn.addClass("btn")
    navigateBtn.addClass("btn-success")
    
    myVoice = new p5.Speech()
    myVoice.speak("speech activated");
    
    speechRec = new p5.SpeechRec('en-us', gotSpeech)
    
    speechRec.start(true, false);
}

function gotSpeech(){
    if(speechRec.resultValue == true){
        console.log(speechRec.resultString);
        myVoice.speak(speechRec.resultString);
        HumanText = speechRec.resultString;
    }
}

function HumanInputEvent()
{
    console.log("this is the user input: "+ this.value());
}

function submitQuestion(){
    setTimeout( ()=>{
        console.log("inp.value: "+inp.value());
        console.log("mouse is pressed!");
        HumanText = inp.value();
    }, 2000);
}

function navigate(){
    
    inp.hide();
    sendBtn.hide();
}

function draw() {
  //background(220);
   
 //draw an empty textbox
    fill("white")
  rectX = width / 2;
  rectY = height - 125;
  rectMode(CENTER);
  rect(rectX, rectY, windowWidth - 50, 200, 20);
    
    //human text
    textSize(15);
    textAlign(LEFT);
    fill("black");
    textFont('arial');
    text(">human text: " + HumanText, (width/15), height-200);
    
    if(HumanText == undefined)
        HumanText="";

    if(HumanText.includes("hello"))
    {
    botText= "hello there!"
    }
    else if (HumanText.includes("good morning"))
    {
        botText = "Guten Morgan"
    }
    else
    {
        botText= "I can't understand"
    }
    
    //draw bot text inside the box
    let padding =20;
    textSize(15);
    textAlign(RIGHT);
    strokeWeight(1);
    stroke(20);
    text(botText+ " : bot Respond <", rectX- padding, rectY + (3*padding),windowWidth-75, 190);
    
  //gotSpeech();
}

