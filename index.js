const command_input = document.getElementById("command_input");
const text_output = document.getElementById("text_output");

const mainContainer =  document.getElementById('main_container');
const editContainer = document.getElementById('edit_container');
const editWindow = document.getElementById('edit_window');
const saveEdits = document.getElementById('save_edits');
const graphicsWindow = document.getElementById("graphics_output");
const graphicsLabel = document.getElementById("graphics_output_label");

const commandInputLabel = document.getElementById('command_input_label');
const commandInputWindow = document.getElementById('command_input');
            
const textOutputLabel = document.getElementById('text_output_label');
const textOutputWindow = document.getElementById('text_output');

var turtleHeading = 0;
var bufferCanvas;
var transX;
var transY;

var startTime;


Turtle.prototype.right = function(angle) {
    console.log(angle);
    this.rightService(angle);
}

Turtle.prototype.move = function(distance) {
    console.log(distance);
    this.moveService(distance)
}

Turtle.prototype.draw = function(angle) {
    this.drawService();
}

Turtle.prototype.reset = function() {
    this.resetService();
}

function Turtle() {
    let headingDegrees = 0;
    let xpos = 0;
    let ypos = 0;
    let vertexData = []
    vertexData[0] = [-10,0];
    vertexData[1] = [0, -20];
    vertexData[2] = [10, 0];

    let bRect = [];
    console.log(bRect);

    function resetSelf() {
        headingDegrees = 0;
        xpos = 0;
        ypos = 0;
    }

    function rotateSelf(angle) {
        headingDegrees = headingDegrees + angle;
        console.log(headingDegrees);
        
        if (bufferCanvas !== undefined) {
            console.log("restoring buffer");
            ctx.drawImage(bufferCanvas, bRect[0], bRect[1]);
        }

        drawSelf();
    }

    function moveSelf(distance) {
        console.log(distance);
        let yComponent = Math.cos(headingDegrees*(Math.PI/180));
        let xComponent = Math.sin(headingDegrees*(Math.PI/180));
        console.log(xComponent, yComponent);
        let newX = xpos+(xComponent * distance);
        let newY = ypos-(yComponent * distance);


        
        console.log(xpos, ypos);
        console.log(newX, newY);

        if (bufferCanvas !== undefined) {
            console.log("restoring buffer");
            ctx.drawImage(bufferCanvas, bRect[0], bRect[1]);
        }


        ctx.beginPath();
        ctx.moveTo(xpos,ypos);
        ctx.lineTo(newX, newY);
        ctx.stroke();

        xpos = newX;
        ypos = newY;
        
        drawSelf();     
    }

    function drawSelf() {
        let rotatedVertices = applyRotation(vertexData, headingDegrees);
        let translatedVertices = applyTranslation(rotatedVertices, xpos, ypos);
        
        console.log(bufferCanvas);
        console.log(bRect);


        //boundingRectangle[x, y, width, height]
        bRect = boundingBox(translatedVertices);
        console.log(bRect);
        if (bufferCanvas === undefined) {
            bufferCanvas = document.createElement('canvas');
            //bufferCanvas.id="buffer_canvas";
            //document.getElementById('clipboard').appendChild(bufferCanvas);
        } 
        bufferCanvas.width = bRect[2];
        bufferCanvas.height = bRect[3];
        console.log(bRect);
        //offscreen.getContext('2d').drawImage( canvas, copyBounds.x1, copyBounds.y1, w, h, 0, 0, w, h );
        bufferCanvas.getContext('2d').drawImage(mainCanvas, bRect[0]+transX, bRect[1]+transY, bRect[2], bRect[3], 0, 0, bRect[2], bRect[3]);

        ctx.beginPath();
        ctx.moveTo(translatedVertices[0][0], translatedVertices[0][1]);
        
        for (let i=1; i<rotatedVertices.length; i++) {
            ctx.lineTo(translatedVertices[i][0], translatedVertices[i][1]);
        }
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.fill();

    }

    function boundingBox(vertexData) {
        let minX = vertexData[0][0];
        let minY = vertexData[0][1];
        let maxX = vertexData[0][0];
        let maxY = vertexData[0][1];

        for (let i=1; i<vertexData.length; i++) {
            //check X coord
            if (vertexData[i][0] < minX) {
                minX = vertexData[i][0];
            } else if (vertexData[i][0] > maxX) {
                maxX = vertexData[i][0];
            }
            //check Y coord
            if (vertexData[i][1] < minY) {
                minY = vertexData[i][1];
            } else if (vertexData[i][1] > maxY) {
                maxY = vertexData[i][1];
            }
            
        }
        //boundingRectangle[x, y, width, height]
        console.log((maxX-minX), (maxY-minY));
        //ctx.strokeRect(minX-2, minY-2, 25, 25);
        let boundingRectangle = [minX-2, minY-2, 25, 25];

        return boundingRectangle
    }

    function applyTranslation(vertexData, xpos, ypos) {
        let translatedVertices = []

        for (let i=0; i<vertexData.length; i++) {
            let newX = (vertexData[i][0]+xpos);
            let newY = (vertexData[i][1]+ypos);
            translatedVertices.push([newX, newY]);
        }
        return translatedVertices;
    }

    function applyRotation(vertexData, headingDegrees) {
        rotation = headingDegrees*(Math.PI/180);
        console.log(rotation);
        let rotatedVertices = [];

        for (let i=0; i<vertexData.length; i++) {
            let newX = (vertexData[i][0]*Math.cos(rotation))-(vertexData[i][1]*Math.sin(rotation));
            let newY = (vertexData[i][0]*Math.sin(rotation))+(vertexData[i][1]*Math.cos(rotation));
            rotatedVertices.push([newX, newY]);        
        }
        console.log(rotatedVertices);
        return rotatedVertices;
    }

    this.rightService = function(angle) {
        return rotateSelf(angle);
    }

    this.moveService = function(distance) {
        return moveSelf(distance);
    }

    this.drawService = function() {
        return drawSelf();
    }

    this.resetService = function() {
        return resetSelf();
    }
}

