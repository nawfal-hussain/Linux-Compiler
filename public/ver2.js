// Select the input field and display container
const inputField = document.getElementById('user-input');
const displayContainer = document.getElementById('display');

// Listen for keyup event on input field
inputField.addEventListener('keyup', function(event) {
    // Check if Enter key is pressed (keyCode 13)
    if (event.keyCode === 13) {
        // Retrieve user input
        const userInput = inputField.value.trim();

        // Display user input in the container
        if (userInput !== '') {
            // Create a new paragraph element
            const paragraph = document.createElement('p');

            // Set the text content to user input
            paragraph.textContent = userInput;

            // Append the paragraph to the display container
            displayContainer.appendChild(paragraph);

            if (userInput.indexOf("echo ") !== -1){
                find(userInput);
            }
            else if (userInput.indexOf("gedit ") !== -1){
                geditFunction(userInput);
            } else if (userInput.indexOf("clear") !== -1){
                clearFunction(userInput);
            } else if (userInput.indexOf("rm ") !== -1) {
                removeFunction(userInput);
            } else if (userInput.indexOf("gcc ") !== -1 || userInput.indexOf("g++ ") !== -1) {
                GCC(userInput);
            } else if (userInput.indexOf("./") !== -1) {
                runObj(userInput);
            } else {
                const paragraph2 = document.createElement('p');
                paragraph2.textContent = "[unidentified command!]";
                paragraph2.classList.add('error-info');
                displayContainer.appendChild(paragraph2);
                addSpace();
            }

            // Clear the input field
            inputField.value = '';
        }
    }
});

// Handle the Ctrl+S keydown event to switch between compiler and text editor
document.addEventListener('keydown', e=>{
    if (e.ctrlKey && e.key === 's'){
        e.preventDefault();
        if (document.getElementById("user-input").disabled == true){
            //making the compiler usable again
            document.getElementById("user-input").disabled=false;
            document.getElementById("user-input").placeholder="Type here...";

            //making the text-editor un-usable
            document.getElementById("editor-user-input").disabled=true;
            let temp = document.getElementById("editor-user-input").value;
            document.getElementById("editor-user-input").value="";

            //pushing data onto array to save record
            push(temp, document.getElementById("op").innerHTML);

            //making the text-editor show "nothing" is opened
            document.getElementById("op").innerHTML = "Nothing";
        }
    }
})

// Adds a new line (space) in the display container
function addSpace(){
    const paragraph2 = document.createElement('p');
    paragraph2.textContent = "";
    paragraph2.classList.add('newLine');
    displayContainer.appendChild(paragraph2);
}

// Array to store file information and file names
let fileInfo = [];
let fileName = [];
let index = 0; //store the size of file basically

// Push file information and file name to arrays
function push(_fileInfo, _fname){
    if (findAlreadyExists(_fname) !== -1){
        fileInfo[findAlreadyExists(_fname)] = _fileInfo;
    } else {
        fileInfo[index] = _fileInfo;
        fileName[index] = _fname;
        index++;
    }
}

// Decrement the index (used for file management)
function pop(){
    index--;
}

// Check if user input is correct based on given parameters
function findIfCorrect(_userInput, whatToCheck, ft1, ft2, ft3){
    if (_userInput.indexOf(whatToCheck) == 0){
        if ((_userInput.indexOf(whatToCheck) + whatToCheck.length) !== _userInput.length){
            let temp = _userInput.replace(whatToCheck, '');
            if (temp.indexOf(ft1) !== -1 || temp.indexOf(ft2) !== -1 || temp.indexOf(ft3) !== -1){
                if (((temp.indexOf(ft1) + ft1.length) == temp.length) || ((temp.indexOf(ft2) + ft2.length) == temp.length) || ((temp.indexOf(ft3) + ft3.length) == temp.length)){
                    return true;
                }
            }
        }
    }
    return false;
}

// Finds if the given file exists. If it does, then output its contents onto the screen. Otherwise produce necessary error message
function find(usInp){
    if (findIfCorrect(usInp, 'echo', '.txt', '.c', '.cpp')){
        //find if the text file exists in the database
        var t = usInp.replace('echo ', '');
        for(i = 0; i < index; i++){
            if (fileName[i] == t){
                const paragraph2 = document.createElement('p');
                const fileInfoWithBreaks = fileInfo[i].replace(/\n/g, '<br>');
                paragraph2.innerHTML = fileInfoWithBreaks;
                paragraph2.classList.add('add-info');
                displayContainer.appendChild(paragraph2);
                addSpace();
                return;
            }
        }
        const paragraph2 = document.createElement('p');
        paragraph2.textContent = usInp + " file not found!";
        paragraph2.classList.add('error-info');
        displayContainer.appendChild(paragraph2);
        addSpace();
    } else {
        const paragraph2 = document.createElement('p');
        paragraph2.textContent = "[unidentified syntax of echo!]";
        paragraph2.classList.add('error-info');
        displayContainer.appendChild(paragraph2);
        addSpace();
    }
}

