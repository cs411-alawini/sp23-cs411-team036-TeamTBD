import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "./App.css"

const StoreprocedureTable = () => {

    const [spdata, setSpdata] = useState(null);
    const [gameIDs, setGameIDs] = useState(null);

    useEffect(() => {
        const getspdata = async () => {
            const res = await axios.get("http://localhost:3002/api/storeprocedure");
            setSpdata(res.data.sqldata[1]);

            setGameIDs(res.data.sqldata[0]);
        };

        getspdata();
    }, []);

    
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Required Age</th>
                        <th>Game Count</th>
                    </tr>
                </thead>
                <tbody>
                    {spdata?.map((row) => (
                        <tr key={row.requiredAge}>
                            <td>{row.requiredAge}</td>
                            <td>{row.game_count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            
            <table>
                <thead>
                    <tr>
                        <th>Game IDs of Games That Are Less Than Or Equal To The Average Game Price</th>
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

export default StoreprocedureTable;