var myTurtle = new Turtle();


const mainCanvas = document.getElementById('graphics_output');
if (mainCanvas.getContext) {
    var ctx = mainCanvas.getContext('2d');
    resizeCanvasToDisplay();
}

function originToCentre() {
    transX = mainCanvas.width*0.5;
    transY = mainCanvas.height*0.5;
    ctx.translate(transX, transY);
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(-mainCanvas.width*0.5, -mainCanvas.height*0.5, mainCanvas.width, mainCanvas.height);
    myTurtle.draw();
}

function resizeCanvasToDisplay() {
    let width = mainCanvas.clientWidth;
    let height = mainCanvas.clientHeight;

    if (mainCanvas.width !== width || mainCanvas.height !== height) {
        mainCanvas.width = width;
        mainCanvas.height = height;
        originToCentre()
    }
}


function clearScreen() {
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(-mainCanvas.width*0.5, -mainCanvas.height*0.5, mainCanvas.width, mainCanvas.height);
}

function resetScreen() {
    resizeCanvasToDisplay();
    clearScreen();
    myTurtle.reset();
    myTurtle.draw();
}



var text_history = [];

const logoVariablesMap = new Map();
const logoProceduresMap = new Map();
const jsProceduresMap = new Map();

const localVariablesStack = [];

const evaluationStack = [];
evaluationStack[0] = ["","",""];

const precedenceMap = new Map();
precedenceMap.set("+", 14);
precedenceMap.set("-", 14);
precedenceMap.set("*", 15);
precedenceMap.set("/", 15);

logoVariablesMap.set("test", 42);

// logoProceduresMap values
// item 0 is number of arguments
// item 1 is a 2d array of logo arguments and tokens which makes up the procedure
    //[0] array of arguments
    //[1] array of tokens 
    //[2] user defined? boolean flag
// item 2 is a string reference to js code which makes up the procedure
// items 1&2 are mutually exclusive
// item 3 is an ordered list of arguments

logoProceduresMap.set("print", [1, null, "print"]);
logoProceduresMap.set("random", [1, null, "random"]);
logoProceduresMap.set("make", [2, null, "make"]);
logoProceduresMap.set("localmake", [2, null, "localmake"]);
logoProceduresMap.set("plus1", [1, null, "plus1"]);
logoProceduresMap.set("sum", [2, null, "sum"]);
logoProceduresMap.set("output", [1, null, "output"]);
logoProceduresMap.set("not", [1, null, "not"]);
logoProceduresMap.set("run", [1, null, "run"]);

logoProceduresMap.set("+", [2, null, "+"]);
logoProceduresMap.set("-", [2, null, "-"]);
logoProceduresMap.set("*", [2, null, "*"]);
logoProceduresMap.set("/", [2, null, "/"]);

