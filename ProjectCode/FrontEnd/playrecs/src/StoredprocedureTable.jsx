import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, registerables} from 'chart.js';
Chart.register(...registerables);

const StoreprocedureChart = () => {
  const [chartData, setChartData] = useState(null);
  const [gameIDs, setGameIDs] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:3002/api/storeprocedure");

      const labels = [];
      const data = [];

      res.data.sqldata[1].forEach((row) => {
        labels.push(row.requiredAge);
        data.push(row.game_count);
      });

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Game Count by Required Age",
            data: data,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      });
      setGameIDs(res.data.sqldata[0]);
    };

    fetchData();
  }, []);

  return (
    <div>
      {chartData && (
        <Bar
          data={chartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      )}
      <table>
                    <thead>
                        <tr>
                            <th>Game IDs</th>
                        </tr>
                    </thead>
                    <tbody>
                    {gameIDs?.map((row) => (
                        <tr key={row.game_id}>
                            <td>{row.game_id}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
    </div>
  );
};

export default StoreprocedureChart;
