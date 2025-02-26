import { forwardRef, Fragment, useContext, useEffect, useImperativeHandle, useState } from "react";
import { QuestionsContext } from "../App";
import { Input, InputGroup } from "rsuite";
import AnswerIcon from "../ui/AnswerIcon";
import { QuestionRef } from ".";

function isEqual(array1: IFillQuestion["answer"], array2: string[]) {
  return array1.length === array2.length && array1.every((v, i) => Array.isArray(v) && v.includes(array2[i]) || v === array2[i]);
}

const FillText = forwardRef<QuestionRef, {}>((_, ref) => {
  const { question, solved, answers } = useContext(QuestionsContext);
  const blankAnswer = question.answer?.map((_) => "");
  const [values, setValues] = useState(answers.get(question.id) as string[] ?? blankAnswer);

  useEffect(() => {
    setValues(answers.get(question.id) as string[] ?? blankAnswer);
  }, [answers.get(question.id)]);
  
  if (question?.typ !== "FillText" || !("text" in question))
    return "Unbekannte Frage";

  const q = question as IFillQuestion;
  const texts = q.text.split("{?}");
  
  useImperativeHandle(ref, () => ({
    solve: () => {
      values && answers.set(q.id, values);
      const isCorrect = !!values && q.answer && isEqual(q.answer, values);
      return isCorrect;
    }
  }), [q?.answer, values, answers]);

  return (
    <div className="text-left leading-10 whitespace-pre-wrap">
      {texts.map((t, i) => <Fragment key={t}>
        <span>{t}</span>
        {i < q.answer?.length && 
          <InputGroup inside className="w-32 inline-flex">
            <Input value={values[i]} onChange={(v) => setValues(s => s.toSpliced(i, 1, v))} disabled={solved !== undefined} />
            {solved !== undefined &&
              <InputGroup.Addon className="py-0">
                <AnswerIcon value={solved} />
              </InputGroup.Addon>}
          </InputGroup>}
      </Fragment>)}
    </div>
  );
});
 
export default FillText;