// Handle the click function for saving editor content and making the compiler usable again
function clickFunction(){
    //making the compiler usable again
    document.getElementById("user-input").disabled=false;
    document.getElementById("user-input").placeholder="Type here...";

    //making the text-editor un-usable
    document.getElementById("editor-user-input").disabled=true;
    let temp = document.getElementById("editor-user-input").value;
    document.getElementById("editor-user-input").value="";

    //pushing data onto array to save record
    push(temp, document.getElementById("op").innerHTML);

    //making the text-editor show "nothing" is opened
    document.getElementById("op").innerHTML = "Nothing";
}

// Close the help screen
function closeHelpScreen(){
    document.getElementById("info-screen").style.visibility = "hidden";
}

// Open the help screen
function openHelpScreen(){
    document.getElementById("info-screen").style.visibility = "visible";
}

//check if the file already exists, already created before
function findAlreadyExists(_txtFile){
    for(i = 0; i < index; i++){
        if (fileName[i] == _txtFile){
            return i;
        }
    }
    return -1;
}

// Handle the gedit command to open or create a file for editing
function geditFunction(usInp){
    if (findIfCorrect(usInp, 'gedit ', '.txt', '.c', '.cpp')){
        var txtfile = usInp.replace('gedit ', '');

        if (findAlreadyExists(txtfile) !== -1){
            //if a file already exists, then put it's data onto the text editor
            document.getElementById("editor-user-input").value = fileInfo[findAlreadyExists(txtfile)];
        }

        //disable the compiler from taking furhter inputs
        document.getElementById("user-input").disabled=true;
        document.getElementById("user-input").placeholder="";

        //display "write something on editor" on the compiler
        let paragraph2 = document.createElement('p');
        paragraph2.textContent = "[write something on editor...]";
        paragraph2.classList.add('add-info');
        displayContainer.appendChild(paragraph2);
        addSpace();

        //make the editor open for information
        document.getElementById("editor-user-input").disabled=false;
        //write the name of the file we're working on, as "currently opened"
        document.getElementById("op").innerHTML = txtfile;
    } else {
        //invalid "gedit" syntax being output to the terminal
        const paragraph2 = document.createElement('p');
        paragraph2.textContent = "[unidentified syntax of gedit!]";
        paragraph2.classList.add('error-info');
        displayContainer.appendChild(paragraph2);
        addSpace();
    }
};

// Handle the clear command to clear the display container
function clearFunction(usInp){
    //if "clear" is the first thing written AND "clear" is the only thing written
    if (usInp.indexOf("clear") == 0 && ((usInp.indexOf("clear") + 5) == usInp.length)){
        while (displayContainer.firstChild) {
            displayContainer.removeChild(displayContainer.firstChild);
        }
    } else {
        //invalid "clear" syntax being output to the terminal
        const paragraph2 = document.createElement('p');
        paragraph2.textContent = "[unidentified syntax of clear!]";
        paragraph2.classList.add('error-info');
        displayContainer.appendChild(paragraph2);
        addSpace();
    }
}

// Handle the rm command to remove a file from the record
function removeFunction(_userInput){
    if (findIfCorrect(_userInput, "rm ", ".txt", ".cpp", ".c")){
        let _txtFile = _userInput.replace('rm ', '');
        let _indexToDelete = findAlreadyExists(_txtFile);
        if (_indexToDelete !== -1){
            fileInfo.splice(_indexToDelete, 1);
            fileName.splice(_indexToDelete, 1);
            pop();
            const paragraph2 = document.createElement('p');
            paragraph2.textContent = _txtFile + " sucessfully deleted";
            paragraph2.classList.add('add-info');
            displayContainer.appendChild(paragraph2);
            addSpace();
        } else {
            //the text file we want to delete does not exist
            const paragraph2 = document.createElement('p');
            paragraph2.textContent = "[the text file " + _txtFile + " does not exist!]";
            paragraph2.classList.add('error-info');
            displayContainer.appendChild(paragraph2);
            addSpace();
        }
    } else {
        //invalid "rm" syntax being output to the terminal
        const paragraph2 = document.createElement('p');
        paragraph2.textContent = "[unidentified syntax of rm!]";
        paragraph2.classList.add('error-info');
        displayContainer.appendChild(paragraph2);
        addSpace();
    }
}


// Below lie functions to compile the code. Very big hassle. Not very clean but who cares since it get's the job done.
let tempArr = [];
let tempIndex1 = 0;

