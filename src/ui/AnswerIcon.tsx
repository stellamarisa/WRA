import CheckRoundIcon from '@rsuite/icons/CheckRound';
import WarningRoundIcon from '@rsuite/icons/WarningRound';
import RunningRoundIcon from '@rsuite/icons/RunningRound';

export default ({ value }: { value: boolean | undefined }) => {
  if (value === undefined)
    return <RunningRoundIcon color="gray" style={{ fontSize: "1.5em" }} />;
  return value 
    ? <CheckRoundIcon color="yellowgreen" style={{ fontSize: "1.5em" }} />
    : <WarningRoundIcon color="indianred" style={{ fontSize: "1.5em" }} />;
}