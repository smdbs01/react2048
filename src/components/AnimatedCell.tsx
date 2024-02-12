import { useSpring, animated } from "react-spring";

import {
  getBackgroundColor,
  getFontColor,
  getFontSize,
  getLineHeight,
} from "../utils/cellProperty";

const getY = (idx: number): string => {
  return 24 + Math.floor(idx / 4) * 162 + "px";
};

const getX = (idx: number): string => {
  return 24 + (idx % 4) * 162 + "px";
};

export default function AnimatedCell(props: {
  val: number;
  from: number;
  to: number;
  isStay: boolean;
}) {
  const spring = useSpring({
    from: {
      x: getX(props.from),
      y: getY(props.from),
      scale: 1,
    },
    to: {
      x: getX(props.to),
      y: getY(props.to),
      scale: props.isStay ? 1 : 0.6,
    },
    config: { mass: 5, tension: 300, friction: 0, clamp: true },
  });

  return (
    <animated.div
      className={
        "flex items-center justify-center rounded-lg size-[138px] font-bold absolute z-5"
      }
      style={{
        background: getBackgroundColor(props.val),
        color: getFontColor(props.val),
        fontSize: getFontSize(props.val),
        lineHeight: getLineHeight(props.val),
        left: spring.x,
        top: spring.y,
        scale: spring.scale,
      }}
    >
      {props.val === 0 ? "" : props.val}
    </animated.div>
  );
}
