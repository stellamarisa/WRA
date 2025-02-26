import './App.css'
import { Container, Content, Footer, Header, Message, Steps, useToaster } from 'rsuite'
import { createContext, useRef, useState } from 'react'
import QUESTIONS from './assets/catalog.json'
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import CheckIcon from '@rsuite/icons/Check';
import ReloadIcon from '@rsuite/icons/Reload';
import Question from './questions';
import TabButton from './ui/TabButton';
import AnswerIcon from './ui/AnswerIcon';

export const QuestionsContext = createContext({
  question: QUESTIONS[0] as IQuestion,
  solved: undefined as boolean | undefined,
  setSolved: undefined as Function | undefined,
  answers: new Map<number, string | string[] | number[][]>()
});

function App() {
  const toaster = useToaster();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solved, setSolved] = useState<(boolean | undefined)[]>(QUESTIONS.map(() => undefined));
  const [answers, setAnswers] = useState(new Map<number, string | string[] | number[][]>())
  const ref = useRef<{ solve?: () => boolean }>({ solve: undefined });
  const nextTimer = useRef<number>();

  function solve() {
    const value = ref.current?.solve?.();
    setSolved(s => s.toSpliced(currentIndex, 1, value));
    
    toaster.push(
      <Message showIcon type={value ? "success" : "error"} className="bottom-20">
        {solved.filter((s, i) => s || i === currentIndex && value).length} von {QUESTIONS.length} Fragen richtig beantwortet
      </Message>,
      { duration: 2000, placement: "bottomEnd", container: () => document.getElementById("toast-container") || document.body }
    );
    
    nextTimer.current = setTimeout(() => {
      nextTimer.current = undefined;
      if (QUESTIONS[currentIndex + 1] != undefined && solved[currentIndex + 1] == undefined)
        setCurrentIndex(i => ++i)
      else
        setCurrentIndex(QUESTIONS.length);
    }, 2000);
  }

  function stopTimer() {
    nextTimer.current && clearTimeout(nextTimer.current);
    nextTimer.current = undefined;
  }

  function reset() {
    stopTimer();
    answers.delete(QUESTIONS[currentIndex]?.id);
    setAnswers(new Map(answers));
    setSolved(s => s.toSpliced(currentIndex, 1, undefined));
  }

  return (
    <QuestionsContext.Provider value={{ question: QUESTIONS[currentIndex] as IQuestion, solved: solved[currentIndex], setSolved, answers }}>
      <Container className='flex flex-col w-full h-full'>
        <Header className='w-full flex justify-center p-2 bg-gray-300'>          
          <Steps small current={currentIndex} className='w-fit cursor-pointer'>
            {solved.map((_, i) => <Steps.Item onClick={() => setCurrentIndex(i)} status={i === currentIndex ? "process" : solved[i] ? "finish" : solved[i] != undefined && !solved[i] ? "error" : i < currentIndex ? "wait" : undefined} key={i} />)}
          </Steps>
        </Header>
        <Content className='grow bg-gray-200 p-10 overflow-auto' id="toast-container">
          {currentIndex >= QUESTIONS.length
            ? <>
                <h1 className='mb-4 text-xl border-b border-b-(--rs-primary-500)'>Test beendet</h1>
                <p>Du hast {solved.filter(s => s).length} von {QUESTIONS.length} Fragen richtig beantwortet.</p>
                <p>Du kannst deine Antworten jetzt noch korrigieren oder übersprungene Fragen wiederholen:</p>
                <ol className='mt-4 mx-auto w-1/2 min-w-100 text-left space-y-4'>
                  {QUESTIONS.map((q, i) => <div className='flex gap-4 *:min-w-6' key={i}>
                    <AnswerIcon value={solved[i]} />
                    <a onClick={() => setCurrentIndex(i)} className='cursor-pointer hover:font-bold'>{q.question}</a>
                  </div>)}
                </ol>
              </>
            : <Question ref={ref} />}
        </Content>
        <Footer className='flex justify-evenly bg-(--rs-primary-500) py-2'>
          <TabButton title='Zurück' icon={ArrowLeftLineIcon} enabled={currentIndex > 0} onClick={() => { stopTimer(); setCurrentIndex(i => --i); }}/>
          <TabButton title='Beantworten' icon={CheckIcon} enabled={QUESTIONS[currentIndex] && solved[currentIndex] == undefined} onClick={solve} />
          <TabButton title='Neuer Versuch' icon={ReloadIcon} enabled={solved[currentIndex] != undefined} onClick={reset} />
          <TabButton title='Weiter' icon={ArrowRightLineIcon} enabled={currentIndex < (QUESTIONS.length - 1)} onClick={() => { stopTimer(); setCurrentIndex(i => ++i); }} />
        </Footer>
      </Container>
    </QuestionsContext.Provider>
  )
}

export default App;