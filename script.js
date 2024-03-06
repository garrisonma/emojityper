let score = 0;
let timerValue = 60;
let timerInterval;
const keywordsArray = ["dog", "cat", "bird", "fish", "elephant", "lion", "tiger", "zebra", "house", "book", "computer", "window", "man", "sock", "shoe", "taco", "hamburger", "pizza", "sushi", "chicken", "pig", "poo", "cry", "brain", "rainbow", "skull", "blood", "zombie", "clown", "alien", "swim", "angel", "angry", "mushroom", "pancake", "chocolate", "ice cream", "camera", "television", "laugh"];
//const keywordsArray = ["peekaboo"];
let currentName;
let streakCounter = 0;
let lastEmojiTime = 0;
const streakWindow = 1700;
const streakThreshold = 3;

function startGame() {
  //document.getElementById('timerDisplay').style.display = 'block';
  //document.getElementById('emojiDisplay').style.display = 'block';
 // document.getElementById('scoreDisplay').style.display = 'block';
  score = 0;
  document.getElementById('score').innerText = score+" points";
  timerValue = 60; 
  document.getElementById('timerDisplay').innerText = timerValue + 's';
  document.getElementById('inputField').disabled = false;
  clearInterval(timerInterval); 
  timerInterval = setInterval(updateTimer, 1000);
  displayRandomEmoji();
  document.getElementById('restartButton').innerText = 'Restart';
}


async function fetchRandomEmoji() {
  const i = Math.floor(Math.random() * keywordsArray.length);
  const word = keywordsArray[i];
  currentName = word;
  const response = await fetch(`https://emoji-api.com/emojis?search=${word}&access_key=a91c5f2c2f41ba42d6617f6fb7128fb2383c0c26`);
  const data = await response.json();

  console.log('Emoji API Response:', data);

  if (Array.isArray(data) && data.length > 0 && typeof data[0].character === 'string') {
    return data[0].character;
  } else {
    console.error('Error fetching emoji. API response:', data);
    return '';
  }
}

async function displayRandomEmoji() {
  const randomEmoji = await fetchRandomEmoji();
  document.getElementById('emojiDisplay').innerText = randomEmoji;
}

function updateTimer() {
  timerValue--;
  document.getElementById('timerDisplay').innerText = timerValue + 's';
  if (timerValue === 0) {
    endGame();
  }
}

function showStreakNotification(bonusPoints) {
  const notification = document.createElement('div');
  notification.textContent = 'Streak! +'+bonusPoints+' points';
  notification.classList.add('streak-notification');
  document.body.appendChild(notification);

  setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
          notification.remove();
      }, 1000); 
  }, 3000);
}

document.getElementById('inputField').addEventListener('input', function(event) {
  const userInput = event.target.value.trim();


  if (userInput !== '' && userInput.toLowerCase() === currentName) {
      const currentTime = Date.now();
      const timeDifference = currentTime - lastEmojiTime;
      let bonusStreak = 0;
      let bonusPoints = 0;
      let streakDif = 0;
      lastEmojiTime = currentTime;
      if (timeDifference <= streakWindow) {
          streakCounter++;
          if (streakCounter >= streakThreshold) {
              streakDif = streakCounter - streakThreshold;
              bonusStreak = 10*streakDif;
              bonusPoints = 30 + bonusStreak;
              showStreakNotification(bonusPoints);
              score += 30 + bonusStreak;
          }
      } else {
          streakCounter = 1; 
      }

      score += 10;
      document.getElementById('score').innerText = score;

      displayRandomEmoji();
      document.getElementById('inputField').value = ''; 
  }
});

function endGame() {
  clearInterval(timerInterval);
  document.getElementById('timerDisplay').innerText = 'Time\'s up!';
  document.getElementById('inputField').disabled = true;
}

document.getElementById('restartButton').addEventListener('click', function(){
    startGame();
})


