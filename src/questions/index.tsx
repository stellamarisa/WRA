import { forwardRef, useContext } from "react";
import { QuestionsContext } from "../App";
import MultipleChoice from "./MultipleChoice";
import FillText from "./FillText";
import Order from "./Order";
import Simple from "./Simple";

export type QuestionRef = { solve?: () => boolean };

const Question = forwardRef<QuestionRef, {}>((_, ref) => {
  const { question } = useContext(QuestionsContext);

  function getQuestionType() {
    switch(question?.typ) {
      case "FillText":
        return <FillText ref={ref} key={question.id} />;
      case "MultipleChoice":
        return <MultipleChoice ref={ref} key={question.id} />;
      case "Order":
        return <Order ref={ref} key={question.id} />;
      case "Simple":
        return <Simple ref={ref} key={question.id} />;
      default:
        return "Unbekannte Frage";
    }
  }

  return (<>
    <h1 className="mb-4 text-xl border-b border-b-(--rs-primary-500)">{question?.question}</h1>
    {getQuestionType()}
  </>)
});
 
export default Question;