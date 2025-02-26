import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from "react";
import { QuestionsContext } from "../App";
import { List } from "rsuite";
import { QuestionRef } from ".";
import { MovedItemInfo } from "rsuite/esm/List/helper/useSortHelper";
import AnswerIcon from "../ui/AnswerIcon";
import DragableIcon from '@rsuite/icons/Dragable';

function isEqual(array1: IOrderQuestion["answer"][0], array2: number[]) {
  return array1.length === array2.length && array1.every((v, i) => v === array2[i]);
}

const Order = forwardRef<QuestionRef, {}>((_, ref) => {
  const { question, answers, solved } = useContext(QuestionsContext);
  
  if (question?.typ !== "Order" || !("order1" in question))
    return "Unbekannte Frage";

  const q = question as IOrderQuestion;
  const blankAnswer = q.answer?.map((a) => a.map((_, i) => i));
  const [values, setValues] = useState(answers.get(q.id) as number[][] ?? blankAnswer);
    
  useEffect(() => {
    setValues(answers.get(question.id) as number[][] ?? blankAnswer);
  }, [answers.get(question.id)]);

  const handleSortEnd = (valueIndex: number) => ({ oldIndex, newIndex }: MovedItemInfo) =>
    setValues(prvData => {
      const movedData = prvData[valueIndex].splice(oldIndex, 1);
      const newData = [...prvData];
      newData[valueIndex] = prvData[valueIndex].toSpliced(newIndex, 0, ...movedData);
      return newData;
    });

  const sortAnswers = (list: string[], valueIndex: number) => (a: string, b: string) => {
    const aIndex = values[valueIndex].findIndex(ix => ix === list.findIndex(l => l === a)) + 1;
    const bIndex = values[valueIndex].findIndex(ix => ix === list.findIndex(l => l === b)) + 1;
    return aIndex - bIndex;
  }

  useImperativeHandle(ref, () => ({
    solve: () => {
      values && answers.set(q.id, values);
      const isCorrect = !!values && q.answer && q.answer.every((a, i) => isEqual(a, values[i]));
      return isCorrect;
    }
  }), [q?.answer, values, answers]);

  return (
    <div className="flex gap-4">
      <List bordered className="w-1/3 *:min-h-30 xs:*:min-h-20 md:*:min-h-12">
        {q.order1.map((text, index) => (
          <List.Item key={index} index={index} lang="de-DE" className="flex items-center hyphens-auto text-left text-gray-500">
            {text}
          </List.Item>
        ))}
      </List>
      {q.order2.map((list, i) => 
        <List sortable bordered key={i} className="flex-1 *:min-h-30 xs:*:min-h-20 md:*:min-h-12" onSort={handleSortEnd(i)}>
          {[...list].sort(sortAnswers(list, i)).map((text, index) => (
            <List.Item key={index} index={index} className="flex items-center justify-between gap-4 *:min-w-6">
              <DragableIcon className="text-gray-400" />
              <span lang="de-DE" className="hyphens-auto text-left flex-1">{text}</span>
              {solved !== undefined && <AnswerIcon value={q.answer[i][index] === values[i][index]} />}
            </List.Item>
          ))}
        </List>
      )}
    </div>
  );
});
 
export default Order;