logoProceduresMap.set("=", [2, null, "="]);
logoProceduresMap.set(">", [2, null, ">"]);
logoProceduresMap.set("<", [2, null, "<"]);

//graphics functions
logoProceduresMap.set("cs", [0, null, "cs"]);
logoProceduresMap.set("rt", [1, null, "rt"]);
logoProceduresMap.set("fd", [1, null, "fd"]);

//control structures if and for
logoProceduresMap.set("if", [2, null, "if"]);

let forDetails = [];
forDetails[0] = [':var', ':start', ':end', ':actions'];
forDetails[1] = ['localmake', ':var', ':start', 'run', ':actions', 'localmake', '"start', ':start', '+', '1', 'if', ':start', '<', '(', ':end', '+', '1', ')', '[for :var :start :end :actions]'];
forDetails[2] = false;
logoProceduresMap.set("for", [4, forDetails, null]);


jsProceduresMap.set("fd", function(argArray) {
    //console.log(argArray[0])
    myTurtle.move(argArray[0]);
});


jsProceduresMap.set("rt", function(argArray) {
    //console.log("rt");
    myTurtle.right(argArray[0]);

});

jsProceduresMap.set("cs", function() {
    console.log("cs");
    //clear screen
    resetScreen();
});

jsProceduresMap.set("run", function(argArray) {
    console.log(argArray[0]);
    
    let instructionList = argArray[0].slice(1, -1)
    console.log(instructionList);
    
    processInput(instructionList);
});

jsProceduresMap.set("not", function(argArray) {
   console.log(argArray);
   return !argArray[0]; 
});

jsProceduresMap.set("output", function(argArray) {
    console.log(argArray);
    return argArray[0];
});

jsProceduresMap.set("if", function(argArray) {
    //console.log(argArray);
    if (argArray[0] === true) {
        //process argArray[1] which is a list of logo commands
        //console.log(argArray[1]);
        if (argArray[1].charAt(0) === "[") {
            processInput(argArray[1].slice(1, -1))
        } else {
            text_history.push("Error: If requires an instruction list as second input");
            updateOutput(text_history, text_output);
        }

    }
});


jsProceduresMap.set("<", function(argArray) {
    console.log(argArray);
    if (argArray[0] < argArray[1]) {
        return true;
    } else {
        return false;
    }
});

jsProceduresMap.set(">", function(argArray) {
    console.log(argArray);
    if (argArray[0] > argArray[1]) {
        return true;
    } else {
        return false;
    }
});

jsProceduresMap.set("=", function(argArray) {
    console.log(argArray);
    if (argArray[0] === argArray[1]) {
        return true;
    } else {
        return false;
    }
});



jsProceduresMap.set("+", function(argArray) {
    console.log(argArray);
    return argArray[0] + argArray[1];
});

jsProceduresMap.set("-", function(argArray) {
    console.log(argArray);
    return argArray[0] - argArray[1];
});

jsProceduresMap.set("*", function(argArray) {
    console.log(argArray);
    return argArray[0] * argArray[1];
});

jsProceduresMap.set("/", function(argArray) {
    console.log(argArray);
    return argArray[0] / argArray[1];
});


jsProceduresMap.set("sum", function(argArray) {
    console.log(argArray);
    return argArray[0] + argArray[1];
});

jsProceduresMap.set("plus1", function(argArray) {
    console.log(argArray);
    return argArray[0] + 1;
});

jsProceduresMap.set("print", function(argArray) {
    console.log(argArray);
    if (typeof argArray[0] === 'string') {
        if (argArray[0].charAt(0) === "[") {
            argArray[0] = argArray[0].slice(1, -1);
        }
    }
    text_history.push(argArray[0]);
    updateOutput(text_history, text_output);
});

jsProceduresMap.set("random", function(argArray) {
    console.log(argArray);
    let randNum = Math.floor(Math.random() * argArray[0]);
    return randNum;
});

jsProceduresMap.set("make", function(argArray) {
    console.log(argArray);
    logoVariablesMap.set(argArray[0], argArray[1]);
});

jsProceduresMap.set("localmake", function(argArray) {
    console.log(argArray);
    
    let localVariablesMap = new Map();
    localVariablesMap.set(argArray[0], argArray[1]);

    if (localVariablesStack[localVariablesStack.length-1] === undefined) {
        localVariablesStack.push(localVariablesMap)
    } else {
        //merge with current local variables
        let existingMap = localVariablesStack[localVariablesStack.length-1];
        let newMap = new Map([...existingMap, ...localVariablesMap]);
        localVariablesStack[localVariablesStack.length-1] = newMap;

    }
    console.log(localVariablesStack);
});


