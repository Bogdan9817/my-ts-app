import "../styles/counter.scss";

type CounterProps = {
  setValue: (state: any) => void;
  value: number;
};

export default function Counter(props: CounterProps) {
  const increment = () => {
    props.setValue(props.value + 1);
  };

  const decrement = () => {
    props.setValue(props.value - 1);
  };

  return (
    <div className='counter'>
      <button onClick={decrement}>-</button>
      <span>{props.value}</span>
      <button onClick={increment}>+</button>
    </div>
  );
}
