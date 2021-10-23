// @ts-check
import inquirer from "inquirer";
import chalk from "chalk";

class InputValue {
  /**
   *
   * @param {number} unitPrice
   * @param {number} expenseHour
   * @param {number} personHour
   * @param {number} fixedExpense
   */
  constructor(unitPrice, expenseHour, personHour, fixedExpense) {
    this.unitPrice = unitPrice;
    this.expenseHour = expenseHour;
    this.personHour = personHour;
    this.fixedExpense = fixedExpense;
  }
}

/**
 *
 * @param {InputValue} answers
 * @returns {number}
 */
function calcGrossMarginRatio(answers) {
  const expenseMonth = answers.expenseHour * answers.personHour;
  const sales = answers.unitPrice * answers.personHour;
  const grossMarginRatio =
    ((sales - (expenseMonth + answers.fixedExpense)) / sales) * 100;

  return grossMarginRatio;
}

// TODO: 不正な入力値のバリデーションで正の整数以外が入力された場合ははじく
async function validateNumber(input) {
  if (typeof input !== "number") {
    return "正の整数で入力してください";
  }
  return true;
}

async function askQuestions() {
  const questions = [];
  // 1時間あたりの単価
  questions.push({
    type: "number",
    name: "unitPrice",
    message: "1時間あたりの単価を入力してください",
    validate: validateNumber,
  });

  // 1時間あたりの経費
  questions.push({
    type: "number",
    name: "expense",
    message: "1時間あたりの経費を入力してください",
    validate: validateNumber,
  });

  // 1ヶ月の稼働時間
  questions.push({
    type: "number",
    name: "personHour",
    message: "1ヶ月あたりの稼働時間を入力してください",
    validate: validateNumber,
  });

  // 固定経費
  questions.push({
    type: "number",
    name: "fixedExpense",
    message: "固定経費を入力してください",
    validate: validateNumber,
  });

  return await inquirer.prompt(questions);
}

export async function cli() {
  const answers = await askQuestions();
  const inputValue = new InputValue(
    answers.unitPrice,
    answers.expense,
    answers.personHour,
    answers.fixedExpense
  );
  const grossMarginRatio = calcGrossMarginRatio(inputValue).toFixed(2);

  console.log(chalk`あなたの粗利率は{green ${grossMarginRatio}%}です`);
}
