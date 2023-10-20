import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setupName } from "../../store/slices/gameSlice";

export default function Win() {
  const { score, userName, complexity } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const scores = localStorage.getItem("scores")?.split(",") || [];
    if (!scores.includes(`${userName}-${score}-${complexity}`)) {
      scores.push(`${userName}-${score}-${complexity}`);
      const updated_scores = scores.sort(
        (a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1])
      );
      localStorage.setItem("scores", updated_scores.join(","));
    }

    dispatch(setupName(null));
  }, []);
  return (
    <div>
      <h2>You win!</h2>
    </div>
  );
}