// Handle the gcc command to compile the C/C++ code
function GCC(_userInput){
    if (_userInput.indexOf("gcc ") == 0 || _userInput.indexOf("g++ ") == 0){
        _userInput = _userInput.slice(4, _userInput.length);
        let _fname = '';
        if (_userInput.indexOf(".cpp") !== -1){
            _fname = _userInput.slice(0, (_userInput.indexOf(".cpp")+4));
        } else if (_userInput.indexOf(".c") !== -1){
            _fname = _userInput.slice(0, (_userInput.indexOf(".c")+2));
        } else {
            const paragraph2 = document.createElement('p');
            paragraph2.textContent = "[unidentified file type for gcc/g++! Check the \"Help?\" section to see suported types.]";
            paragraph2.classList.add('error-info');
            displayContainer.appendChild(paragraph2);
            addSpace();
            return;
        }
        let _outputName = _userInput.slice((_userInput.indexOf("-o")+3), _userInput.length);
        tempArr.push([_fname, _outputName, ''])
        tempIndex1++;
    }
}

// Find if object exists
function findInArray(_objectName){
    for(i = 0; i < tempIndex1; i++){
        if (tempArr[i][1] == _objectName){
            return tempArr[i][0];
        }
    }
    return -1;
}

// Checks if the object has an asociated output
function doesObjHaveOutput(_objectName){
    for(i=0;i<tempIndex1;i++){
        if(tempArr[i][1] == _objectName){
            if (tempArr[i][2] == ''){
                return -1;
            } else {
                return 1;
            }
        }
    }
    return 0;
}

// Returns the object's asociated output
function getObjectOutput(_objectName){
    for(i=0;i<tempIndex1;i++){
        if(tempArr[i][1] == _objectName){
            return tempArr[i][2];
        }
    }
    return -1;
}

// Get's the code for the associated filename
function getCode(_fileName){
    for(i = 0; i < index; i++){
        if (_fileName == fileName[i]){
            return fileInfo[i];
        }
    }
    return -1;
}

// Adds output to the correct file and object
function addToArray(_fileName, _objectName, _output){
    for(i=0; i < tempIndex1; i++){
        if (_fileName == tempArr[i][0] && _objectName == tempArr[i][1]){
            tempArr[i][2] = _output;
            return 1;
        }
    }
    return -1;
}

// Handle the runObj command to run the compiled executable
async function runObj(_userInput){
    //must contain ./ in the start
    if (_userInput.indexOf("./") == 0){
        let _inputValues = ''
        if (_userInput.indexOf(" ") !== -1){
            _inputValues = _userInput.slice(_userInput.indexOf(" ")+1, _userInput.length)
        }
        let _objectName = _userInput.slice(2, _userInput.length);
        let _fileName = findInArray(_objectName);
        if (doesObjHaveOutput(_objectName) == -1){
            if (_fileName !== -1){
                let _code = getCode(_fileName);
                if (_code !== -1){
                    let _output = await compileCode(_code, _inputValues)
                    addToArray(_fileName, _objectName, _output)
                    if (_output.error == ''){
                        let paragraph2 = document.createElement('p');
                        paragraph2.textContent = _output.stdout;
                        paragraph2.classList.add('add-info');
                        displayContainer.appendChild(paragraph2);
                        addSpace();
                    } else {
                        let paragraph = document.createElement('p');
                        paragraph.textContent = _output.stderr;
                        paragraph.classList.add('error-info');
                        displayContainer.appendChild(paragraph);
                        addSpace();
                        let paragraph2 = document.createElement('p');
                        paragraph2.textContent = _output.error;
                        paragraph2.classList.add('error-info');
                        displayContainer.appendChild(paragraph2);
                        addSpace();
                    }
                    return;
                }
            }
        } else if (doesObjHaveOutput(_objectName) == 1){
            let _output = getObjectOutput(_objectName)
            if (_output != -1){
                let paragraph2 = document.createElement('p');
                paragraph2.textContent = _output.stdout;
                paragraph2.classList.add('add-info');
                displayContainer.appendChild(paragraph2);
                addSpace();
            } else {
                let paragraph = document.createElement('p');
                paragraph.textContent = _output.stderr;
                paragraph.classList.add('error-info');
                displayContainer.appendChild(paragraph);
                addSpace();
                let paragraph2 = document.createElement('p');
                paragraph2.textContent = _output.error;
                paragraph2.classList.add('error-info');
                displayContainer.appendChild(paragraph2);
                addSpace();
            }
            return;
        }
    }
    const paragraph2 = document.createElement('p');
    paragraph2.textContent = "[object name not found!]";
    paragraph2.classList.add('error-info');
    displayContainer.appendChild(paragraph2);
    addSpace();
}

// Sends the c/c++ code for compilation and returns the result of compilation
async function compileCode(_code, _stdin){
    try {
        const token = '<Enter your api key>';
        const language = 'cpp';
        const code = _code;
        const fileName = 'code.cpp';
        const stdin = _stdin;
        const response = await axios.post('http://localhost:3000/runcode', {
            token,
            language,
            fileName,
            code,
            stdin
        });
        return response.data;
    } catch (error) {
        console.error('Error sending code to backend:', error);
    }
}