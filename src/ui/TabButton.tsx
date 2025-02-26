import type CheckIcon from '@rsuite/icons/Check';

export default (props: { title: string, icon: typeof CheckIcon, enabled: boolean, onClick: Function }) => {
  return (
    <div className={`flex flex-col items-center gap-2 w-1/4 select-none cursor-pointer ${props.enabled ? "" : "opacity-50"}`} onClick={() => props.enabled && props.onClick()}>
      <div>
        <props.icon style={{ fontSize: "2em", padding: props.icon.displayName === "Reload" ? ".125em" : "0" }} color="white" />
      </div>
      <div className='text-white'>
        {props.title}
      </div>
    </div>
  )
}