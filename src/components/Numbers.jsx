import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import Button from './Button';

class Numbers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numbers: [0, 0, 0, 0, 0],
      previousResult: [0, 0, 0, 0, 0],
      length: false,
      evenCount: false,
      oddCount: false,
      notAllTens: false,
      oneSingleDigit: false,
      neverConsecutive: false,
      neverMultiples: false,
      noRepeatingOnes: false,
      lessThanOneTwentySix: false,
      greaterThanSeventyFour: false,
      notSameAsPrevious: false,
      history: [],
    };

    this.checkLength = this.checkLength.bind(this);
    this.checkEvensOdds = this.checkEvensOdds.bind(this);
    this.checkAllTens = this.checkAllTens.bind(this);
    this.checkSingleDigits = this.checkSingleDigits.bind(this);
    this.checkSingleDigits = this.checkSingleDigits.bind(this);
    this.checkConsecutives = this.checkConsecutives.bind(this);
    this.checkMultiples = this.checkMultiples.bind(this);
    this.checkRepeatingOnesDigit = this.checkRepeatingOnesDigit.bind(this);
    this.checkSum = this.checkSum.bind(this);
    this.checkPrevious = this.checkPrevious.bind(this);
    this.noRestrictions = this.noRestrictions.bind(this);

    this.finalVerification = this.finalVerification.bind(this);
    this.generateNumbers = this.generateNumbers.bind(this);
    this.verified = this.verified.bind(this);
    this.cookies = new Cookies();
  }
  componentWillMount() {
    console.log(this.cookies.get('resultsHistory'));
    if (this.cookies.get('resultsHistory')) {
      const previousResults = this.cookies.get('resultsHistory');
      this.setState({
        previousResult: previousResults,
        history: previousResults,
      });
    } else {
      this.cookies.set('resultsHistory', '[]', { expires: new Date(1577163599000) });
    }
  }
  finalVerification(numbers) {
      const historyArray = this.state.history.slice();
      const historyObject = {};
      let newDate = new Date();
      const month = newDate.getMonth() + 1;
      const day = newDate.getDate();
      const year = newDate.getFullYear();
      const dateString = `${month}/${day}/${year}`;
      historyArray.unshift({ 'Date': dateString, 'Results': numbers });
      this.setState({
        previousResult: this.state.numbers,
        numbers,
        history: historyArray,
      });
    this.cookies.set('resultsHistory', JSON.stringify(historyArray), { expires: new Date(1577163599000) });
      return this.verified();
  }

  // Verify that the generated numbers meet all requirements

  checkLength(numbers) {
    if (numbers.length === 5) {
      this.setState({
        length: true
      });
    } else {
      return this.generateNumbers();
    }
    return this.checkEvensOdds(numbers);
  }

  // Verify Even and Odd Distribution
  checkEvensOdds(numbers) {
  let evenCount = 0;
  let oddCount = 0;
  numbers.forEach((number) => {
    if (number % 2 === 0) {
      evenCount++;
    } else {
      oddCount++;
    }
  });
  if (evenCount === 2 || evenCount === 3) {
    this.setState({
      evenCount: true,
      oddCount: true,
    });
    return this.checkAllTens(numbers);
  } else {
    return this.generateNumbers();
  }
}
  // Verify that numbers are not all 10s, and there is no more than one Single-Digit Number
  checkAllTens(numbers) {
    const tensFlag = [];
    numbers.forEach((number) => {
      if (number % 10 !== 0) {
        tensFlag.push('true');
      } else {
        tensFlag.push('false');
      };
    });
    if (tensFlag.includes('true')) {
      this.setState({
        notAllTens: true,
      });
      return this.checkSingleDigits(numbers);
    } else {
      return this.generateNumbers();
    }
  }

    // Verify that there is no more than One Single-Digit Number
  checkSingleDigits(numbers) {
    let singleDigitCount = 0;
    numbers.forEach((number) => {
      if (number < 10) {
        singleDigitCount++;
      }
    });
    if (singleDigitCount <= 2) {
      this.setState({
        oneSingleDigit: true,
      });
      return this.checkConsecutives(numbers);
    } else {
      this.generateNumbers();
    }
  }
  // Verify that there are No Consecutive Numbers
  checkConsecutives(numbers) {
    let sortedNumbers = numbers.slice();
    const sortedNumbersFlag = [];
    sortedNumbers.sort((a, b) => {
      return a - b;
    });
    for (let i = 0; i < sortedNumbers.length; i++) {
      if (sortedNumbers[i + 1] && (sortedNumbers[i + 1] - sortedNumbers[i] === 1)) {
        sortedNumbersFlag.push('false');
      } else if (sortedNumbers[i + 1] && (sortedNumbers[i + 1] - sortedNumbers[i] !== 1)) {
        sortedNumbersFlag.push('true');
      }
    }
    if (!sortedNumbersFlag.includes('false')) {
      this.setState({
        neverConsecutive: true,
      });
      return this.checkMultiples(numbers);
    } else {
      return this.generateNumbers();
    }
  }

  checkMultiples(numbers) {
    // Verify that there are no Multiples
    const multiples = [];
    let sortNums = numbers.sort((a, b) => {
      return a - b;
    });
    sortNums.forEach((sortedNum) => {
      let count = 0;
      let currMultiples = [];
      if (sortedNum > 2) {
        for (let i = 0; i < sortNums.length; i++) {
          if ((sortNums[i] % sortedNum === 0) && (sortNums[i] !== 1 || sortNums[i] !== 2)) {
            count++;
            currMultiples.push(sortNums[i]);
          }
        }
      }
      if (count > 3) {
        currMultiples.unshift(sortedNum);
        console.log(`3+ Multiples Found: ${currMultiples}`);
        multiples.push(currMultiples);
      }
    });
    if (multiples.length === 0) {
      this.setState({
        neverMultiples: true,
      });
      return this.checkRepeatingOnesDigit(numbers);
    } else {
      return this.generateNumbers();
    }
  }

    // Verify that there are No Repeating One's Place Digit
  checkRepeatingOnesDigit(numbers) {
    const stringNums = [];
    const onesCount = {};
    let onesCountFlag = [];
    numbers.forEach((number) => {
      stringNums.push(number.toString());
    });
    stringNums.forEach((str) => {
      if (!onesCount[str[str.length - 1]]) {
        onesCount[str[str.length - 1]] = 1;
      } else {
        onesCount[str[str.length - 1]]++;
      }
    });
    Object.values(onesCount).forEach((value) => {
      if (value > 1) {
        onesCountFlag.push('false');
      } else {
        onesCountFlag.push('true');
      }
    });
    if (!onesCountFlag.includes('false')) {
      this.setState({
        noRepeatingOnes: true,
      });
      return this.checkSum(numbers);
    } else {
      return this.generateNumbers();
    }
  }
    // Verify that the Sum of All Numbers is Greater Than or Equal To 75, and Less Than or Equal to 125
  checkSum(numbers) {
    let sum = 0;
    numbers.forEach((num) => {
      sum += num;
    });
    console.log(`SUM: ${sum}`);
    if (sum > 74 && sum < 126) {
      this.setState({
        greaterThanSeventyFour: true,
        lessThanOneTwentySix: true,
      });
      return this.checkPrevious(numbers);
    } else {
      return this.generateNumbers();
    }
  }

    // Verify that Current Numbers are not the Same as the Previous Numbers;
  checkPrevious(numbers) {
    const previousResultFlag = [];
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] !== this.state.previousResult[i]) {
        previousResultFlag.push('true');
      } else {
        previousResultFlag.push('false');
      }
    }
    if (previousResultFlag.includes('true')) {
      this.setState({
        notSameAsPrevious: true,
      });
      return this.finalVerification(numbers);
    }
    // Return to Final Verification
      return this.generateNumbers();
  }

  generateNumbers() {
    console.log('Generating');
    const generatedNumbers = [];
    const numberGenerator = (count) => {
      if (count < 5) {
        generatedNumbers.push(Math.floor((Math.random() * 39) + 1));
        count++;
        return numberGenerator(count);
      } else {
        return this.checkLength(generatedNumbers);
      }
    }
    numberGenerator(0);
  }
  verified() {
    console.log('Numbers Confirmed');
  }
  noRestrictions() {
    const randomNums = [];
    const fiveRandom = (count) => {
      if (count < 5) {
        let rando = Math.floor((Math.random() * 39) + 1);
        if (!randomNums.includes(rando)) {
          randomNums.push(rando);
        } else {
          return fiveRandom(count);
        };
        count++;
        return fiveRandom(count);
      } else {
        return this.finalVerification(randomNums);
      }
    }
    fiveRandom(0);
  }
  render() {
    let currNumbs = this.state.numbers.slice();
    currNumbs.sort((a, b) => {
      return a - b;
    });
    const newNumbers = currNumbs.map((num) => {
      return (
        <p className="new-number">{num}</p>
      );
    });
    const previousNumbers = this.state.history.map((res) => {
      let numbs = res['Results'].sort((a, b) => {
        return a - b;
      });
      if (this.state.history.indexOf(res) < 5) {
        return (
          <ul className="previous-result">
            <li>{numbs[0]}</li>
            <li>{numbs[1]}</li>
            <li>{numbs[2]}</li>
            <li>{numbs[3]}</li>
            <li>{numbs[4]}</li>
          </ul>
        );
      }
    });
    const previousDates = this.state.history.map((res) => {
      if (this.state.history.indexOf(res) < 5) {
        return (
          <h3 className="previous-date">{res['Date']}</h3>
        );
      }
    });
    return (
      <div id="numbers-container">
        <div id="row-container">
          <div id="numbers-row">
            {newNumbers}
          </div>
        </div>
        <div id="previous-results">
          {previousNumbers}
        </div>
        <div id="previous-dates">
          {previousDates}
        </div>
        <Button clickHandler={this.generateNumbers} noRestrictions={this.noRestrictions} />
      </div>
    )
  }
}

export default Numbers;
