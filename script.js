document.addEventListener('DOMContentLoaded', function () {
  const humanVerificationModal = document.getElementById('human-verification-modal');
  const yesHumanBtn = document.getElementById('yes-human-btn');
  const mathChallengeModal = document.getElementById('math-challenge-modal');
  const mathProblem = document.getElementById('math-problem');
  const mathAnswer = document.getElementById('math-answer');
  const submitMathBtn = document.getElementById('submit-math-btn');
  const mathFeedback = document.getElementById('math-feedback');
  const alertModal = document.getElementById('alert-modal');
  const closeAlertBtn = document.getElementById('close-alert-btn');
  const adModal = document.getElementById('ad-modal');
  const closeAdBtn = document.getElementById('close-ad-btn');
  const unauthorizedModal = document.getElementById('unauthorized-modal');
  const unauthorizedMessage = document.getElementById('unauthorized-message');
  const closeUnauthorizedBtn = document.getElementById('close-unauthorized-btn');
  const mediaWrapper = document.querySelector('.media-wrapper');
  const videoIframe = document.getElementById('video-iframe');
  const videoOverlayLeft = document.querySelector('.video-overlay-left');
  const videoOverlayRight = document.querySelector('.video-overlay-right');

  let correctAnswer;
  let isEasyQuestion = false;
  let touchStartTime;

  // Check if the user has already been verified as human
  if (localStorage.getItem('human_verified') === '1') {
    // Skip human verification and math challenge
    alertModal.style.display = 'flex';
    setTimeout(() => {
      closeAlertBtn.style.display = 'block';
    }, 1000);
  } else {
    // Show human verification modal on page load
    humanVerificationModal.style.display = 'flex';
  }

  // Proceed to math challenge if user confirms they are human
  yesHumanBtn.addEventListener('click', () => {
    humanVerificationModal.style.display = 'none';
    generateMathProblem();
    mathChallengeModal.style.display = 'flex';
  });

  // Generate a random math problem
  function generateMathProblem() {
    let num1, num2;
    if (isEasyQuestion) {
      num1 = Math.floor(Math.random() * 9) + 1;
      num2 = Math.floor(Math.random() * 9) + 1;
    } else {
      num1 = Math.floor(Math.random() * 99) + 1;
      num2 = Math.floor(Math.random() * 99) + 1;
    }

    const operator = Math.random() > 0.5 ? '+' : '-';
    if (operator === '-' && num1 < num2) {
      [num1, num2] = [num2, num1];
    }

    mathProblem.textContent = `${num1} ${operator} ${num2}`;
    correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;
  }

  // Check the user's answer to the math problem
  submitMathBtn.addEventListener('click', () => {
    const userAnswer = parseInt(mathAnswer.value, 10);
    if (userAnswer === correctAnswer) {
      mathFeedback.textContent = '✅ Correct! You are human!';
      mathFeedback.style.color = 'green';
      setTimeout(() => {
        mathChallengeModal.style.display = 'none';
        localStorage.setItem('human_verified', '1'); // Store verification status
        alertModal.style.display = 'flex';
        setTimeout(() => {
          closeAlertBtn.style.display = 'block';
        }, 7000);
      }, 1500);
    } else {
      mathFeedback.textContent = '❌ Incorrect! Try again.';
      mathFeedback.style.color = 'red';
      isEasyQuestion = true;
      generateMathProblem();
      mathAnswer.value = '';
    }
  });

  // Close alert modal and show ad modal
  closeAlertBtn.addEventListener('click', () => {
    alertModal.style.display = 'none';
    adModal.style.display = 'flex';
    setTimeout(() => {
      closeAdBtn.style.display = 'block';
    }, 1000);
  });

  // Close ad modal
  closeAdBtn.addEventListener('click', () => {
    adModal.style.display = 'none';
  });

  // Unauthorized activity handling
  function showUnauthorizedModal(activityName) {
    unauthorizedMessage.textContent = `🚫 Unauthorized Activity Detected 🛑`;
    unauthorizedModal.style.display = 'flex';
    setTimeout(() => {
      closeUnauthorizedBtn.style.display = 'block';
    }, 2000);
  }

  closeUnauthorizedBtn.addEventListener('click', () => {
    unauthorizedModal.style.display = 'none';
    closeUnauthorizedBtn.style.display = 'none';
  });

  // Detect specific key combinations and display messages
  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 's':
          event.preventDefault();
          showUnauthorizedModal('Ctrl + S (Save Page)');
          break;
        case 'p':
          event.preventDefault();
          showUnauthorizedModal('Ctrl + P (Print Page)');
          break;
        case 'u':
          event.preventDefault();
          showUnauthorizedModal('Ctrl + U (View Page Source)');
          break;
        case 'v':
          event.preventDefault();
          showUnauthorizedModal('Ctrl + V (Paste)');
          break;
      }
    } else if (event.key === 'F12') {
      event.preventDefault();
      showUnauthorizedModal('F12 (Developer Tools)');
    }
  });

  // Detect long press on small screens
  mediaWrapper.addEventListener('touchstart', (event) => {
    touchStartTime = new Date().getTime(); // Record the start time of the touch
  });

  mediaWrapper.addEventListener('touchend', (event) => {
    const touchEndTime = new Date().getTime();
    const touchDuration = touchEndTime - touchStartTime;

    // If the touch duration is more than 1000ms (1 second), consider it a long press
    if (touchDuration > 1000) {
      event.preventDefault();
      showUnauthorizedModal('Long Press');
    }
  });

  // Disable right-click
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    showUnauthorizedModal('Right-Click');
  });

  // Add event listeners for video overlays
  [videoOverlayLeft, videoOverlayRight].forEach((overlay) => {
    // Make the overlay focusable
    overlay.setAttribute('tabindex', '0');

    // Detect right-click on overlay
    overlay.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      showUnauthorizedModal('Right-Click on Overlay');
    });

    // Detect keydown events on overlay
    overlay.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            showUnauthorizedModal('Ctrl + S (Save Page) on Overlay');
            break;
          case 'p':
            event.preventDefault();
            showUnauthorizedModal('Ctrl + P (Print Page) on Overlay');
            break;
          case 'u':
            event.preventDefault();
            showUnauthorizedModal('Ctrl + U (View Page Source) on Overlay');
            break;
          case 'v':
            event.preventDefault();
            showUnauthorizedModal('Ctrl + V (Paste) on Overlay');
            break;
        }
      } else if (event.key === 'F12') {
        event.preventDefault();
        showUnauthorizedModal('F12 (Developer Tools) on Overlay');
      }
    });

    // Detect long press on overlay
    overlay.addEventListener('touchstart', (event) => {
      touchStartTime = new Date().getTime(); // Record the start time of the touch
    });

    overlay.addEventListener('touchend', (event) => {
      const touchEndTime = new Date().getTime();
      const touchDuration = touchEndTime - touchStartTime;

      // If the touch duration is more than 1000ms (1 second), consider it a long press
      if (touchDuration > 1000) {
        event.preventDefault();
        showUnauthorizedModal('Long Press on Overlay');
      }
    });
  });
});