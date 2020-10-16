// Wishlist
// dropToken(board, color, column) -> board
// checkForWin(board) -> object only if one of the three win
// render(board, grid) -> nothing (updates grid)


let board;
let grid;
let player = "";
let colors = { "" : "white", "R" : "Red", "Y" : "Yellow" };

function createBoard(){
    //creates view and model of board
    board = createBoardModel();
    grid = createBoardView("grid");
}

function createBoardModel(){
    // board will be columnmajor 6x7
    return Array(7).fill(0).map(_ => Array(6).fill(""));
    if(player != ""){
        player = "";
    }
}
function deletebuttons(){
    //when Start Game button is pressed, this function checks if there is buttons other
    //than the one being cloned
    let ths = document.getElementById("dropperRow").getElementsByTagName("th");
    let removed = [];
    //gets a list of elements to be removed
    for(let elem = 0; elem < ths.length; elem++){
        let el = ths[elem];
        let id = el.getAttribute("id");
        if(id != "dropper0"){
            removed.push(id);
        }
    }
    //removes the elements in the list
    for(let ids = 0; ids < removed.length;ids++){
        document.getElementById(removed[ids]).parentNode.removeChild(document.getElementById(removed[ids]));
    }
    return;
}

function createRow(startNum, endNum, sampleNode, idStem, rowNode) {
    //creates a row
    for (let num = startNum; num < endNum; num++) {
        let cell = sampleNode.cloneNode(true);
        cell.id = idStem + num;
        cell.colNum = num;
        rowNode.appendChild(cell);
    } 
}

function createBoardView(gridId){
    //creates the view of the board
    let dropperRow = document.getElementById("dropperRow");
    let sampleDropper = document.getElementById("dropper0");
    let sampleRow = document.getElementById("row0");
    let sampleCell = document.getElementById("cell00");
    let grid = document.getElementById(gridId);
    //checks if buttons need to be deleated
    deletebuttons();
    //makes the current player element, dropper row, and cell visible
    document.getElementById("p").classList.add("visible");
    document.getElementById("dropperRow").classList.add("visible");
    document.getElementById("cell00").classList.add("cells", "visible");
    //if start game is pressed while game is played, this if loop resets player
    if(player != ""){
        player = "";
    }
    //sets player to initial player
    player = playerchange(player);
    //updates the player message
    updateturnmessage(player);
    grid.innerHTML = "";

    grid.appendChild(dropperRow);
    createRow(1, 7, sampleDropper, "dropper", dropperRow);

    for (let rowNum = 0; rowNum < 6; rowNum++) {
        let row = sampleRow.cloneNode();
        row.id = "row" + rowNum;
        grid.appendChild(row);
        createRow(0, 7, sampleCell, "cell" + rowNum, row);
    }

    return grid;
}
function updateturnmessage(currentplayer){
    //updates the player turn message
	document.getElementById("playerText").style.backgroundColor = colors[player];
    document.getElementById("playerText").innerText = colors[player];

}
function playerchange(previousplayer){
    //updates player
    let currentplayer;
    if(previousplayer == ""){
        currentplayer = "R";
    }
    else if(previousplayer == "R"){
        currentplayer = "Y";
    }
    else{
        currentplayer = "R";
    }
    return currentplayer;

}

function dropInto(button){
    let colNum = Number(button.parentNode.id[button.parentNode.id.length - 1]);
    if(board[colNum][0] == ""){
        rowNum = dropToken(board, player, colNum); // get rowNum? YAGNI
        render(board, grid);
        //is true if detect win returns a object, thus, there is a win
        if(detectwin(board, player, colNum, rowNum) != undefined){
            //highlights win
            highlight(detectwin(board, player, colNum, rowNum),player);
            //gives an alert with the player that won. It had to be on timer because the
            //highlight wasn't working without
            window.setTimeout(function(){messageandrestart(player)},3);
            return;

        }
        player = playerchange(player);
        updateturnmessage(player);
    }
    //console.table(board);
}
function messageandrestart(playerwin){
    //alerts which player wins and resets the board 

    alert('Player '+colors[playerwin]+' won');
    createBoard();
    return;
}

