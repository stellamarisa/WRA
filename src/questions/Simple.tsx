import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import { QuestionsContext } from "../App";
import { Input, InputGroup } from "rsuite";
import AnswerIcon from "../ui/AnswerIcon";
import { QuestionRef } from ".";

const Simple = forwardRef<QuestionRef, {}>((_, ref) => {
  const { question, solved, answers } = useContext(QuestionsContext);
  const [value, setValue] = useState(answers.get(question.id) as string ?? "");

  useEffect(() => {
    setValue(answers.get(question.id) as string ?? "");
  }, [answers.get(question.id)]);
  
  if (question?.typ !== "Simple" || !("text" in question))
    return "Unbekannte Frage";

  const q = question as ISimpleQuestion;

  useImperativeHandle(ref, () => ({
    solve: () => {
      value && answers.set(q.id, value);
      const isCorrect = !!value && q.answer && q.answer.includes(value);
      return isCorrect;
    }
  }), [q?.answer, value, answers]);

  return (<div className="flex flex-col items-center gap-4">
    <span>{q.text}</span>
    <InputGroup inside>
      <Input placeholder="Antwort" value={value} className="w-full sm:w-1/2" onChange={(v) => setValue(v)} disabled={solved !== undefined} />
      {solved !== undefined &&
        <InputGroup.Addon className="py-0">
          <AnswerIcon value={solved} />
        </InputGroup.Addon>}
    </InputGroup>
  </div>);
});
 
export default Simple;