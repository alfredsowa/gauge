import { rem, Tooltip } from "@mantine/core"
import { IconQuestionMark } from "@tabler/icons-react"
// import { FaQuestionCircle } from "react-icons/fa";


const InfoToolTip = ({text}:{text: string}) => {
  return (
    <Tooltip arrowOffset={14} arrowSize={5} label={text} withArrow position="top-start">
      <IconQuestionMark style={{ width: rem(16), height: rem(16) }}
      stroke={4} />
      {/* <FaQuestionCircle  style={{ width: rem(16), height: rem(16) }}/> */}
    </Tooltip>
  )
}

export default InfoToolTip
