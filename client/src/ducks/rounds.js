// -----------------------
//       actions
// -----------------------

// -----------------------
//   action creators
// -----------------------

// -----------------------
//        reducer
// -----------------------

// -----------------------
//        selectors
// -----------------------

// -----------------------
//        sagas
// -----------------------

// -----------------------
//      side effects
// -----------------------

const getRandomNum = max => Math.floor(Math.random() * max)

export const getRandomCountry = countries => {
  const keys = Object.keys(countries)
  const code = keys[getRandomNum(keys.length)]
  return {code, choice: {[code]: countries[code]}}
}

const getCorrectAnswer = choices =>
  Object.keys(choices[getRandomNum(choices.length)])[0]

function getChoices(countries, level) {   // eslint-disable-line no-unused-vars
  let numberOfChoices = level === 'hard' ? 5 : 3
  const choices = []
  const codes = []
  do {
    const {code, choice} = getRandomCountry(countries)
    if (codes.indexOf(code) === -1) {
      --numberOfChoices
      choices.push(choice)
      codes.push(code)
    }
  } while (numberOfChoices > 0)
  return {choices, correctAnswer: getCorrectAnswer(choices)}
}