editWindow.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        console.log(event.key);
        event.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;

        console.log(start);
        console.log(end);
        console.log(this.value);

        this.value = this.value.substring(0, start) + "\ \ \ \ " + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
    }
})

function displayEditWindow(flag) {
    if (flag === true) {
        main_container.style.display = 'none';
        //commandInputLabel.style.display = 'none';
        //commandInputWindow.style.display = 'none';
        //textOutputLabel.style.display = 'none';
        //textOutputWindow.style.display = 'none';
        //graphicsWindow.style.display = 'none';
        //graphicsLabel.style.display = 'none';

        editContainer.style.display = 'block';
    } else {
        main_container.style.display = 'block';
        //commandInputLabel.style.display = 'block';
        //commandInputWindow.style.display = 'block';
        //textOutputLabel.style.display = 'block';
        //textOutputWindow.style.display = 'block';
        //graphicsWindow.style.display = 'block';
        //graphicsLabel.style.display = 'block';

        editContainer.style.display = 'none';
    }
}

saveEdits.addEventListener("click", function(event) {
    
    displayEditWindow(false);
    
    console.log(editWindow.value);
    
    let tokens = [];
    //first element of the tokens array reserved for error messages
    tokens[0] = "no error";
    tokens = tokenise(editWindow.value, tokens);
    console.log(tokens);

    if (tokens[0] === "no error") {
        logoProceduresMap.forEach(function(value, key, map) {
            //console.log(key, value);
            if (value[1] !== null) {
                if (value[1][2] === true) {
                    console.log(value);
                    logoProceduresMap.delete(key);
                } 
            }
        });
        saveProcedures(tokens);
    } else {
        displayEditWindow(true);
        alert("Error: Saving procedures failed");
    }
});

function saveProcedures(tokens) {
    console.log(tokens);
    let toIndex = tokens.findIndex(function(element) {
        //console.log(element);
        return element === "to";
    });
    console.log(toIndex);
    let endIndex = tokens.findIndex(function(element) {
        //console.log(element);
        return element === "end";
    });
    //console.log(endIndex);

    if (toIndex > 0 && endIndex > toIndex) {
        
        endIndex = endIndex - (toIndex+1);

        tokens = tokens.slice(toIndex+1)

        let procedureName = tokens[0];

        let firstNewLine = tokens.findIndex(function(element) {
            console.log(element);
            return element === "\n";
        });

        //console.log(firstNewLine);

        let argNames = [];
        for (let i=1; i<firstNewLine; i++) {
            console.log(i);
            console.log(tokens[i]);
            if (tokens[i].charAt(0) === ":") {
                argNames.push(tokens[i]);
            } else {
                //argument names must be preceeded by :
                return null;
            }

        }

        let instructionList = [];
        for (let i=firstNewLine+1; i<endIndex; i++) {
            if (tokens[i] !== "\n") {
                instructionList.push(tokens[i]);
            }
        }

        //console.log(procedureName);
        //console.log(argNames);
        //console.log(instructionList);

        // logoProceduresMap values
        // item 0 is number of arguments
        // item 1 is a 2d array of logo arguments and tokens which makes up the procedure
        // item 2 is a string reference to js code which makes up the procedure
        // items 1&2 are mutually exclusive

        let procedureDetails = [];
        procedureDetails[0] = argNames;
        procedureDetails[1] = instructionList;
        procedureDetails[2] = true;
        

        logoProceduresMap.set(procedureName, [argNames.length, procedureDetails, null]);

        let remainingTokens = tokens.slice(endIndex+1);
        //console.log(remainingTokens);

        if (remainingTokens.length > 0) {
            saveProcedures(remainingTokens);
        } 

    } else {
        return null
    }
}

command_input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        console.log("hello");
        startTime = Date.now();
        console.log(startTime);
        
        text_history.push(command_input.value);
        updateOutput(text_history, text_output);
        
        processInput(command_input.value)
        command_input.value = "";
        

    }
});