function dropToken(board, color, colNum){
    let lastRowIndex = board[colNum].length - 1;
    for (let rowNum = 0; rowNum <= lastRowIndex; rowNum++) {
        if (board[colNum][rowNum] != "") {
            if (rowNum == 0) {
                return -1; //not dropped
            }
            else {
                board[colNum][rowNum - 1] = color;
                return rowNum - 1; //dropped
            }
        }
    }
    board[colNum][lastRowIndex] = color;
    return lastRowIndex;
}
function detectwin(board,color,colNum,rowNum){
    //checks if there is a win in either of the three angles and if there is,
    //
    let vertical = checkvertical(board,color,colNum);
    let horizontal = checkhorizontal(board,color,rowNum);
    let diagnals = checkdiagnals(board,color,colNum,rowNum);
    if(vertical != false){
        return vertical;
    }
    else if(horizontal != false){
        return horizontal;
    }
    else if(diagnals != false){
        return diagnals
    }
    return;

}
function checkvertical(board,color,colNum){
    //takes current player, the board and the column number and checks if there is a win in the vertical position
    //returns an object of each cell (colNum:[rowNumbers]) if there is a win
    let vals = {}
    let rows =[]
    let lastRowIndex = board[colNum].length - 1;
    let connectNum = 4
    let amountLeft = connectNum - 1
    for(let row = 0; row <= lastRowIndex; row++){
        if(board[colNum][row] == color){
            if(row + connectNum -1 <= lastRowIndex){
                for(let checknum = row; checknum <= row + amountLeft; checknum++){
                    if(board[colNum][checknum]!=color){
                        vals = {}
                        break;
                    }
                    else{
                        rows.push(checknum);
                    }
                    if((board[colNum][checknum] == color) && checknum == row + amountLeft){
                        vals[colNum] = rows;
                        return vals;
                    }
                }
            }
        
        }
    }
    return false;
}
function checkhorizontal(board,color,rowNum){
    //takes current player, the board and the row number and checks if there is a win in the horizontal position
    //returns an object of each cell (colNum:rowNumber) if there is a win
    let vals = {}
    let lastColIndex = board.length - 1
    let connectNum = 4
    let amountLeft = connectNum - 1
    for(let col = 0; col <= lastColIndex; col++){
        if(board[col][rowNum] == color){
            if(col + connectNum -1 <= 6){
                for(let checknum = col; checknum <= col + amountLeft; checknum++){
                    if(board[checknum][rowNum]!=color){
                        vals = {}
                        break;
                    }
                    else{
                       vals[checknum] = rowNum; 
                    }
                    if((board[checknum][rowNum] == color) && checknum == col+amountLeft){
                        return vals;
                    }
                }
            }
        
        }
    }
    return false;
}
function checkdiagnals(board,color,colNum,rowNum){
    //takes current player, the board and the column number, row number, and checks if there is a win in both the diagnal positions
    //returns an object of each cell (colNum:rowNumber) if there is a win
    let startpositive = colNum+rowNum;
    let startnegative = colNum - rowNum;
    let lastRowIndex = board[colNum].length - 1;
    let lastColIndex = board.length - 1
    let connectNum = 4
    let amountLeft = connectNum - 1
    vals = {};
    //checks from right to left
    for(let c = startpositive, r=0; c >= 0, r <= lastRowIndex; c--,r++){
        if(c>lastRowIndex){
            continue;
        }
        if(c<0 || r>lastRowIndex){
            break;
        }
        if(board[c][r] == color){
            if((c-(amountLeft)>= 0) && (r+(amountLeft)) <=5 ){
                for(let checkcol = c, checkrow = r; checkcol >= c - 3, checkrow <= r + 3; checkcol--,checkrow++){
                    if(board[checkcol][checkrow]!=color){
                        vals = {}
                        break;
                    }
                    else{
                        vals[checkcol] = checkrow;
                    }
                    if ((board[checkcol][checkrow] == color) && (checkcol == c - amountLeft) && (checkrow == r+amountLeft)){
                        return vals;
                    }
                }
            }
        }   
    }
    //checks from left to right
    for(let col = startnegative, row=0; col <= lastColIndex, row <= lastRowIndex; col++,row++){
        if(col < 0){
            continue;
        }
        if(col>lastColIndex || row >lastRowIndex){
            break;
        }
        if(board[col][row] == color){
            if((col+amountLeft<= lastColIndex) && (row+3 <=lastRowIndex)){
                for(let checkcol = col, checkrow = row; checkcol >= col + amountLeft, checkrow <= row + amountLeft; checkcol++,checkrow++){
                    if(board[checkcol][checkrow]!=color){
                        vals = {}
                        break;
                    }
                    else{
                        vals[checkcol] = checkrow;
                    }
                    if ((board[checkcol][checkrow] == color) && (checkcol == col + amountLeft) && (checkrow == row + amountLeft)){
                        return vals;
                    }
                }
            }
        }   
    }
    return false;
}
function highlight(obj, color){
    //given an object of column and row pairs, highlights the cells contained in the object
    columnNums = Object.keys(obj);
    if (columnNums.length <= 1){
        let column = columnNums[0];
        let rows = obj[column];
        for (let row of rows){
           id = "cell"+row+column;
            if (color == "R"){
                document.getElementById(id).className = "highlightR";
            }
            else{
                document.getElementById(id).className = "highlightY"
            }
        }   
    }
    else{
        for(let column of columnNums){
            let row = obj[column];
            let id = "cell"+row+column;
            if(color == "R"){
                document.getElementById(id).className = "highlightR";
            }
            else{
                document.getElementById(id).className = "highlightY"; 
            }
        }
    }
}

function render(board, grid) {
    for (let colNum = 0; colNum < board.length; colNum++) {
        for (let rowNum = 0; rowNum < board[colNum].length; rowNum++) {
            grid.querySelector("#cell" + rowNum + colNum).style.backgroundColor = colors[board[colNum][rowNum]];
        }
    }
}
