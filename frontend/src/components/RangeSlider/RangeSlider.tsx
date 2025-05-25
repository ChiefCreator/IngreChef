import { Slider } from "@base-ui-components/react/slider";


import styles from "./RangeSlider.module.scss";

interface RangeSliderProps {
  className?: string;
  min: number;
  max: number;
  value: number | number[];
  defaultValue?: number | number[];

  onChange: (value: number | number[]) => void;
  onComplete?: (value: number | number[]) => void;
}

function isValueNum(value: RangeSliderProps["value"]): value is number  {
  return typeof value === "number";
}
function isValueArr(value: RangeSliderProps["value"]): value is number[]  {
  return Array.isArray(value);
}

export default function RangeSlider({ className = "", min, max, defaultValue, value, onChange, onComplete }: RangeSliderProps) {
  const getDefaultValue = (value: RangeSliderProps["value"]) => {
    if (isValueArr(value)) {
      return defaultValue || [min, max];
    }
    if (isValueNum(value)) {
      return defaultValue || min;
    }

    return 0;
  };

  const currentValue = value || getDefaultValue(value);

  return (
    <Slider.Root
      className={`${styles.range} ${className}`}
      min={min}
      max={max}
      value={currentValue}
      largeStep={1}
      minStepsBetweenValues={5}

      onValueChange={onChange}
      onValueCommitted={() => onComplete?.(value)}
    >
      <Slider.Control className={styles.rangeControl}>
        <Slider.Track className={styles.rangeTrack}>
          <Slider.Indicator className={styles.rangeIndicator} />
            {isValueArr(currentValue) && currentValue.map((_, index) => (
              <Slider.Thumb key={index} className={styles.rangeThumb} />
            ))}

            {isValueNum(currentValue) && (
              <Slider.Thumb className={styles.rangeThumb} />
            )}
          {}
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  );
}