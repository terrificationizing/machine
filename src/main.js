import './style.css'

const form = document.getElementById('ask-form')
const input = document.getElementById('question')
const btn = document.getElementById('ask-btn')
const verdict = document.getElementById('verdict')
const counterEl = document.getElementById('counter')

const VERDICTS = [
  { word: 'YES', kind: 'yes', reasons: [
    'The vibes are, against all odds, immaculate.',
    'A pigeon outside just nodded. That settles it.',
    'Statistically, doing the thing beats not doing the thing.',
    'Future you already did it and seems fine.',
  ]},
  { word: 'NO', kind: 'no', reasons: [
    'Absolutely not. Next question.',
    'The machine felt a chill. That is never good.',
    'You already know. You just wanted a witness.',
    'Sleep on it. Then still don’t.',
  ]},
  { word: 'MAYBE', kind: 'maybe', reasons: [
    'Ask again after a snack.',
    'The machine is legally required to remain neutral here.',
    'Flip a coin. If you’re upset at the result, you have your answer.',
    'Yes, but only on a Tuesday.',
  ]},
  { word: 'BOLD OF YOU TO ASK', kind: 'maybe', reasons: [
    'This one’s going in the machine’s memoir.',
    'The machine respects the audacity.',
  ]},
  { word: 'NOT LIKE THIS', kind: 'no', reasons: [
    'Right idea. Cursed execution.',
    'There is a better version of this plan and you know it.',
  ]},
]

let count = Number(localStorage.getItem('dm-count') || 0)
renderCounter()

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const q = input.value.trim()

  btn.disabled = true
  verdict.innerHTML = '<p class="verdict-word maybe">…</p>'

  const delay = 500 + Math.random() * 700
  setTimeout(() => {
    const pick = seededPick(q)
    const reason = pick.reasons[Math.floor(Math.random() * pick.reasons.length)]
    verdict.innerHTML = `
      <div>
        <p class="verdict-word ${pick.kind}">${pick.word}</p>
        <p class="verdict-reason">${reason}</p>
      </div>`
    if (pick.kind === 'yes') celebrate()
    count += 1
    localStorage.setItem('dm-count', String(count))
    renderCounter()
    btn.disabled = false
  }, delay)
})

// Same question -> same verdict, because the machine is "consistent."
function seededPick(str) {
  if (!str) return VERDICTS[Math.floor(Math.random() * VERDICTS.length)]
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return VERDICTS[Math.abs(h) % VERDICTS.length]
}

function renderCounter() {
  counterEl.textContent = count === 0
    ? 'No fates decided yet.'
    : `${count.toLocaleString()} ${count === 1 ? 'fate' : 'fates'} decided.`
}

/* ---------- ambient sparkles ---------- */
const RAINBOW = ['#ff2d95', '#ff8a00', '#ffee00', '#33ff66', '#00e0ff', '#8a2dff']
const field = document.getElementById('sparkle-field')
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)')

function sparkleSVG(color) {
  return `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0c.7 5.5 5.8 10.6 11.3 11.3-5.5.7-10.6 5.8-11.3 11.3C11.3 17.1 6.2 12 0.7 11.3 6.2 10.6 11.3 5.5 12 0z"/>
  </svg>`
}

function spawnSparkle() {
  const s = document.createElement('div')
  s.className = 'sparkle'
  const size = 8 + Math.random() * 22
  s.style.width = s.style.height = size + 'px'
  s.style.left = Math.random() * 100 + 'vw'
  s.style.top = Math.random() * 100 + 'vh'
  s.style.filter = `drop-shadow(0 0 ${size / 3}px ${RAINBOW[(Math.random() * RAINBOW.length) | 0]})`
  s.innerHTML = sparkleSVG(RAINBOW[(Math.random() * RAINBOW.length) | 0])
  field.appendChild(s)
  const dur = 900 + Math.random() * 1600
  const anim = s.animate(
    [
      { transform: 'scale(0) rotate(0deg)', opacity: 0 },
      { transform: 'scale(1) rotate(90deg)', opacity: 1, offset: 0.5 },
      { transform: 'scale(0) rotate(180deg)', opacity: 0 },
    ],
    { duration: dur, easing: 'ease-in-out' }
  )
  anim.onfinish = () => s.remove()
}

if (!reduceMotion.matches) {
  for (let i = 0; i < 14; i++) setTimeout(spawnSparkle, Math.random() * 1200)
  setInterval(() => {
    if (!reduceMotion.matches && document.visibilityState === 'visible') spawnSparkle()
  }, 220)
}

function celebrate() {
  if (reduceMotion.matches) return
  const colors = RAINBOW
  for (let i = 0; i < 40; i++) setTimeout(spawnSparkle, i * 15)
  for (let i = 0; i < 80; i++) {
    const bit = document.createElement('div')
    bit.className = 'confetti'
    bit.style.left = Math.random() * 100 + 'vw'
    bit.style.background = colors[i % colors.length]
    bit.style.transform = `rotate(${Math.random() * 360}deg)`
    document.body.appendChild(bit)
    const fall = bit.animate(
      [
        { transform: `translateY(0) rotate(0)`, opacity: 1 },
        { transform: `translateY(${90 + Math.random() * 20}vh) rotate(${Math.random() * 720}deg)`, opacity: 1 },
        { opacity: 0 },
      ],
      { duration: 1600 + Math.random() * 1400, easing: 'cubic-bezier(0.3, 0.6, 0.4, 1)' }
    )
    fall.onfinish = () => bit.remove()
  }
}