function processInput(inputString) {
    let tokens = [];
    //first element of the tokens array reserved for error messages

    tokens[0] = "no error";

    tokens = tokenise(inputString, tokens);
    console.log(tokens);

    //turn unary minus sign into negative numbers
    tokens = mergeMinus(tokens);

    //rearrange infix expressions to prefix notation
    tokens = infixToPrefix(tokens);

    tokens = tokens.flat(Infinity);
    console.log(tokens);


    if (tokens === undefined) {
        tokens = [];
        tokens[0] = "unmatched brackets"
    }

    switch (tokens[0]) {
        case "no error":
            let currentProc = "";
            let currentArgs = [];
            let operatorStack = [];
            let outputStack = [];

            evaluateTokens(tokens.slice(1));
            break

        case "unmatched brackets":
            text_history.push("Error: Unmatched Brackets");
            updateOutput(text_history, text_output);
            break
    }  
}

function mergeMinus(tokens) {
    //reg exp for checking operators
    let re = /[><=+\-\*\/]/;

    //merge minus signs with numbers when appropriate
    for (let i = 0; i < tokens.length; i++) {

        if (Number(tokens[i]) || re.test(tokens[i]) || tokens[i].charAt(0) === ":") {
            //console.log(tokens[i]);
            if (tokens[i] === "-") {
                //console.log("negative or minus sign");
                //console.log(Number.isNaN(Number(tokens[i-1])));
                if ((Number.isNaN(Number(tokens[i - 1])))) {
                    //console.log("previous token is not a number")
                    if (!(tokens[i - 1].charAt(0) === ":")) {
                        //console.log("previous token is not a variable")
                        let mergedValue = "-" + tokens[i + 1];
                        //console.log(mergedValue);
                        tokens.splice(i, 2, mergedValue);
                        //console.log(tokens);          		
                    }
                }
            }
        }
    }
    return tokens;
}


function checkPrecedence(newOperator, previousOperator) {
    let returnString = "no precedence";

    let newOpPrecedence = precedenceMap.get(newOperator);
    let prevOpPrecedence = precedenceMap.get(previousOperator);

    if (newOpPrecedence > prevOpPrecedence) {
        returnString = "new operator has precedence";
    } else if (newOpPrecedence < prevOpPrecedence) {
        returnString = "previous operator has precedence";
    }

    return returnString;
}

function findClosingBracket(input, openingBracketPos) {
    let bracketCount = 0;
    let closingBracket = ")";

    for (let i = openingBracketPos + 1; i < input.length; i++) {
        if (input[i] === "(") {
            bracketCount++;
            //console.log(bracketCount);
        }
        if (input[i] === ")") {
            if (bracketCount === 0) {
                //console.log(i);
                return i;
            } else {
                bracketCount--;
                //console.log(bracketCount);
            }
        }

    }
    console.log("unmatched brackets");
    return -1
}

