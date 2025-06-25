// from https://gist.github.com/kishi001/0e614ff8ee7e3ad55946
var gameObj = {
  points: { score: 0 },
  stage: [],

  intiStage: function () {
    for (var c = 0; c < 4; c++) {
      this.stage[c] = [];
      for (var r = 0; r < 4; r++) {
        this.stage[c][r] = { boxObj: null, position: [c, r] };
      }
    }
  },

  empty: function () {
    var list = [];
    for (var i = 0; i < 4; i++)
      for (var j = 0; j < 4; j++)
        if (!this.stage[i][j].boxObj)
          list.push(this.stage[i][j]);
    return list;
  },

  newBox: function () {
    var empty = this.empty();
    if (!empty.length) return false;
    var idx  = Math.floor(Math.random() * empty.length),
        obj  = empty[idx],
        num  = Math.random() > 0.9 ? 4 : 2,
        span = document.createElement('span');
    span.innerText = num;
    span.className = 'row' + obj.position[0] +
                     ' cell' + obj.position[1] +
                     ' num' + num;
    document.getElementById('stage').appendChild(span);
    obj.boxObj = { value: num, domObj: span };
    return true;
  },

  isEnd: function () {
    if (this.empty().length) return false;
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        var v = this.stage[i][j].boxObj.value;
        if (
          (j < 3 && this.stage[i][j+1].boxObj.value === v) ||
          (j > 0 && this.stage[i][j-1].boxObj.value === v) ||
          (i < 3 && this.stage[i+1][j].boxObj.value === v) ||
          (i > 0 && this.stage[i-1][j].boxObj.value === v)
        ) return false;
      }
    }
    return true;
  },

  gameOver: function () {
    alert('GAME OVER!');
    document.querySelectorAll('.cover').forEach(c => c.remove());
  },

  moveTo: function (a,b) {
    b.boxObj = a.boxObj;
    b.boxObj.domObj.className =
      'row' + b.position[0] +
      ' cell' + b.position[1] +
      ' num' + b.boxObj.value;
    a.boxObj = null;
  },

  addTo: function (a,b) {
    b.boxObj.domObj.remove();
    b.boxObj = a.boxObj; a.boxObj = null;
    b.boxObj.value *= 2;
    b.boxObj.domObj.className =
      'row' + b.position[0] +
      ' cell' + b.position[1] +
      ' num' + b.boxObj.value;
    b.boxObj.domObj.innerText = b.boxObj.value;
    this.points.score += b.boxObj.value;
    document.getElementById('score').innerText = this.points.score;
    return b.boxObj.value;
  },

  clear: function (x,y) {
    var moved = false;
    for (var i = 0; i < 4; i++) {
      var emptySlot = null;
      for (var j = 0; j < 4; j++) {
        var cell = (x===0&&y===1)
          ? this.stage[i][3-j]
          : (x===1&&y===0)
            ? this.stage[j][i]
            : (x===1&&y===1)
              ? this.stage[3-j][i]
              : this.stage[i][j];
        if (!cell.boxObj) {
          if (!emptySlot) emptySlot = cell;
        } else if (emptySlot) {
          this.moveTo(cell, emptySlot);
          emptySlot = null; moved = true; j = -1;
        }
      }
    }
    return moved;
  },

  move: function (x,y) {
    var moved  = this.clear(x,y),
        merged = 0;

    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 3; j++) {
        var a,b;
        if (x===0 && y===0) {           // left
          a = this.stage[i][j+1];
          b = this.stage[i][j];
        }
        else if (x===0 && y===1) {      // right
          a = this.stage[i][2-j];
          b = this.stage[i][3-j];
        }
        else if (x===1 && y===0) {      // up
          a = this.stage[j+1][i];
          b = this.stage[j][i];
        }
        else if (x===1 && y===1) {      // down
          a = this.stage[2-j][i];
          b = this.stage[3-j][i];
        }
        if (a.boxObj && b.boxObj.value === a.boxObj.value) {
          merged += this.addTo(a, b);
          this.clear(x,y);
          moved = true;
        }
      }
    }

    if (merged) {
      var addEl = document.getElementById('addScore');
      addEl.innerText = '+' + merged;
      addEl.className = 'show';
      setTimeout(() => addEl.className = 'hide', 500);
    }
    if (moved) this.newBox();
    if (this.isEnd()) this.gameOver();
  }
};

