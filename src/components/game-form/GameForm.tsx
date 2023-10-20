import { SetStateAction } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setupComplexity, setupName } from "../../store/slices/gameSlice";
import Counter from "./parts/Counter";

import "./styles/styles.scss";

export default function GameForm() {
  const { complexity } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const handleChange = (e: {
    target: { value: SetStateAction<string | undefined> };
  }) => {
    dispatch(setupName(e.target.value));
  };

  const counterChange = (value: number) => {
    dispatch(setupComplexity(value));
  };

  return (
    <div className='game__form'>
      <label htmlFor='name'>Print your name</label>
      <input onChange={handleChange} type='text' id='name' required />
      <label>Game complexity</label>
      <Counter setValue={counterChange} value={complexity} />
    </div>
  );
}