function extractBrackets(tokens) {
    let bracketsRegExp = /[(]/;
  
    for (let i = 0; i < tokens.length; i++) {
        //console.log(tokens[i]);
        
        if (bracketsRegExp.test(tokens[i])) {
            let closingBracketPos = findClosingBracket(tokens, i);
            if (closingBracketPos === -1) {
                //text_history.push("Unmatched Brackets");
                //updateOutput(text_history, text_output);
                return undefined;
            } else {
                //console.log(i);
                //console.log(closingBracketPos);
                let extractedExpression = extractBrackets(tokens.slice(i+1, closingBracketPos));
                //console.log(extractedExpression);
                tokens.splice(i,(closingBracketPos-i)+1,extractedExpression);
            }
        }
    }
    return tokens;    
}

function rearrangeToPrefix(tokens) {
    let re = /^[><=+\-\*\/]/;
    //console.log(tokens);
    //console.log(tokens.length);

    for (let i = 0; i < tokens.length; i++) {
        console.log(tokens[i]);
        

        let infixStack = [];
        let startIndex = 0;
        let endIndex = 0;
        

        if (Array.isArray(tokens[i])) {
            let result = rearrangeToPrefix(tokens[i])
            tokens.splice(i, 1, result);
            console.log(tokens);
        }

        if((!(Number.isNaN(Number(tokens[i]))) || Array.isArray(tokens[i]) || tokens[i].charAt(0) === ":") && (re.test(tokens[i+1]))) {
            startIndex = i;
            let infixExpression = true;
            
            console.log(infixExpression);
                        
            while (infixExpression === true) {
                if(!(Number.isNaN(Number(tokens[i]))) || Array.isArray(tokens[i]) || tokens[i].charAt(0) === ":") {
                    infixStack.push(tokens[i])
                    if (((i+1) === tokens.length) || (!(re.test(tokens[i+1])))) {
                        infixExpression = false;
                        endIndex = i;
                        console.log(infixStack, startIndex, endIndex);
                        let reversed = convert(infixStack)
                        tokens.splice(startIndex, (endIndex-startIndex)+1, reversed);
                        i = i-(endIndex - startIndex);
                        console.log(tokens);
                    }
                } else if (re.test(tokens[i])) {
                    infixStack.push(tokens[i]);
                    if (((i+1) === tokens.length) || (((Number.isNaN(Number(tokens[i+1])))) && !(Array.isArray(tokens[i+1]))) && !tokens[i].charAt(0) === ":") {
                        infixExpression = false;
                        endIndex = i;
                        console.log(infixStack, startIndex, endIndex);
                        let reversed = convert(infixStack)
                        tokens.splice(startIndex, (endIndex-startIndex)+1, reversed);
                        i = endIndex - startIndex;
                        console.log(tokens);
                    }
                }
                if (infixExpression === true) {
                    i=i+1;
                } else {

                }
                console.log(infixExpression, i)
            }
        }
    }
    console.log(tokens);
    return tokens;
}

function infixToPrefix(tokens) {  
    tokens = extractBrackets(tokens);
    if (tokens !== undefined) {
        tokens = rearrangeToPrefix(tokens);
        console.log(tokens);
        return tokens;
    }   else {
        return undefined;   
    }
}

function convert(infixStack) {
    infixStack.reverse();

    let outputStack = [];
    let operatorStack = [];
    let re = /[><=+\-\*\/]/;

    for (let i = 0; i < infixStack.length; i++) {
        if (!(Number.isNaN(Number(infixStack[i]))) || Array.isArray(infixStack[i]) || infixStack[i].charAt(0) === ":") {
            outputStack.push(infixStack[i]);
        } else if (re.test(infixStack[i])) {
            if (operatorStack.length === 0) {
                operatorStack.push(infixStack[i])
            } else {
                let previousOperator = operatorStack[operatorStack.length - 1]
                let precedence = checkPrecedence(infixStack[i], previousOperator);
                if (precedence === "no precedence") {
                    //equal precedence, L-R association, pop stack then push
                    outputStack.push(operatorStack.pop());
                    operatorStack.push(infixStack[i]);
                    console.log(outputStack);
                    console.log(operatorStack);
                } else if (precedence === "new operator has precedence") {
                    operatorStack.push(infixStack[i]);
                    console.log(operatorStack);
                } else if (precedence === "previous operator has precedence") {
                    outputStack.push(operatorStack.pop());
                    operatorStack.push(infixStack[i]);
                    console.log(outputStack);
                    console.log(operatorStack);
                }
            }
        }    
    }
    let num_operators = operatorStack.length

    for (let i=0; i < num_operators; i++) {
        outputStack.push(operatorStack.pop());
    }
    outputStack.reverse();
    console.log(outputStack);

    for (let m=0; m<outputStack.length; m++) {
        if (Array.isArray(outputStack[m])) {
            let result = rearrangeToPrefix(outputStack[m]);
            console.log(result);
            outputStack.splice(m, 1, result);
            console.log(outputStack);
        }
    }


    return outputStack;
}

function evaluateTokens(tokens) {
    if (evaluationStack.length >1) {
        if (evaluationStack[evaluationStack.length-1][0] === evaluationStack[evaluationStack.length-1].length -3) {
            let returnValue = execute(evaluationStack.pop());
            currentArgs = []
            console.log(returnValue);
            if (returnValue !== undefined) {
                evaluationStack[evaluationStack.length-1].push(returnValue);
                console.log(evaluationStack);
            }
        }
    }

    //console.log(tokens);
    let re = /[><=+\-\*\/]/;  
 
    if (tokens.length > 0) {
        if (!(Number.isNaN(Number(tokens[0])))) {
            //console.log("primitive");
            evaluationStack[evaluationStack.length-1].push(Number(tokens[0]));
            tokens = tokens.slice(1);         
            //console.log(tokens);
        } else if (tokens[0].charAt(0) === ":") {
            console.log("variable");
            let value = checkVariables(tokens[0].slice(1))
            evaluationStack[evaluationStack.length-1].push(value);
            tokens = tokens.slice(1);
            //console.log(tokens);
        } else if (tokens[0].charAt(0) === "\"") {
            //console.log("expression");
            evaluationStack[evaluationStack.length-1].push(tokens[0].slice(1));
            tokens = tokens.slice(1);
            //console.log(tokens);
        } else if (tokens[0].charAt(0) === "[") {
            //console.log("list");
            evaluationStack[evaluationStack.length-1].push(tokens[0]);
            tokens = tokens.slice(1);
            //console.log(tokens);
        } else if (tokens[0] === "to" || tokens[0] === "edall") {
            //console.log("new procedure definition");


            displayEditWindow(true);

            //deal with procedure definitions

            tokens = tokens.slice(1);
            //console.log(tokens);
        //} else if (re.test(tokens[0])) {
          //  console.log("infix operator");
          //  tokens = tokens.slice(1);
          //  console.log(tokens);
        } else {
            //console.log("check procedures");
            let newProc = checkProcedures(tokens[0]);

            if (newProc !== undefined) {
                //console.log(evaluationStack);
                evaluationStack.push(newProc);
                let len = evaluationStack.length;
                //console.log(len);

                tokens = tokens.slice(1);
                //console.log(tokens);
            } else {
                evaluationStack.length = 0;
                evaluationStack[0] = ["","",""];
                return null;
            }
        }
    }
    //console.log(evaluationStack);


    if (evaluationStack.length >1) {
        if (evaluationStack[evaluationStack.length-1][0] === evaluationStack[evaluationStack.length-1].length -3) {
            let returnValue = execute(evaluationStack.pop());
            currentArgs = []
            //console.log(returnValue);
            if (returnValue !== undefined) {
                evaluationStack[evaluationStack.length-1].push(returnValue);
                //console.log(evaluationStack);
            }
        }
    }

    //error handling
    if (evaluationStack.length === 1 && evaluationStack[0].length > 3) {
        text_history.push("You don't say what to do with " + evaluationStack[0][3]);
        updateOutput(text_history, text_output);
        evaluationStack.length = 0;
        evaluationStack[0] = ["","",""];
        return null;
    }

    if (tokens.length === 0 && evaluationStack[evaluationStack.length-1].length < evaluationStack[evaluationStack.length-1][0]+3) {
        text_history.push("Not enough inputs to " + evaluationStack[evaluationStack.length-1][2]);
        updateOutput(text_history, text_output);
        evaluationStack.length = 0;
        evaluationStack[0] = ["","",""];
        return null
    }

    //run this function again if there is something still to process
    if (tokens.length > 0 || evaluationStack.length > 1) {
        evaluateTokens(tokens)
    }
    evaluationStack.length = 0;
    evaluationStack[0] = ["","",""];
    return null;
}



function execute(currentProc) {
    /*evaluating logo procedures
        let procedureDetails = [];
        procedureDetails[0] = argNames;
        procedureDetails[1] = instructionList;

        logoProceduresMap.set(procedureName, [argNames.length, procedureDetails, null]);
    */
    //console.log(currentProc);
    currentArgs = currentProc.slice(3);

    if (currentProc[1] !== null) {
        //dealing with a user defined procedure
        //variables need to stay private to this procedure
        
        //add values to variable stack
        //logoVariablesMap.set(identifier, value);

        let numArgs = currentProc[0]
        
        
        let localVariablesMap = new Map();

        for (let i=0; i<numArgs; i++) {
            localVariablesMap.set(currentProc[1][0][i].slice(1), currentArgs[i]);
        }

        localVariablesStack.push(localVariablesMap)
        
        //processInput(inputString)
        let instructionList=currentProc[1][1].toString();
        processInput(instructionList);
        
        //pop off and discard the top set of local variables
        localVariablesStack.pop();
    } else {
        let value = jsProceduresMap.get(currentProc[2])
        let returnValue = value(currentArgs);
        //console.log(returnValue);
        return returnValue;
    }
}

function checkVariables(name) {
    //console.log(name);
    let value;
    let localVariablesMap = localVariablesStack[localVariablesStack.length-1]
    if (localVariablesMap !== undefined) {
        value = localVariablesMap.get(name);
    }   
    if (value === undefined) {
        value = logoVariablesMap.get(name);   
    }

    console.log(value);

    if (value !== undefined) {
        return value;
    } else {
        //console.log(value);
        text_history.push("Error: " + name + " has no value");
        updateOutput(text_history, text_output);
        return undefined;
    }
}

function checkProcedures(token) {
    let procedure = logoProceduresMap.get(token);
    if (procedure !== undefined) {
        let value = JSON.parse(JSON.stringify(procedure));
        return value;
    } else {
        console.log(token);
        text_history.push("Error: I don't know how to " + token);
        updateOutput(text_history, text_output);
        return undefined;
    }
}

function updateOutput(text_history, text_output) {
    let temp_text = "";

    for (let i = 0; i < text_history.length; i++) {
        temp_text = temp_text + text_history[i] + "\n";
    }
    text_output.value = temp_text;
    text_output.scrollTop = text_output.scrollHeight;
}

function tokenise(input, tokens) {
    let re = /[,><=+\-\* \]\[\/()\n\t]/;
    let index = input.search(re);
    let delimiter = input.charAt(index);
    //console.log(index);
    let newToken = '';
    let remainingInput = '';
    //console.log(delimiter);
    switch (delimiter) {
    case '\n':
        //console.log("new line");
        //tokenise anything to left of '\n'
        if (index !== 0) {
            newToken = input.slice(0, index);
            remainingInput = input.slice(index);
            tokens.push(newToken);
        }
        //tokenise '\n'
        newToken = input.slice(index, index + 1);
        remainingInput = input.slice(index + 1);
        tokens.push(newToken)
        if (remainingInput !== "") {
            tokenise(remainingInput, tokens);
        }
        break
    case ',':
    case '\t':
    case ' ':
        //console.log("space");
        newToken = input.slice(0, index);
        //console.log(newToken);
        remainingInput = input.slice(index + 1);
        if (newToken !== "") {
            tokens.push(newToken);
        }
        if (remainingInput !== "") {
            tokenise(remainingInput, tokens);
        }
        break
    case '(':
    case ')':
        //console.log("( or )");
        //tokenise anything to left of '('
        if (index !== 0) {
            newToken = input.slice(0, index);
            remainingInput = input.slice(index);
            tokens.push(newToken);
        }
        //tokenise '( or )'
        newToken = input.slice(index, index + 1);
        remainingInput = input.slice(index + 1);
        tokens.push(newToken)
        if (remainingInput !== "") {
            tokenise(remainingInput, tokens);
        }
        break
    case '[':
        //console.log("[");
        //tokenise anything to left of [
        if (index !== 0) {
            newToken = input.slice(0, index);
            remainingInput = input.slice(index);
            tokens.push(newToken);
        }

        let closingBracketIndex = findMatchingBracket(input, index);
        if (closingBracketIndex !== -1) {
            //console.log(index);
            //console.log(closingBracketIndex);

            newToken = input.slice(index, closingBracketIndex + 1);
            //console.log(newToken);
            tokens.push(newToken);

            remainingInput = input.slice(closingBracketIndex + 1);
            //console.log(remainingInput);
            if (remainingInput !== "") {
                tokenise(remainingInput, tokens);
            }
        } else {
            //console.log("unmatched brackets")
            tokens[0] = "unmatched brackets";
            //console.log(tokens);
            return tokens;
        }
        break
    case ']':
        tokens[0] = "unmatched brackets";
        //console.log(tokens);
        return tokens;
        break
    case '+':
    case '-':
    case '/':
    case '*':
    case '=':
    case '>':
    case '<':
        //console.log("infix operator");
        //retrieve the first parameter if not already tokenised due to a space
        if (index !== 0) {
            newToken = input.slice(0, index);
            remainingInput = input.slice(index);
            tokens.push(newToken);
        }

        //retrieve the operator
        newToken = input.slice(index, index + 1);
        remainingInput = input.slice(index + 1);
        tokens.push(newToken);

        if (remainingInput !== "") {
            tokenise(remainingInput, tokens);
        }
        break
    default:
        tokens.push(input);
        //console.log(tokens);
    }

    return tokens;
}


function findMatchingBracket(input, openingBracketPos) {
    let bracketCount = 0;
    let openingBracket = input.charAt(openingBracketPos)
    let closingBracket = "";

    switch (openingBracket) {
    case "[":
        closingBracket = "]";
        break
    case "(":
        closingBracket = ")";
        break
    }

    for (let i = openingBracketPos + 1; i < input.length; i++) {
        let character = input.charAt(i);
        if (character === openingBracket) {
            bracketCount++;
            //console.log(bracketCount);
        }
        if (character === closingBracket) {
            if (bracketCount === 0) {
                //console.log(i);
                return i;
            } else {
                bracketCount--;
                //console.log(bracketCount);
            }
        }

    }
    //console.log("unmatched brackets");
    return -1
}