// Swipe controller
var controller = (function(){
  var startX=0, startY=0, ready=false;
  return {
    start(x,y){ ready=true; startX=x; startY=y; },
    move(x,y){
      if (!ready) return;
      if      (x-startX>100)  { gameObj.move(0,1); ready=false; }
      else if (startX-x>100)  { gameObj.move(0,0); ready=false; }
      else if (startY-y>100)  { gameObj.move(1,0); ready=false; }
      else if (y-startY>100)  { gameObj.move(1,1); ready=false; }
    },
    end(){ ready=false; }
  };
})();

// Rewards logic: per-email 1 play/day + 30% coupon 
const COUPONS = [
  { c: 'FREEDEL', d: 'Free delivery' },
  { c: 'OFF2',    d: '$2 off'       },
  { c: 'OFF5',    d: '$5 off'       },
  { c: 'OFF10',   d: '$10 off'      },
];

function hasPlayedTodayFor(email) {
  const key   = `lastPlayDate_${email}`;
  const last  = localStorage.getItem(key);
  const today = new Date().toISOString().slice(0,10);
  return last === today;
}
function markPlayedTodayFor(email) {
  const key   = `lastPlayDate_${email}`;
  const today = new Date().toISOString().slice(0,10);
  localStorage.setItem(key, today);
}

// onload: init game + input
window.onload = function() {
  gameObj.intiStage();
  gameObj.newBox();
  gameObj.newBox();

  // keyboard
  document.addEventListener('keydown', function(e) {
    const moves = {
      'ArrowLeft':  [0,0],
      'ArrowUp':    [1,0],
      'ArrowRight': [0,1],
      'ArrowDown':  [1,1]
    };
    if (moves[e.key]) {
      e.preventDefault();
      gameObj.move(...moves[e.key]);
    }
  });

  // touch
  if ('ontouchstart' in window) {
    document.addEventListener('touchstart', e => {
      e.preventDefault();
      controller.start(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive:false });
    document.addEventListener('touchmove',  e => {
      e.preventDefault();
      controller.move(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive:false });
    document.addEventListener('touchend',   e => {
      e.preventDefault();
      controller.end();
    }, { passive:false });
  }
};

// Start button: per-email once/day
document.getElementById('start-game').onclick = () => {
  const email   = localStorage.getItem('userLoggedIn');
  const isAdmin = (email === 'admin@yorozuya.com');

  document.querySelectorAll('.cover').forEach(c=>c.remove());

  if (!email) {
    alert('Please log in to play and earn coupons.');
    return window.location.href = 'login.html';
  }
  if (!isAdmin && hasPlayedTodayFor(email)) {
    alert('You have already played today. Come back tomorrow!');
    return;
  }

  // reveal game & enable submit
  document.getElementById('game-area').classList.remove('hidden');
  document.getElementById('submit-score').disabled = false;

  // inject semi-transparent cover
  const cover = document.createElement('div');
  cover.className = 'cover fixed inset-0 w-full h-full z-[999] opacity-10 pointer-events-none';
  document.body.appendChild(cover);
};

// Submit-score: award coupon, record play, update leaderboard
document.getElementById('submit-score').onclick = () => {
  const email = localStorage.getItem('userLoggedIn');

  // mark play for this email
  markPlayedTodayFor(email);

  // decide coupon
  const score = +document.getElementById('score').textContent || 0;
  let msg, gotCode = false;
  if (Math.random() < 0.3) {
    const pick = COUPONS[Math.floor(Math.random()*COUPONS.length)];
    msg     = `Congrats! You’ve earned “${pick.d}” — code: ${pick.c}`;
    gotCode = true;
  } else {
    msg = `No coupon this time. Better luck tomorrow!`;
  }

  // display coupon/message
  document.getElementById('coupon-text').textContent = msg;
  document.getElementById('coupon-box').classList.remove('hidden');
  document.getElementById('submit-score').disabled = true;

  // show/hide Copy button
  const copyBtn = document.getElementById('copy-coupon');
  copyBtn.style.display = gotCode ? 'inline-block' : 'none';

  // update leaderboard
  let board = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  const existing = board.find(e => e.email === email);
  if (!existing) {
    board.push({ email, score });
  } else if (score > existing.score) {
    existing.score = score;
  }
  board.sort((a,b)=>b.score-a.score);
  board.splice(10);
  localStorage.setItem('leaderboard', JSON.stringify(board));
  if (typeof renderLeaderboard === 'function') renderLeaderboard(board);

  document.querySelectorAll('.cover').forEach(c=>c.remove());
};

// Copy coupon code
document.getElementById('copy-coupon').onclick = () => {
  const m = document.getElementById('coupon-text').textContent.match(/code:\s*(\S+)/);
  if (m) navigator.clipboard.writeText(m[1]);
};
