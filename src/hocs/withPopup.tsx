import { useEffect } from "react";
import GameForm from "../components/game-form/GameForm";
import Lost from "../components/lost/Lost";
import Scoreboard from "../components/scoreboard/Scoreboard";
import Win from "../components/win/Win";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchToken,
  formError,
  initGame,
  switchStatus,
} from "../store/slices/gameSlice";

export default function withPopup(Component: any) {
  return function WithPopup() {
    const { status, userName, complexity, id } = useAppSelector(
      (state) => state.game
    );
    const dispatch = useAppDispatch();
    useEffect(() => {
      if (id) {
        dispatch(fetchToken(id));
      }
    }, [id]);

    if (status === "active") {
      return <Component />;
    }
    const buttonsLbls: Record<string, string> = {
      pending: "Start",
      scoreboard: "Start New Game",
      lost: "To scoreboard",
      win: "To scoreboard",
    };
    const handleClick = () => {
      if (status === "pending") {
        if (userName != null && userName != "" && complexity) {
          dispatch(initGame({ name: userName, complexity: `${complexity}` }));
        } else {
          dispatch(formError());
        }
        return;
      }
      if (status === "lost" || status === "win") {
        return dispatch(switchStatus("scoreboard"));
      }
      if (status === "scoreboard") return dispatch(switchStatus("pending"));
    };
    return (
      <div className='popup__outer'>
        <div className='popup__inner'>
          <div className='popup__inner-wrapper'>
            {status === "scoreboard" ? <Scoreboard /> : ""}
            {status === "lost" ? <Lost /> : ""}
            {status === "win" ? <Win /> : ""}
            {status === "pending" ? <GameForm /> : ""}
          </div>
          <button onClick={handleClick}>{buttonsLbls[status]}</button>
        </div>
      </div>
    );
  };
}
