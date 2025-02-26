enum QuestionType { 
  Fill = "FillText",
  Multiple = "MultipleChoice",
  Order = "Order",
  Simple = "Simple"
}

interface IQuestion {
  id: number;
  typ: QuestionType;
  category: string;
  question: string;
  answer: any[];
}

interface IFillQuestion extends IQuestion {
  typ: QuestionType.Fill;
  text: string;
  answer: (string | string[])[];
}

interface IMultipleQuestion extends IQuestion {
  typ: QuestionType.Multiple;
  options: { [key: string]: string };
  answer: string[];
}

interface IOrderQuestion extends IQuestion {
  typ: QuestionType.Order;
  order1: string[];
  order2: string[][];
  answer: number[][];
}

interface ISimpleQuestion extends IQuestion {
  typ: QuestionType.Simple;
  text: string;
  answer: string[];
}