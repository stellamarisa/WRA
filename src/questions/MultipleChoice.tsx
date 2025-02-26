import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import { QuestionsContext } from "../App";
import { Checkbox, CheckboxGroup } from "rsuite";
import AnswerIcon from "../ui/AnswerIcon";
import { QuestionRef } from ".";

function isEqual(array1: IMultipleQuestion["answer"], array2: string[]) {
  return array1.sort().length === array2.sort().length && array1.every((v, i) => v === array2[i]);
}

const MultipleChoice = forwardRef<QuestionRef, {}>((_, ref) => {
  const { question, answers, solved } = useContext(QuestionsContext);
  const [values, setValues] = useState(answers.get(question.id) as string[] ?? []);
  
  useEffect(() => {
    setValues(answers.get(question.id) as string[] ?? []);
  }, [answers.get(question.id)]);
  
  if (question?.typ !== "MultipleChoice" || !("options" in question))
    return "Unbekannte Frage";
  
  const q = question as IMultipleQuestion;

  useImperativeHandle(ref, () => ({
    solve: () => {
      values && answers.set(q.id, values);
      const isCorrect = !!values && q.answer && isEqual(q.answer, values);
      return isCorrect;
    }
  }), [q?.answer, values, answers]);

  return (<CheckboxGroup name="checkbox-group" className="text-left space-y-4" value={values} onChange={(v) => setValues(v as string[])} disabled={solved !== undefined}>
    {Object.entries(q.options).map(([key, option]) => (
      <Checkbox value={key} key={key} className="*:py-1.5">
        <div className="flex items-center justify-between ml-4 mb-1 gap-4 min-h-6 *:min-w-6">
          <span>{option}</span> {/* {key}:  */}
          {solved !== undefined && <AnswerIcon value={!q.answer.includes(key) && !values.includes(key) || q.answer.includes(key) && values.includes(key)} />}
        </div>
      </Checkbox>
    ))}
  </CheckboxGroup>);
});
 
export default MultipleChoice;