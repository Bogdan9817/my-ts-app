import { useEffect, useState } from "react";
import "./styles/styles.scss";
type ScoreData = {
  score: string;
  name: string;
  complexity: string;
};

export default function Scoreboard() {
  const [data, setData] = useState<ScoreData[]>([]);

  useEffect(() => {
    const scores = localStorage.getItem("scores")?.split(",") || [];

    const values = scores.map((val) => {
      let s = val.split("-");
      return {
        score: s[1],
        name: s[0],
        complexity: s[2],
      };
    });
    setData(values);
  }, []);

  return (
    <div>
      Scoreboard
      <ul className='scoreboard-list'>
        {data.length > 0 && (
          <li>
            <span>Name</span>
            <span>Complexity</span>
            <span>Score</span>
          </li>
        )}
        {data.map((el, idx) => {
          return (
            <li key={idx}>
              <span>{el.name}:</span> <span>{el.complexity}</span>{" "}
              <span>{el.score}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
