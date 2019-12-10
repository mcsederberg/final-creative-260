/*global Vue*/
/*global axios*/
var app = new Vue({
	  el: '#app',
	  data: {
	    dice: [
	    ['R','I','F','O','B','X'],
	    ['I','F','E','H','E','Y'],
	    ['D','E','N','O','W','S'],
	    ['U','T','O','K','N','D'],
	    ['H','M','S','R','A','O'],
	    ['L','U','P','E','T','S'],
	    ['A','C','I','T','O','A'],
	    ['Y','L','G','K','U','E'],
	    ['Qu','B','M','J','O','A'],
	    ['E','H','I','S','P','N'],
	    ['B','A','L','I','Y','T'],
	    ['E','Z','A','V','N','D'],
	    ['R','A','L','E','S','C'],
	    ['U','W','I','L','R','G'],
	    ['P','A','C','E','M','D'],
	    ['V','E','T','I','G','N']],
	    diceSelection: [],
	    validWords: [],
	    DICECOLS: 6,
	    DICEROWS: 6,
	    letters: [['A','B','C','D'],['E','F','G','H'],['I','J','K','L'],['M','N','O','P']],
	    MINIMUMWORDLENGTH: 3,
	    enteredWords: [],
	    enteredWordsSet: [],
	    typedWord: "",
	    gameActive: false,
	    gameFinished: false,
	    scoringWords: [],
	    score: 0,
	    name: '',
	    game: true,
	    scores: []
	  },
	  mounted(){
	  	this.readTextFile("dictionary.txt");
	  	this.gameActive = false;
	  	
		document.getElementById("rows").defaultValue = "4";
	  },
	  methods: {
	  	log(message){
	  		console.log(message);	
	  	},
		async readTextFile(file) {
			var vue = this;
		    var rawFile = new XMLHttpRequest();
		    rawFile.open("GET", file, false);
		    rawFile.onreadystatechange = function ()
		    {
		        if(rawFile.readyState === 4)
		        {
		            if(rawFile.status === 200 || rawFile.status == 0)
		            {
		                vue.dictionary = rawFile.responseText.split("\n");
		            }
		        }
		    }
		    rawFile.send(null);
		},
	    
		startGame(letters){
			if (!Array.isArray(letters)) {
				this.DICECOLS = document.getElementById("rows").value;
				this.DICEROWS = document.getElementById("rows").value;
				if (this.DICECOLS > 12){
					this.DICEROWS = 12;
					this.DICECOLS = 12;
				} else if (this.DICECOLS < 2){
					this.DICEROWS = 2;
					this.DICECOLS = 2;
				}
				//Get dice
				var diceSelection = [];
				this.diceSelection = [];
				for (var i = 0; i < (this.DICECOLS * this.DICEROWS); i++){
					var random = Math.floor(Math.random() * 6);
					console.log("Mod: " + i%15 + ", random: " + random + ", i: " + i);
			    	diceSelection[i] = this.dice[i%15][random];
				}
				letters = this.getLetters(diceSelection);
			}
			this.letters = letters;
			this.setSize();
			
			
			this.validWords = this.getAllValidWords(3);
			this.enteredWordsSet = new Set();
			document.getElementById("timer").innerHTML = "3:00";
			this.startTimer();
			document.getElementById("wordInput").disabled = false;
			document.getElementById("startGameButton").disabled = true;
			this.score = 0
			
			this.enteredWords = [];
			this.typedWord = "";
			this.gameActive = true;
			this.scoringWords = [];
		},
		
		setSize(){
			var getSize = function(count){
				var size = 100;
				switch (count) {
					case 7:
						size = 425;
						break;
					
					default:
						// 60
				}
				return size;
			}
			var cols = this.letters[0].length;
			var rows = this.letters.length;
			
			// var colSize = getSize(cols);
			// var rowSize = getSize(rows);
			var colSize = cols * 63;
			var rowSize = rows * 63;
			document.getElementById("board").style.width = colSize + "px";
			document.getElementById("board").style.height = rowSize + "px";
			document.getElementById("enteredWords").style.height = document.getElementById("board").style.height;
			document.getElementById("enteredWordsList").style.height = document.getElementById("board").style.height;
		},
		
		shuffle(array) {
			var currentIndex = array.length, temporaryValue, randomIndex;
			
			// While there remain elements to shuffle...
			while (0 !== currentIndex) {
				
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				
				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}
			
			return array;
		},
		
		getLetters(letterArray){
			var i=0;
			var letters = [];
			for(var j = 0; j < this.DICECOLS; j++){
				letters[j] = [];
				for(var k = 0; k < this.DICEROWS; k++){
				    letters[j].push(letterArray[i++]);
				}
			}
			letters = this.shuffle(letters);
			return letters;
		},
		
		getPoints(word){
			var length = word.length;
			var score = 0;
			switch (length) {
				case 1:
				case 2:
				case 3:
				case 4:
					score += 1;
					break;
				case 5:
					score += 2;
					break;
				case 6:
					score += 3;
					break;
				case 7:
					score += 4;
					break;
				case 8:
				default:
					score += 11;
					break;
			}
			return score;
		},
		
		endGame(){
			this.gameActive = false;
			this.gameFinished = true;
			document.getElementById("wordInput").disabled = true;
			document.getElementById("startGameButton").disabled = false;
			// document.getElementById("possibleWordsList").style.height = document.getElementById("board").style.height;
			
			// for (var i = 0; i < this.scoringWords.length; i++){
			// 	var word = this.scoringWords[i];
			// 	this.score += this.getPoints(word);
			// }
		},
		
		startTimer() {
			var presentTime = document.getElementById('timer').innerHTML;
			var timeArray = presentTime.split(/[:]+/);
			var m = timeArray[0];
			var s = this.checkSecond((timeArray[1] - 1));
			if(s == 59){
				m--;
			}
			document.getElementById('timer').innerHTML = m + ":" + s;
			if(m <= 0 && s == 00){
				this.endGame();
			} else {
				setTimeout(this.startTimer, 1000);
			}
			var objDiv = document.getElementById("enteredWordsList");
			objDiv.scrollTop = objDiv.scrollHeight;
		},
		
		checkSecond(sec) {
			if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
			if (sec < 0) {sec = "59"};
			return sec;
		},
		
		saveWord(){
			var typedWord = this.typedWord.toLowerCase();
			var isValid = (!this.enteredWordsSet.has(typedWord) && this.validWords.has(typedWord));
			this.enteredWordsSet.add(typedWord);
			var score = "";
			if (isValid){
				score = this.getPoints(this.typedWord);
				this.score += score;
				typedWord = typedWord +"("+score+")";
			}
			var word = {"word": typedWord, "isValid": isValid};
			this.enteredWords.push(word);
			var enteredWords = this.enteredWords;
			this.enteredWords = enteredWords;
			this.typedWord = "";
			if (isValid){
				this.scoringWords.push(this.typedWord);
			}
			var objDiv = document.getElementById("enteredWordsList");
			objDiv.scrollTop = objDiv.scrollHeight;
		},
		
		getAllValidWords(minimumWordLength){
        	this.MINIMUMWORDLENGTH = minimumWordLength;
			var thisSet = new Set();
			var ioff = [-1,0,1,-1,1,-1,0,1];
			var joff = [1,1,1,0,0,-1,-1,-1];
			
			var flag = [];
	        for (var i = 0; i < this.DICEROWS; i++){
	        	flag[i] = [];
	        	for (var j = 0; j < this.DICECOLS; j++){
	        		flag[i].push(false);
	        	}
	        }
			
			for(var i=0; i<this.DICEROWS; i++){
			    for(var j=0; j<this.DICECOLS; j++) flag[i][j] = false;
			}
			for(var i=0; i<this.DICEROWS; i++){
			    for(var j=0; j<this.DICECOLS; j++){
			        flag[i][j] = true;
			        this.recFindWords(this.letters[i][j].toLowerCase(), i, j, flag, thisSet);
			        flag[i][j] = false;
			    }
			}
			return thisSet;
        },
        
        recFindWords( word, i, j, flag, thisSet){
            var ioff = [-1,0,1,-1,1,-1,0,1];
            var joff = [1,1,1,0,0,-1,-1,-1];

            if(word.length >= this.MINIMUMWORDLENGTH && this.isValidWord(word)) thisSet.add(word);
            if(this.isValidPrefix(word)){
                for(var cn=0; cn<8; cn++){
                    var ii = i+ioff[cn];
                    var jj = j+joff[cn];
                    if (ii < 0 || jj < 0){
                    	continue;
                    }
                    if(ii < this.DICEROWS && ii >= 0 && jj < this.DICECOLS && jj >= 0 && !flag[ii][jj]){
                        flag[ii][jj] = true;
                        this.recFindWords(word + this.letters[ii][jj].toLowerCase(), ii, jj, flag, thisSet);
                        flag[ii][jj] = false;                                
                    }
                }//end for
            }//end if
        },
        
		isValidWord(wordToCheck){
			var low = 0;
			var high = this.dictionary.length;
			var mid;
			var mids;
			
			while( low <= high )
			{
				mid = Math.floor(( low + high ) / 2);
				mids = this.dictionary[mid];
				if(mids.localeCompare(wordToCheck)==0){ 
					return true;
				}
				
				if( mids.localeCompare(wordToCheck) < 0 ){
				    low = mid + 1;
				} else {
				    high = mid - 1;
				}
			}
			
			return false;     // NOT_FOUND
		},
	    
		isValidPrefix(prefixToCheck) {
			var low = 0;
			var high = this.dictionary.length;
			var mid;
			var mids;
			
			while( low <= high )
			{
				mid = Math.floor(( low + high ) / 2);
				mids = this.dictionary[mid];
				if(mids.startsWith(prefixToCheck)) {
					return true;
				}
				
				if( mids.localeCompare(prefixToCheck) < 0 ){
				    low = mid + 1;
				} else {
				    high = mid - 1;
				}
			}
			
			return false;     // NOT_FOUND
		},
        
        isOnBoard(wordToCheck){
			var stack = [];
			var thisSet = []
			var ioff = [-1,0,1,-1,1,-1,0,1];
			var joff = [1,1,1,0,0,-1,-1,-1];
			
			wordToCheck = wordToCheck.toLowerCase();
			var flag = [];
			for(var i=0; i<this.DICEROWS; i++){
			    for(var j=0; j<this.DICECOLS; j++){
				    flag[i][j] = false;
			    }
			}
			for(var i=0; i<this.DICEROWS; i++){
				for(var j=0; j<this.DICECOLS; j++){
					if(wordToCheck.startsWith(this.letters[i][j].toLowerCase())){
						stack.push({'i':i,'j':j,'currentNeighbor':-1,'word':this.letters[i][j].toLowerCase(),'flag':flag});
						while(!stack.empty()){
							var e = stack.pop();
							if(e.word.localeCompare(wordToCheck)==0){
								var stack2 = [];
								stack.push(e);
								while(!stack.empty()){
									e = stack.pop();
									stack2.push(Number(e.j * this.DICECOLS + e.i));
								}
								while(!stack2.empty()) {
								    thisSet.push(stack2.pop());
								}
								return thisSet;
							}
							if(wordToCheck.startsWith(e.word)){
							    var cn = e.currentNeighbor + 1;
								while(cn < 8){
									var ii = e.i+ioff[cn];
									var jj = e.j+joff[cn];
									if(ii < this.DICEROWS && ii >= 0 && jj < this.DICECOLS && jj >= 0 && !e.flag[ii][jj]){
										e.currentNeighbor = cn;
										stack.push(e);
										stack.push({'i':ii,'j':jj,'currentNeighbor':-1,'word':e.word + this.letters[ii][jj].toLowerCase(),'flag':e.flag});
										break;
									}
									cn++;
								}// while(cn ...
							} // if(wordToCheck...
						}//end while
					} // if(wordToCheck ...
				} // end for i,j
			}
	        return null;
        },
        
        challenge(board){
        	this.toggleView();
        	this.startGame(board);
        },
        
        toggleView(){
        	this.game = !this.game;
        	//isGame is what the screen is after the click
        	var isGame = this.game;
        	if (isGame){
        		document.getElementById("toggleView").innerHTML = "Leaderboard";
        	} else {
        		this.getLeaderboard();
        		document.getElementById("toggleView").innerHTML = "Main Game";
        	}
        },
	    
		async getLeaderboard() {
			var vue = this;
			try {
				let response = await axios.get("/api/saves");
				var saves = response.data;
				saves.sort((a, b) => (a.score < b.score) ? 1 : -1)
				this.scores = saves;
				
				return true;
			} catch (error) {
				console.log(error);
			}
		},
		async saveScore(){
			this.toggleView();
			this.gameFinished = false;
			try {
				let r2 = await axios.post('/api/save', {
					name: this.name,
					board: this.letters,
					score: this.score
				});
				if (r2.data == "OK"){
					
				}
			} catch (error) {
					console.log(error);
			}
		}
	},
});